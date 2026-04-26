"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Star, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_CHARS = 5000;
const MIN_CHARS = 10;
const MAX_NAME = 120;
const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={disabled || pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        "Submit testimonial"
      )}
    </Button>
  );
}

export function PublicTestimonialForm({
  action,
  publicId,
  projectName,
}: {
  action: string;
  publicId: string;
  projectName: string;
}) {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textLen = text.trim().length;
  const tooShort = textLen > 0 && textLen < MIN_CHARS;
  const valid = name.trim().length > 0 && textLen >= MIN_CHARS && textLen <= MAX_CHARS && consent && !photoError;
  const effectiveRating = hoverRating ?? rating;

  function handlePhoto(files: FileList | null) {
    setPhotoError(null);
    const file = files?.[0];
    if (!file) {
      setPhotoPreview(null);
      return;
    }
    if (!ACCEPTED_MIME.includes(file.type)) {
      setPhotoError("Unsupported file type. Use JPG, PNG, WEBP, or GIF.");
      setPhotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setPhotoError(`Image exceeds ${MAX_FILE_SIZE_MB}MB size limit.`);
      setPhotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  function clearPhoto() {
    setPhotoPreview(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form action={action} method="post" encType="multipart/form-data" className="space-y-5">
      <input type="hidden" name="redirectTo" value={`/f/${publicId}`} />

      <div className="space-y-2">
        <Label htmlFor="customer_name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="customer_name"
          name="customer_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={MAX_NAME}
          placeholder="Your full name"
          autoComplete="name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Rating (optional)</Label>
        <input
          type="hidden"
          name="rating"
          value={rating !== null ? String(rating) : ""}
        />
        <div
          className="flex items-center gap-1"
          onMouseLeave={() => setHoverRating(null)}
          role="radiogroup"
          aria-label="Star rating"
        >
          {[1, 2, 3, 4, 5].map((value) => {
            const isFilled = effectiveRating !== null && value <= effectiveRating;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                onMouseEnter={() => setHoverRating(value)}
                onFocus={() => setHoverRating(value)}
                onBlur={() => setHoverRating(null)}
                onClick={() => setRating((prev) => (prev === value ? null : value))}
                className="rounded-md p-1 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:scale-110"
              >
                <Star
                  className={cn(
                    "h-7 w-7 transition-colors",
                    isFilled
                      ? "fill-amber-400 text-amber-400"
                      : "fill-transparent text-muted-foreground/50"
                  )}
                />
              </button>
            );
          })}
          {rating !== null ? (
            <button
              type="button"
              onClick={() => setRating(null)}
              className="ml-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="testimonial_text">
            Your testimonial <span className="text-destructive">*</span>
          </Label>
          <span
            className={cn(
              "text-xs tabular-nums",
              tooShort
                ? "text-destructive"
                : textLen > MAX_CHARS * 0.9
                  ? "text-amber-600"
                  : "text-muted-foreground"
            )}
          >
            {textLen}/{MAX_CHARS} {tooShort ? `(min ${MIN_CHARS})` : ""}
          </span>
        </div>
        <Textarea
          id="testimonial_text"
          name="testimonial_text"
          placeholder="Share what you loved, how it helped you, and any results you saw..."
          className="min-h-36"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          minLength={MIN_CHARS}
          maxLength={MAX_CHARS}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Photo (optional)</Label>
        <input
          ref={fileInputRef}
          id="photo"
          name="photo"
          type="file"
          accept={ACCEPTED_MIME.join(",")}
          className="sr-only"
          onChange={(e) => handlePhoto(e.target.files)}
        />
        {photoPreview ? (
          <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/40 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoPreview}
              alt="Selected preview"
              className="h-16 w-16 rounded-full object-cover"
            />
            <div className="flex-1 text-xs text-muted-foreground">
              Looks great. This image will appear with your testimonial.
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearPhoto}
              className="shrink-0"
            >
              <X className="mr-1 h-3.5 w-3.5" /> Remove
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-6 text-center transition-colors hover:border-primary/60 hover:bg-muted/60"
          >
            <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            <div className="text-sm font-medium text-foreground">Click to upload a photo</div>
            <div className="text-xs text-muted-foreground">
              JPG, PNG, WEBP or GIF · up to {MAX_FILE_SIZE_MB}MB
            </div>
          </button>
        )}
        {photoError ? (
          <p role="alert" className="text-xs text-destructive">
            {photoError}
          </p>
        ) : null}
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span className="text-sm text-foreground">
          I consent to having this testimonial displayed publicly on {projectName}&apos;s website.
        </span>
      </label>

      <SubmitButton disabled={!valid} />
    </form>
  );
}

