"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const AUTOPLAY_INTERVAL_MS = 3500;

function matchHeight(container: HTMLElement | null) {
  if (!container) return;
  const slides = container.querySelectorAll(".embla__slide");
  const cards = Array.from(slides)
    .map((s) => s.firstElementChild)
    .filter((el): el is HTMLElement => el instanceof HTMLElement);

  if (cards.length === 0) return;

  const maxH = Math.max(...cards.map((c) => c.offsetHeight));
  cards.forEach((c) => {
    c.style.minHeight = `${maxH}px`;
  });
}

export function TestimonialCarousel({
  children,
  isDark,
  autoplay = false,
}: {
  children: React.ReactNode;
  isDark: boolean;
  autoplay?: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: true,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useLayoutEffect(() => {
    const run = () => matchHeight(containerRef.current);
    run();
    const t = setTimeout(run, 100);
    emblaApi?.on("init", run);
    emblaApi?.on("reInit", run);
    return () => clearTimeout(t);
  }, [children, emblaApi]);

  useEffect(() => {
    if (!autoplay || !emblaApi) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    const root = rootRef.current;

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const start = () => {
      stop();
      timer = setInterval(() => {
        emblaApi.scrollNext();
      }, AUTOPLAY_INTERVAL_MS);
    };

    const handlePointerDown = () => stop();
    const handlePointerUp = () => start();

    start();
    root?.addEventListener("mouseenter", stop);
    root?.addEventListener("mouseleave", start);
    emblaApi.on("pointerDown", handlePointerDown);
    emblaApi.on("pointerUp", handlePointerUp);

    return () => {
      stop();
      root?.removeEventListener("mouseenter", stop);
      root?.removeEventListener("mouseleave", start);
      emblaApi.off("pointerDown", handlePointerDown);
      emblaApi.off("pointerUp", handlePointerUp);
    };
  }, [autoplay, emblaApi]);

  return (
    <div ref={rootRef} className="embla-twall relative px-12">
      <div className="overflow-hidden" ref={emblaRef}>
        <div ref={containerRef} className="-ml-4 flex touch-pan-x">
          {React.Children.map(children, (child, i) => (
            <div key={i} className="embla__slide min-w-0 flex-[0_0_min(340px,85vw)] pl-4">
              {child}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={scrollPrev}
        className={cn(
          "absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-30",
          isDark
            ? "bg-slate-700/90 text-white shadow-lg hover:bg-slate-600"
            : "bg-white/95 text-slate-700 shadow-lg hover:bg-white"
        )}
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        className={cn(
          "absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-30",
          isDark
            ? "bg-slate-700/90 text-white shadow-lg hover:bg-slate-600"
            : "bg-white/95 text-slate-700 shadow-lg hover:bg-white"
        )}
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
