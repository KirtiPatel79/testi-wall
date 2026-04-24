"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SCROLL_DURATION_MS = 32;
const AUTO_SCROLL_SPEED = 0.9;

function matchHeight(container: HTMLElement | null) {
  if (!container) return;
  const slides = container.querySelectorAll<HTMLElement>(".embla__slide");
  const cards = Array.from(slides)
    .map((s) => s.firstElementChild)
    .filter((el): el is HTMLElement => el instanceof HTMLElement);

  if (cards.length === 0) return;

  // Reset so height can shrink as well as grow.
  cards.forEach((c) => {
    c.style.minHeight = "";
  });

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
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      containScroll: "trimSnaps",
      dragFree: autoplay,
      loop: true,
      skipSnaps: false,
      duration: SCROLL_DURATION_MS,
    },
    autoplay
      ? [
          AutoScroll({
            speed: AUTO_SCROLL_SPEED,
            startDelay: 600,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            stopOnFocusIn: true,
          }),
        ]
      : []
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useLayoutEffect(() => {
    const run = () => matchHeight(containerRef.current);
    run();
    const t = setTimeout(run, 100);
    emblaApi?.on("init", run);
    emblaApi?.on("reInit", run);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", run);
    }
    return () => {
      clearTimeout(t);
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", run);
      }
    };
  }, [children, emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelected(emblaApi.selectedScrollSnap());
    };
    setSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!autoplay || !emblaApi) return;

    const autoScroll = emblaApi.plugins().autoScroll;
    autoScroll?.play();

    return () => {
      autoScroll?.stop();
    };
  }, [autoplay, emblaApi]);

  const pauseAutoScroll = useCallback(() => {
    if (!autoplay) return;
    emblaApi?.plugins().autoScroll?.stop();
  }, [autoplay, emblaApi]);

  const resumeAutoScroll = useCallback(() => {
    if (!autoplay) return;
    emblaApi?.plugins().autoScroll?.play();
  }, [autoplay, emblaApi]);

  useEffect(() => {
    if (!emblaApi || autoplay) return;
    const node = rootRef.current;
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        emblaApi.scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        emblaApi.scrollNext();
      }
    };
    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [emblaApi, autoplay]);

  return (
    <div
      ref={rootRef}
      tabIndex={autoplay ? -1 : 0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onMouseEnter={pauseAutoScroll}
      onMouseLeave={resumeAutoScroll}
      onFocus={pauseAutoScroll}
      onBlur={resumeAutoScroll}
      onTouchStart={pauseAutoScroll}
      onTouchEnd={resumeAutoScroll}
      className={cn(
        "embla-twall group/carousel relative outline-none",
        autoplay ? "px-0" : "px-12",
        !autoplay && "focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl"
      )}
    >
      {/* Edge fade masks — only meaningful on autoplay */}
      {autoplay && (
        <>
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 z-20 w-12 md:w-24",
              "bg-gradient-to-r",
              isDark ? "from-slate-900 to-transparent" : "from-white to-transparent"
            )}
          />
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 z-20 w-12 md:w-24",
              "bg-gradient-to-l",
              isDark ? "from-slate-900 to-transparent" : "from-white to-transparent"
            )}
          />
        </>
      )}
      <div className="overflow-hidden" ref={emblaRef}>
        <div ref={containerRef} className="-ml-4 flex touch-pan-y">
          {React.Children.map(children, (child, i) => (
            <div
              key={i}
              className="embla__slide min-w-0 flex-[0_0_min(340px,85vw)] pl-4"
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      {!autoplay && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className={cn(
              "absolute left-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-30",
              isDark
                ? "border-slate-600/70 bg-slate-800/70 text-slate-100 hover:bg-slate-700/80"
                : "border-slate-300/80 bg-white/80 text-slate-700 hover:bg-white"
            )}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className={cn(
              "absolute right-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-30",
              isDark
                ? "border-slate-600/70 bg-slate-800/70 text-slate-100 hover:bg-slate-700/80"
                : "border-slate-300/80 bg-white/80 text-slate-700 hover:bg-white"
            )}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          {snaps.length > 1 && (
            <div
              className="mt-5 flex items-center justify-center gap-2"
              role="tablist"
              aria-label="Select testimonial"
            >
              {snaps.map((_, i) => {
                const active = i === selected;
                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-label={`Go to slide ${i + 1}`}
                    aria-selected={active}
                    onClick={() => scrollTo(i)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      active
                        ? isDark
                          ? "w-6 bg-slate-100"
                          : "w-6 bg-slate-900"
                        : isDark
                          ? "w-2 bg-slate-500/60 hover:bg-slate-400"
                          : "w-2 bg-slate-300 hover:bg-slate-400"
                    )}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
