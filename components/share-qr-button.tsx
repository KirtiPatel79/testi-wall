"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";

type ShareQrButtonProps = {
  imageUrl: string;
  title: string;
  description?: string;
  label?: string;
  className?: string;
};

export function ShareQrButton({
  imageUrl,
  title,
  description = "Scan this QR code to leave your testimonial",
  label = "Share QR",
  className,
}: ShareQrButtonProps) {
  const [shared, setShared] = useState(false);

  async function handleShare() {
    const shareText = `${description}\n\n`;
    try {
      if (navigator.share) {
        const res = await fetch(imageUrl, { mode: "cors" });
        if (res.ok) {
          const blob = await res.blob();
          const file = new File([blob], "qr-code.png", { type: "image/png" });
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              title,
              text: description,
              files: [file],
            });
            setShared(true);
            setTimeout(() => setShared(false), 2000);
            return;
          }
        }
      }
    } catch {
      /* fall through to clipboard */
    }
    await navigator.clipboard.writeText(shareText);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleShare} className={cn("gap-1.5", className)}>
      {shared ? <Check className="h-3.5 w-3.5 text-primary" /> : <Share2 className="h-3.5 w-3.5" />}
      {shared ? "Shared!" : label}
    </Button>
  );
}
