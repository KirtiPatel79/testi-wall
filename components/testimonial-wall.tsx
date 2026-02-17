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
    "relative rounded-xl p-5 transition-all duration-200 hover:shadow-lg",
    carousel && "w-full",
    !carousel && !list && "break-inside-avoid mb-5",
    isDark
      ? "bg-slate-800/80 ring-1 ring-slate-700/80 hover:ring-slate-600"
      : "bg-slate-50/80 ring-1 ring-slate-200/80 hover:ring-slate-300"
  );

  const cards = items.map((item, index) => (
    <motion.article
      key={item.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      className={cardClass}
    >
      {/* Quote mark */}
      <span
        className={cn(
          "absolute left-4 top-4 font-serif text-4xl leading-none",
          isDark ? "text-slate-600/50" : "text-slate-300/70"
        )}
      >
        &ldquo;
      </span>
      <p
        className={cn(
          "mb-3 pl-8 pr-2 whitespace-pre-wrap text-[15px] leading-relaxed",
          isDark ? "text-slate-300" : "text-slate-600"
        )}
      >
        {(item.text || "").replace(/^["']|["']$/g, "").trim()}
      </p>
      {item.rating ? <Stars rating={item.rating} isDark={isDark} /> : null}
      <div
        className={cn(
          "mt-4 flex items-center gap-3 border-t pt-4",
          isDark ? "border-slate-700" : "border-slate-200"
        )}
      >
        {item.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.photoUrl}
            alt={item.name}
            loading="lazy"
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-md"
          />
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white shadow-md"
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
    <section
      className={cn(
        "rounded-2xl p-6 md:p-8",
        isDark
          ? "bg-slate-900 text-slate-100 shadow-xl ring-1 ring-slate-800"
          : "bg-white text-slate-900 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/60"
      )}
    >
      {items.length === 0 ? (
        <div
          className={cn(
            "rounded-xl border border-dashed p-12 text-center text-sm",
            isDark ? "border-slate-600 bg-slate-800/40 text-slate-400" : "border-slate-300 bg-slate-50 text-slate-500"
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
