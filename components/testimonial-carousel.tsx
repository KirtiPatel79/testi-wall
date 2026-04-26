"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SCROLL_DURATION_MS = 32;
// Pixels-per-second the autoplay marquee travels. Lower = slower / smoother
// perceived motion. ~40 px/s feels like testimonials.to.
const MARQUEE_SPEED_PX_PER_S = 40;

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

/**
 * Equalize card heights inside a marquee track. The track contains two copies
 * of the children; we measure across both copies so the loop boundary doesn't
 * visually jump.
 */
function matchMarqueeHeight(track: HTMLElement | null) {
  if (!track) return;
  const cards = track.querySelectorAll<HTMLElement>(".marquee__card");
  if (cards.length === 0) return;

  cards.forEach((c) => {
    c.style.minHeight = "";
  });

  const maxH = Math.max(...Array.from(cards).map((c) => c.offsetHeight));
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
  if (autoplay) {
    return <MarqueeCarousel isDark={isDark}>{children}</MarqueeCarousel>;
  }
  return <ManualCarousel isDark={isDark}>{children}</ManualCarousel>;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Marquee (autoplay) — pure CSS, GPU-accelerated, perfectly smooth.          */
/* ─────────────────────────────────────────────────────────────────────────── */

function MarqueeCarousel({
  children,
  isDark,
}: {
  children: React.ReactNode;
  isDark: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const halfRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [distancePx, setDistancePx] = useState<number | null>(null);

  const items = useMemo(() => React.Children.toArray(children), [children]);

  // Equalize card heights across both halves so the seam never jumps.
  useLayoutEffect(() => {
    const run = () => matchMarqueeHeight(trackRef.current);
    run();
    const t = setTimeout(run, 100);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", run);
    }
    return () => {
      clearTimeout(t);
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", run);
      }
    };
  }, [items.length]);

  // Measure the first half's width (plus the gap between halves) and use it
  // both to compute the loop distance and the duration. This keeps the velocity
  // constant across viewport widths and number of cards, and guarantees a
  // pixel-perfect seam — translating by exactly halfWidth + gap lands on a
  // visually identical card.
  useLayoutEffect(() => {
    const el = halfRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const update = () => {
      const halfW = el.scrollWidth;
      if (halfW <= 0) return;
      // The track is `flex gap-4` (16px). The translate distance must include
      // that gap so the duplicate slides into the same pixel position the
      // original started in.
      const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
      const distance = halfW + gap;
      setDistancePx(distance);
      setDuration(distance / MARQUEE_SPEED_PX_PER_S);
    };
    update();
    const t = setTimeout(update, 120);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", update);
      // ResizeObserver also catches font / image layout shifts.
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => {
        clearTimeout(t);
        window.removeEventListener("resize", update);
        ro.disconnect();
      };
    }
    return () => clearTimeout(t);
  }, [items.length]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      className="twall-marquee group/carousel relative overflow-hidden"
      style={
        {
          // CSS variables consumed by globals.css (.twall-marquee).
          "--twall-marquee-duration": duration ? `${duration}s` : "60s",
          "--twall-marquee-distance": distancePx
            ? `-${distancePx}px`
            : "-50%",
        } as React.CSSProperties
      }
    >
      {/* Edge fade masks */}
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

      <div ref={trackRef} className="twall-marquee__track flex w-max gap-4">
        {/* First copy — measured for duration. */}
        <div
          ref={halfRef}
          className="twall-marquee__half flex shrink-0 gap-4"
          aria-hidden={false}
        >
          {items.map((child, i) => (
            <div
              key={`a-${i}`}
              className="marquee__card w-[min(340px,85vw)] shrink-0"
            >
              {child}
            </div>
          ))}
        </div>
        {/* Second copy — duplicated so the loop is seamless. */}
        <div
          className="twall-marquee__half flex shrink-0 gap-4"
          aria-hidden="true"
        >
          {items.map((child, i) => (
            <div
              key={`b-${i}`}
              className="marquee__card w-[min(340px,85vw)] shrink-0"
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Manual carousel — embla with chevrons + dot indicators.                    */
/* ─────────────────────────────────────────────────────────────────────────── */

function ManualCarousel({
  children,
  isDark,
}: {
  children: React.ReactNode;
  isDark: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: true,
    skipSnaps: false,
    duration: SCROLL_DURATION_MS,
  });
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
    const sync = () => {
      setSnaps(emblaApi.scrollSnapList());
      setSelected(emblaApi.selectedScrollSnap());
    };
    const onSelect = () => {
      setSelected(emblaApi.selectedScrollSnap());
    };
    // Defer to a microtask so we're not setState-ing inside the effect body
    // synchronously (which trips react-hooks/set-state-in-effect, and would
    // otherwise force an immediate extra render before the browser paints).
    queueMicrotask(sync);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", sync);
    emblaApi.on("init", sync);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", sync);
      emblaApi.off("init", sync);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
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
  }, [emblaApi]);

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      className={cn(
        "embla-twall group/carousel relative outline-none px-12",
        "focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl"
      )}
    >
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
    </div>
  );
}
