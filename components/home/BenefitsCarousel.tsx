"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface Benefit {
  title: string;
  description: string;
  icon: ReactNode;
}

const CARD_BG = "#5e703a";
const DOT_COUNT = 3;

function BenefitCard({ benefit }: { benefit: Benefit }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((value) => !value)}
      aria-pressed={flipped}
      className="h-72 w-56 shrink-0 snap-center text-left [perspective:1000px]"
    >
      <div
        className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition-shadow [backface-visibility:hidden] hover:shadow-md">
          <div style={{ backgroundColor: CARD_BG }} className="px-3 py-3 text-center">
            <p className="text-base font-semibold uppercase tracking-wide text-white">
              {benefit.title}
            </p>
          </div>
          <div className="flex flex-1 items-center justify-center text-zinc-700 [&_svg]:h-14 [&_svg]:w-14">
            {benefit.icon}
          </div>
          <p className="pb-3 text-center text-xs text-zinc-400">Tap to learn more</p>
        </div>

        <div
          style={{ backgroundColor: CARD_BG, transform: "rotateY(180deg)" }}
          className="absolute inset-0 flex items-center justify-center rounded-lg p-5 text-center text-sm text-white [backface-visibility:hidden]"
        >
          {benefit.description}
        </div>
      </div>
    </button>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className={`absolute top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md hover:bg-zinc-50 sm:flex ${
        direction === "left" ? "-left-4" : "-right-4"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  );
}

export function BenefitsCarousel({ benefits }: { benefits: Benefit[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  function updateScrollState() {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);
    const fraction = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
    setActiveDot(Math.round(fraction * (DOT_COUNT - 1)));
  }

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, []);

  function scrollByAmount(direction: "left" | "right") {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  function scrollToDot(dotIndex: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (dotIndex / (DOT_COUNT - 1)) * maxScroll, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent transition-opacity sm:w-16 ${
          canScrollLeft ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent transition-opacity sm:w-16 ${
          canScrollRight ? "opacity-100" : "opacity-0"
        }`}
      />

      {canScrollLeft && <ArrowButton direction="left" onClick={() => scrollByAmount("left")} />}
      {canScrollRight && <ArrowButton direction="right" onClick={() => scrollByAmount("right")} />}

      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {benefits.map((benefit) => (
          <BenefitCard key={benefit.title} benefit={benefit} />
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: DOT_COUNT }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollToDot(index)}
            aria-label={`Scroll to section ${index + 1} of ${DOT_COUNT}`}
            className={`h-2 rounded-full transition-all ${
              index === activeDot ? "w-6 bg-foreground" : "w-2 bg-zinc-300 hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
