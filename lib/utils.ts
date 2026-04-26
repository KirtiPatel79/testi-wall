import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import sanitizeHtml from "sanitize-html";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function sanitizePlainText(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

/**
 * Serialize a value to a JSON string that's safe to embed inside a
 * <script type="application/ld+json"> tag via dangerouslySetInnerHTML.
 *
 * JSON.stringify does not escape `</script>` or `<!--`, so any user-controlled
 * field (e.g. a project name) could break out of the script tag and inject
 * arbitrary HTML. Escaping `<` to `\u003c` keeps the JSON valid and prevents
 * the XSS without changing the parsed value.
 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function formatDate(input: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(input);
}

export function toInt(value: string | null, fallback = 0): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return parsed;
}
