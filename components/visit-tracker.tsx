"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const TRACK_DEBOUNCE_MS = 2000;

export function VisitTracker() {
  const pathname = usePathname();
  const trackedRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const key = pathname;
    if (trackedRef.current.has(key)) return;

    if (timeoutRef.current != null) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      fetch("/api/track/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pathname }),
      }).then((res) => {
        if (res.ok) trackedRef.current.add(key);
      });
    }, TRACK_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current != null) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  return null;
}
