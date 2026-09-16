export interface GoogleReview {
  authorName: string;
  authorPhotoUrl?: string;
  authorProfileUrl?: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export interface GooglePlaceReviewsResult {
  reviews: GoogleReview[];
  overallRating?: number;
  totalReviews?: number;
  mapsUrl?: string;
}

interface PlacesApiReview {
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
}

interface PlacesApiResponse {
  reviews?: PlacesApiReview[];
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
}

// Server-only: this must never run in a Client Component, since it uses a
// secret API key. Fetched with a 24h revalidate window, well within Google
// Maps Platform's caching allowance, so reviews stay reasonably fresh
// without hitting the API on every request.
export async function getGooglePlaceReviews(): Promise<GooglePlaceReviewsResult | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) return null;

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews,rating,userRatingCount,googleMapsUri",
      },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      console.error("Google Places API request failed", response.status, await response.text());
      return null;
    }

    const data = (await response.json()) as PlacesApiResponse;

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .filter((review) => review.text?.text)
      .map((review) => ({
        authorName: review.authorAttribution?.displayName ?? "Google user",
        authorPhotoUrl: review.authorAttribution?.photoUri,
        authorProfileUrl: review.authorAttribution?.uri,
        rating: review.rating ?? 5,
        text: review.text!.text!,
        relativeTime: review.relativePublishTimeDescription ?? "",
      }));

    return {
      reviews,
      overallRating: data.rating,
      totalReviews: data.userRatingCount,
      mapsUrl: data.googleMapsUri,
    };
  } catch (error) {
    console.error("Failed to fetch Google reviews", error);
    return null;
  }
}
