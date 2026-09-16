import Image from "next/image";
import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export function ClassListingCard({
  title,
  meta,
  description,
  image,
  imageAlt,
  href,
}: {
  title: string;
  meta: string;
  description: string;
  image?: string;
  imageAlt: string;
  href?: string;
}) {
  const card = (
    <div className="grid overflow-hidden rounded-lg shadow-md sm:grid-cols-[14rem_1fr]">
      <div className="relative h-40 sm:h-auto">
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 640px) 224px, 100vw"
            className="object-cover"
          />
        ) : (
          <PlaceholderImage label={imageAlt} className="h-full w-full" />
        )}
      </div>
      <div>
        <div className="bg-[#5e703a] px-4 py-3 text-center">
          <p className="text-lg font-bold uppercase tracking-wide text-white">{title}</p>
        </div>
        <div className="px-6 py-5 text-center">
          <p className="font-medium text-[#5e703a]">{meta}</p>
          <p className="mt-2 text-sm text-zinc-600">{description}</p>
        </div>
      </div>
    </div>
  );

  if (!href) return card;

  return (
    <Link href={href} className="block transition-opacity hover:opacity-90">
      {card}
    </Link>
  );
}
