"use client";

import type { Layout } from "@prisma/client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TestimonialCarousel } from "@/components/testimonial-carousel";

export type WallItem = {
  id: string;
  name: string;
  rating: number | null;
  text: string;
  photoUrl: string | null;
  createdAt: Date;
};

function Stars({ rating, isDark }: { rating: number; isDark: boolean }) {
  const normalized = Math.max(1, Math.min(5, rating));
  return (
    <div className="my-2 flex items-center gap-2">
      <div className="flex items-center gap-0.5" aria-label={`Rated ${normalized.toFixed(1)} out of 5`}>
        {Array.from({ length: 5 }).map((_, index) => {
          const fill = Math.max(0, Math.min(1, normalized - index)) * 100;
          return (
            <span key={index} className="relative inline-block h-4 w-4 text-[18px] leading-none">
              <span className={isDark ? "text-slate-500" : "text-slate-300"}>★</span>
              <span
                className={cn("absolute inset-0 overflow-hidden", isDark ? "text-amber-400" : "text-amber-500")}
                style={{ width: `${fill}%` }}
              >
                ★
              </span>
            </span>
          );
        })}
      </div>
      <span className={cn("text-xs font-semibold", isDark ? "text-amber-300" : "text-amber-600")}>
        {normalized.toFixed(1)}
      </span>
    </div>
  );
}

export function TestimonialWall({
  items,
  layout,
  theme,
  brandColor,
  carouselAutoplay = false,
}: {
  items: WallItem[];
  layout: Layout;
  theme: "light" | "dark";
  brandColor: string;
  carouselAutoplay?: boolean;
}) {
  const isDark = theme === "dark";
  const layoutNorm = String(layout || "grid").toLowerCase();
  const list = layoutNorm === "list";
  const carousel = layoutNorm === "carousel";

  const containerClass = list ? "space-y-4" : carousel ? "" : "columns-1 md:columns-2 lg:columns-3 column-gap-5";

  const cardClass = cn(
    "relative rounded-xl p-5 shadow-sm transition-all duration-200",
    carousel && "w-full",
    !carousel && !list && "break-inside-avoid mb-5",
    isDark
      ? "bg-slate-800/90 border border-slate-700/60 text-slate-100 ring-1 ring-slate-700/50"
      : "bg-white/95 border border-slate-200/80 text-slate-800 ring-1 ring-slate-200/50 shadow-slate-200/30"
  );

  const cards = items.map((item, index) => (
    <motion.article
      key={item.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.35) }}
      className={cardClass}
      style={carousel ? { borderLeftWidth: "4px", borderLeftColor: brandColor } : undefined}
    >
      <p
        className={cn(
          "mb-4 whitespace-pre-wrap text-[15px] leading-relaxed",
          isDark ? "text-slate-300" : "text-slate-600"
        )}
      >
        &ldquo;{(item.text || "").replace(/^["']|["']$/g, "").trim()}&rdquo;
      </p>
      {item.rating ? <Stars rating={item.rating} isDark={isDark} /> : null}
      <div
        className={cn(
          "mt-4 flex items-center gap-3 pt-4",
          isDark ? "border-t border-slate-700/50" : "border-t border-slate-200/70"
        )}
      >
        {item.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.photoUrl}
            alt={item.name}
            loading="lazy"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: brandColor }}
          >
            {item.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <p className={cn("text-sm font-semibold", isDark ? "text-slate-100" : "text-slate-800")}>
          {item.name}
        </p>
      </div>
    </motion.article>
  ));

  return (
    <section className="rounded-lg">
      {items.length === 0 ? (
        <div
          className={cn(
            "rounded-lg border border-dashed p-12 text-center text-sm",
            isDark ? "border-slate-600/60 text-slate-400" : "border-slate-300/80 text-slate-500"
          )}
        >
          No approved testimonials yet. Check back soon!
        </div>
      ) : carousel ? (
        <TestimonialCarousel isDark={isDark} autoplay={carouselAutoplay}>
          {cards}
        </TestimonialCarousel>
      ) : (
        <div className={containerClass}>{cards}</div>
      )}
    </section>
  );
}
