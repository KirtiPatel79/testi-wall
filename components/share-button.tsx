"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";

type ShareButtonProps = {
  url: string;
  title?: string;
  label?: string;
};

export function ShareButton({ url, title = "Share", label = "Share" }: ShareButtonProps) {
  const [shared, setShared] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        setShared(true);
        setTimeout(() => setShared(false), 1500);
        return;
      } catch {
        // User cancelled or share failed, fall back to copy
      }
    }

    await navigator.clipboard.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 1500);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
      {shared ? <Check className="h-3.5 w-3.5 text-secondary" /> : <Share2 className="h-3.5 w-3.5" />}
      {shared ? "Shared!" : label}
    </Button>
  );
}
