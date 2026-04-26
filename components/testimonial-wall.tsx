"use client";

import type { Layout } from "@prisma/client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
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
    <div className="flex items-center gap-2">
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

function cleanText(text: string): string {
  return (text || "").replace(/^["']|["']$/g, "").trim();
}

function Avatar({ item, brandColor, size }: { item: WallItem; brandColor: string; size: number }) {
  if (item.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.photoUrl}
        alt={item.name}
        loading="lazy"
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: brandColor, fontSize: size * 0.4 }}
    >
      {item.name.slice(0, 1).toUpperCase()}
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

  const baseCard = cn(
    "relative rounded-xl p-5 shadow-sm transition-all duration-200",
    isDark
      ? "bg-slate-800/90 border border-slate-700/60 text-slate-100 ring-1 ring-slate-700/50"
      : "bg-white/95 border border-slate-200/80 text-slate-800 ring-1 ring-slate-200/50 shadow-slate-200/30"
  );

  const gridCards = items.map((item, index) => (
    <motion.article
      key={item.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.35) }}
      className={cn(baseCard, "break-inside-avoid mb-5")}
    >
      <p className={cn("mb-4 whitespace-pre-wrap text-[15px] leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
        &ldquo;{cleanText(item.text)}&rdquo;
      </p>
      {item.rating ? <div className="my-2"><Stars rating={item.rating} isDark={isDark} /></div> : null}
      <div className={cn("mt-4 flex items-center gap-3 pt-4", isDark ? "border-t border-slate-700/50" : "border-t border-slate-200/70")}>
        <Avatar item={item} brandColor={brandColor} size={40} />
        <p className={cn("text-sm font-semibold", isDark ? "text-slate-100" : "text-slate-800")}>{item.name}</p>
      </div>
    </motion.article>
  ));

  const listCards = items.map((item, index) => (
    <motion.article
      key={item.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      className={cn(
        baseCard,
        "flex flex-col gap-5 p-6 md:flex-row md:items-center md:gap-8 md:p-8"
      )}
      style={{ borderLeftWidth: "3px", borderLeftColor: brandColor }}
    >
      <div className="flex shrink-0 flex-col items-start gap-3 md:w-56">
        <div className="flex items-center gap-3">
          <Avatar item={item} brandColor={brandColor} size={48} />
          <div className="min-w-0">
            <p className={cn("truncate text-sm font-semibold", isDark ? "text-slate-100" : "text-slate-800")}>
              {item.name}
            </p>
            {item.rating ? (
              <div className="mt-1">
                <Stars rating={item.rating} isDark={isDark} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="relative flex-1">
        <Quote
          aria-hidden="true"
          className={cn("absolute -left-1 -top-2 h-7 w-7 opacity-20", isDark ? "text-slate-300" : "text-slate-500")}
        />
        <p
          className={cn(
            "relative whitespace-pre-wrap pl-7 text-base leading-relaxed md:text-lg",
            isDark ? "text-slate-200" : "text-slate-700"
          )}
        >
          {cleanText(item.text)}
        </p>
      </div>
    </motion.article>
  ));

  const carouselCards = items.map((item, index) => (
    <motion.article
      key={item.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.35) }}
      className={cn(baseCard, "flex h-full w-full flex-col")}
      style={{ borderLeftWidth: "4px", borderLeftColor: brandColor }}
    >
      <Quote
        aria-hidden="true"
        className={cn("mb-3 h-6 w-6 opacity-30", isDark ? "text-slate-300" : "text-slate-500")}
      />
      <p className={cn("flex-1 whitespace-pre-wrap text-[15px] leading-relaxed", isDark ? "text-slate-200" : "text-slate-700")}>
        {cleanText(item.text)}
      </p>
      {item.rating ? <div className="mt-4"><Stars rating={item.rating} isDark={isDark} /></div> : null}
      <div className={cn("mt-4 flex items-center gap-3 pt-4", isDark ? "border-t border-slate-700/50" : "border-t border-slate-200/70")}>
        <Avatar item={item} brandColor={brandColor} size={40} />
        <p className={cn("text-sm font-semibold", isDark ? "text-slate-100" : "text-slate-800")}>{item.name}</p>
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
          {carouselCards}
        </TestimonialCarousel>
      ) : list ? (
        <div className="space-y-5">{listCards}</div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 column-gap-5">{gridCards}</div>
      )}
    </section>
  );
}
