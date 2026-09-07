import Image from "next/image";
import type { ReactNode } from "react";

export function PageHero({
  title,
  subtitle,
  subtitleClassName = "mt-3",
  children,
}: {
  title: string;
  subtitle?: string;
  subtitleClassName?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden py-16 text-center text-white sm:py-20">
      <Image
        src="/images/dark-bamboo-forest.webp"
        alt="Bamboo forest"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-black/40" />
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className={`mx-auto max-w-2xl text-white/90 ${subtitleClassName}`}>{subtitle}</p>}
        {children && <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">{children}</div>}
      </div>
    </section>
  );
}
