import Image from "next/image";
import { getGooglePlaceReviews, type GoogleReview } from "@/lib/googlePlaces";

const FALLBACK_REVIEWS: GoogleReview[] = [
  { authorName: "[Student name]", rating: 5, text: "[Placeholder testimonial — replace with a real, consented review.]", relativeTime: "" },
  { authorName: "[Student name]", rating: 5, text: "[Placeholder testimonial — replace with a real, consented review.]", relativeTime: "" },
  { authorName: "[Student name]", rating: 5, text: "[Placeholder testimonial — replace with a real, consented review.]", relativeTime: "" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber-500" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          fill={index < Math.round(rating) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1}
          className="h-4 w-4"
        >
          <path d="M10 1.5l2.5 5.3 5.8.8-4.2 4.1 1 5.8L10 14.6l-5.1 2.9 1-5.8-4.2-4.1 5.8-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export async function GoogleReviews() {
  const result = await getGooglePlaceReviews();
  const isLive = Boolean(result?.reviews?.length);
  const reviews = isLive ? result!.reviews : FALLBACK_REVIEWS;

  return (
    <div>
      <div className="flex gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reviews.map((review, index) => (
          <div key={index} className="w-72 shrink-0 rounded-lg bg-white p-6 shadow-md">
            <StarRating rating={review.rating} />
            <p className="mt-3 text-sm text-zinc-600">&ldquo;{review.text}&rdquo;</p>
            <div className="mt-4 flex items-center gap-3">
              {review.authorPhotoUrl ? (
                <Image
                  src={review.authorPhotoUrl}
                  alt={review.authorName}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600">
                  {review.authorName.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-zinc-900">{review.authorName}</p>
                {review.relativeTime && <p className="text-xs text-zinc-500">{review.relativeTime}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLive ? (
        <p className="mt-4 text-center text-xs text-white/70">
          {result?.overallRating && result?.totalReviews
            ? `${result.overallRating.toFixed(1)} average from ${result.totalReviews} Google reviews`
            : "Reviews via Google"}
        </p>
      ) : (
        <p className="mt-4 text-center text-xs text-white/70">
          [Placeholder reviews — connect Google Places API for live reviews.]
        </p>
      )}
    </div>
  );
}
