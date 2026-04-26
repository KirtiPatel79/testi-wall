/**
 * Shared marketing content used both by the rendered landing page and the
 * structured-data (JSON-LD) emitted in the document head. Keeping a single
 * source of truth lets crawlers see exactly what humans see.
 */

export const FAQ_ITEMS = [
  {
    q: "Do my customers need an account to leave a testimonial?",
    a: "No. You share a public form link and they submit their testimonial in under a minute. No login, no friction.",
  },
  {
    q: "How do I embed the wall on my site?",
    a: "Copy the one-line iframe snippet from your project dashboard and paste it anywhere — Webflow, Framer, WordPress, Notion, plain HTML, you name it.",
  },
  {
    q: "Can I moderate testimonials before they appear?",
    a: "Yes. Every submission lands in a moderation queue. You approve, edit, or reject before anything goes live on your wall.",
  },
  {
    q: "Is it GDPR-friendly?",
    a: "Yes. We collect only what your customer chooses to share, surface a clear consent checkbox on the form, and never sell or share data with third parties.",
  },
  {
    q: "Will it slow down my site?",
    a: "No. The widget is lazy-loaded, edge-cached, and uses an iframe so your main thread is never blocked.",
  },
  {
    q: "How much does TestiWall cost?",
    a: "TestiWall is free while it's in beta. Every feature is unlocked — unlimited projects, unlimited testimonials, every layout, every theme. No credit card required.",
  },
] as const;

export const FEATURE_LIST = [
  "Branded testimonial collection forms",
  "Built-in moderation queue",
  "Grid, list, and auto-scrolling carousel layouts",
  "One-line iframe embed for any website",
  "Photo testimonials with magic-byte validation",
  "Custom brand color and dark / light theme",
  "Edge-cached, lazy-loaded widgets",
  "Accessible and SEO-friendly markup",
] as const;
