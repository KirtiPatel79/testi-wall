"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Code,
  Globe,
  LayoutGrid,
  LayoutList,
  MessageSquare,
  MonitorPlay,
  Play,
  Quote,
  Share2,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wand2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestimonialWall, type WallItem } from "@/components/testimonial-wall";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Sample data                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

const SAMPLE_TESTIMONIALS: WallItem[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    rating: 5,
    text: "Setup took 2 minutes and our landing page now converts 40% better. Absolutely love it!",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=Sarah&size=96",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Alex Chen",
    rating: 5,
    text: "We've collected over 50 testimonials in the first month. The embed looks stunning on our site.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=Alex&size=96",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "David Park",
    rating: 5,
    text: "Switched from our old solution and never looked back. Our sales team uses the wall on every demo call.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=David&size=96",
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Megan Nelson",
    rating: 5,
    text: "Carousel layout on our homepage gets so many compliments. Looks like we paid thousands for custom dev.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=Megan&size=96",
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "Jason Hill",
    rating: 4.5,
    text: "The consent checkbox is a nice touch. Little details matter. Simple and effective.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=Jason&size=96",
    createdAt: new Date(),
  },
  {
    id: "6",
    name: "Emma Roberts",
    rating: 5,
    text: "Finally, a testimonial tool that doesn't require a developer. Our marketing team runs it independently.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=Emma&size=96",
    createdAt: new Date(),
  },
];

const STATS: ReadonlyArray<{
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}> = [
  { icon: Users, value: 500, suffix: "+", label: "Teams using TestiWall" },
  { icon: TrendingUp, value: 10000, suffix: "+", label: "Testimonials collected" },
  { icon: Star, value: 4.9, suffix: "/5", label: "Average rating", decimals: 1 },
];

const TRUSTED_BY = [
  "Acme Studio",
  "Linear Notes",
  "Vertex Labs",
  "Helio",
  "Northwind",
  "Pulse",
  "Lumen",
];

const FEATURES = [
  {
    icon: Wand2,
    title: "Branded forms",
    desc: "Your colors, your logo, your tone. Customers feel like they're still on your site.",
  },
  {
    icon: Shield,
    title: "Built-in moderation",
    desc: "Approve, reject, and edit testimonials before they go live. Spam never makes it through.",
  },
  {
    icon: LayoutGrid,
    title: "Three layouts",
    desc: "Grid, list, and auto-scrolling carousel. Switch any time without re-embedding.",
  },
  {
    icon: Code,
    title: "One-line embed",
    desc: "A single iframe snippet. Drop it anywhere — Webflow, Framer, WordPress, plain HTML.",
  },
  {
    icon: Zap,
    title: "Lightning quick",
    desc: "Edge-cached widgets, lazy-loaded media, zero impact on Core Web Vitals.",
  },
  {
    icon: Globe,
    title: "Built for the web",
    desc: "Accessible, SEO-friendly, fully responsive, dark-mode aware out of the box.",
  },
] as const;

const PRICING = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    desc: "Everything you need to validate the idea on a side project.",
    features: [
      "1 project",
      "25 approved testimonials",
      "Grid + list layouts",
      "TestiWall branding",
    ],
    cta: "Start free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/ month",
    desc: "For growing teams who want their own brand on every wall.",
    features: [
      "Unlimited projects",
      "Unlimited testimonials",
      "All layouts including carousel",
      "Photo testimonials",
      "Custom brand color & theme",
      "Remove TestiWall branding",
    ],
    cta: "Start 14-day trial",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Team",
    price: "$49",
    cadence: "/ month",
    desc: "Multi-seat teams running social proof at scale.",
    features: [
      "Everything in Pro",
      "5 team members",
      "Per-project roles",
      "Priority support",
      "SLA & onboarding call",
    ],
    cta: "Talk to sales",
    href: "/signup",
    highlight: false,
  },
] as const;

const FAQ = [
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
] as const;

/* ────────────────────────────────────────────────────────────────────────── */
/*  Page                                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

export default function Home() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;
  const [demoLayout, setDemoLayout] = useState<"grid" | "carousel" | "list">(
    "grid"
  );
  const [demoTheme, setDemoTheme] = useState<"light" | "dark">("dark");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-hidden">
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="hero-grid-bg relative flex w-full flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-20 md:pt-36 md:pb-28">
        {/* refined ambient gradients */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-44 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[140px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/3 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 -right-32 h-96 w-96 rounded-full bg-secondary/15 blur-[120px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex max-w-4xl flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <AnimatedShinyText
              className="text-sm font-medium text-primary"
              shimmerWidth={140}
            >
              Embed-ready · SEO-optimized · No code
            </AnimatedShinyText>
          </motion.div>

          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-balance text-foreground md:text-7xl lg:text-[5.5rem]">
            Social proof
            <br />
            that{" "}
            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              actually converts
            </span>
            .
          </h1>

          <p className="mt-7 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Collect testimonials with a branded form, moderate them in one
            click, and embed a stunning wall anywhere on the web. Set up in
            minutes.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            {isLoggedIn ? (
              <Link href="/app/projects">
                <Button
                  size="lg"
                  className="h-13 px-8 text-base shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                  Go to dashboard
                  <ArrowRight className="ml-2 h-4.5 w-4.5" />
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button
                  size="lg"
                  className="h-13 px-8 text-base shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                  Start free — no card
                  <ArrowRight className="ml-2 h-4.5 w-4.5" />
                </Button>
              </Link>
            )}
            <Link href="/w/demo-project" target="_blank">
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-8 text-base"
              >
                <Play className="mr-2 h-4 w-4" />
                See live demo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-10 flex items-center gap-3 text-sm text-muted-foreground"
          >
            <div className="flex -space-x-2.5">
              {["Alex", "Emma", "Jordan", "Sam", "Taylor"].map((name) => (
                <div
                  key={name}
                  className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-muted shadow"
                >
                  <Image
                    src={`https://api.dicebear.com/7.x/avataaars/png?seed=${name}&size=64`}
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-balance">
              Joined by{" "}
              <NumberTicker
                value={500}
                className="font-semibold text-foreground"
              />
              + makers and startups
            </span>
          </motion.div>
        </motion.div>

        {/* hero device-frame mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: "easeOut" }}
          className="relative z-10 mt-16 w-full max-w-5xl px-4"
          style={{ perspective: "1200px" }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-2xl backdrop-blur">
            {/* browser chrome */}
            <div className="flex items-center gap-2 border-b border-border/70 bg-muted/40 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <div className="ml-3 flex flex-1 items-center gap-2 rounded-md border border-border/60 bg-background/80 px-3 py-1 text-xs text-muted-foreground">
                <Globe className="h-3 w-3" />
                <span className="font-mono">
                  yourbrand.com / wall-of-love
                </span>
              </div>
            </div>
            {/* content preview */}
            <div className="bg-background/50 p-6 md:p-10">
              <p className="mb-2 text-sm font-medium text-primary">
                ★ Wall of Love
              </p>
              <h3 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">
                What people say about Your Brand
              </h3>
              <TestimonialWall
                items={SAMPLE_TESTIMONIALS.slice(0, 6)}
                layout="grid"
                theme="light"
                brandColor="#10b981"
              />
            </div>
            <BorderBeam
              colorFrom="#10b981"
              colorTo="#f59e0b"
              duration={9}
              borderWidth={1.5}
              size={260}
            />
          </div>
          {/* glow underneath */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-12 -bottom-8 h-24 rounded-[50%] bg-primary/30 blur-3xl"
          />
        </motion.div>
      </section>

      {/* ─── Trusted-by row ────────────────────────────────────────── */}
      <section className="w-full border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by ambitious teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-base font-semibold text-muted-foreground/80 md:text-lg">
            {TRUSTED_BY.map((name) => (
              <span
                key={name}
                className="opacity-70 transition-opacity hover:text-foreground hover:opacity-100"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats bar ─────────────────────────────────────────────── */}
      <section className="w-full bg-background">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <div className="grid grid-cols-3 gap-4 divide-x divide-border/50">
            {STATS.map(({ icon: Icon, value, suffix, label, decimals }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="px-4 text-center sm:px-8"
              >
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  <NumberTicker
                    value={value}
                    delay={i * 0.15}
                    decimalPlaces={decimals ?? 0}
                  />
                  <span>{suffix}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Live demo ──────────────────────────────────────────────── */}
      <section className="w-full border-y border-border/60 bg-muted/15 py-24 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Live demo"
            title="See it in action"
            description="Real testimonial wall — switch layouts and themes. This is exactly what your visitors will see."
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mt-12 space-y-6"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center rounded-xl border border-border bg-background p-1 shadow-sm">
                {(
                  [
                    { key: "grid" as const, label: "Grid", icon: LayoutGrid },
                    { key: "list" as const, label: "List", icon: LayoutList },
                    { key: "carousel" as const, label: "Carousel", icon: Play },
                  ]
                ).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setDemoLayout(key)}
                    className="relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium"
                  >
                    {demoLayout === key && (
                      <motion.div
                        layoutId="demo-layout-pill"
                        className="absolute inset-0 rounded-lg bg-primary shadow"
                        transition={{
                          type: "spring",
                          duration: 0.4,
                          bounce: 0.18,
                        }}
                      />
                    )}
                    <Icon
                      className={cn(
                        "relative z-10 h-4 w-4",
                        demoLayout === key
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "relative z-10",
                        demoLayout === key
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center rounded-xl border border-border bg-background p-1 shadow-sm">
                {(["light", "dark"] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setDemoTheme(theme)}
                    className="relative rounded-lg px-3.5 py-2 text-sm font-medium capitalize"
                  >
                    {demoTheme === theme && (
                      <motion.div
                        layoutId="demo-theme-pill"
                        className="absolute inset-0 rounded-lg bg-primary shadow"
                        transition={{
                          type: "spring",
                          duration: 0.4,
                          bounce: 0.18,
                        }}
                      />
                    )}
                    <span
                      className={cn(
                        "relative z-10",
                        demoTheme === theme
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {theme}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl md:p-10">
              <BorderBeam
                colorFrom="#10b981"
                colorTo="#f59e0b"
                duration={8}
                borderWidth={1.5}
                size={240}
              />
              <div
                className={cn(
                  "rounded-xl",
                  demoTheme === "dark" ? "bg-slate-950 p-6 md:p-8" : ""
                )}
              >
                <TestimonialWall
                  items={SAMPLE_TESTIMONIALS}
                  layout={demoLayout}
                  theme={demoTheme}
                  brandColor="#10b981"
                  carouselAutoplay={demoLayout === "carousel"}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Features (bento) ─────────────────────────────────────── */}
      <section className="w-full px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Why TestiWall"
            title="Everything you need, nothing you don't"
            description="A focused toolkit for collecting, moderating, and showcasing customer love. No bloat. No learning curve."
          />

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────── */}
      <section className="w-full border-y border-border/60 bg-muted/15 px-4 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="How it works"
            title="Get social proof in 3 steps"
          />

          <div className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-6">
            <div className="pointer-events-none absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] hidden h-px md:block">
              <svg width="100%" height="2" className="overflow-visible">
                <line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="url(#step-grad)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />
                <defs>
                  <linearGradient
                    id="step-grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {[
              {
                step: "1",
                icon: Share2,
                title: "Create a project",
                desc: "Sign up and create a space for your product in seconds.",
              },
              {
                step: "2",
                icon: MessageSquare,
                title: "Share your link",
                desc: "Send your branded form link to happy customers.",
              },
              {
                step: "3",
                icon: MonitorPlay,
                title: "Embed the wall",
                desc: "Copy the embed code and add it to your landing page.",
              },
            ].map((item, i) => (
              <Step key={item.step} {...item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Wall of love ─────────────────────────────────────────── */}
      <section className="w-full px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Wall of love"
            title="People shipping with TestiWall"
            description="Real reviews from real users. The same kind of wall you'll be embedding on your own site."
          />
          <div className="mt-14">
            <TestimonialWall
              items={SAMPLE_TESTIMONIALS}
              layout="grid"
              theme="dark"
              brandColor="#10b981"
            />
          </div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="w-full border-y border-border/60 bg-muted/15 px-4 py-24 md:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple, transparent pricing"
            description="Start free, upgrade when you outgrow it. Cancel any time — no questions asked."
          />

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {PRICING.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-lg",
                  tier.highlight
                    ? "border-primary/60 ring-1 ring-primary/30"
                    : "border-border"
                )}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground shadow">
                    <Sparkles className="h-3 w-3" />
                    Most popular
                  </span>
                )}

                <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {tier.name}
                </div>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {tier.cadence}
                  </span>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {tier.desc}
                </p>

                <ul className="mb-8 flex-1 space-y-2.5 text-sm text-foreground/90">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full",
                          tier.highlight
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href={tier.href} className="mt-auto">
                  <Button
                    size="lg"
                    variant={tier.highlight ? "default" : "outline"}
                    className="w-full"
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <section className="w-full px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
          />
          <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card">
            {FAQ.map((item, i) => {
              const open = openFaq === i;
              return (
                <button
                  key={item.q}
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="block w-full text-left"
                  aria-expanded={open}
                >
                  <div className="flex items-center justify-between gap-4 px-6 py-5">
                    <span className="text-base font-semibold text-foreground md:text-lg">
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform",
                        open && "rotate-45 bg-primary text-primary-foreground"
                      )}
                    >
                      <span className="text-base leading-none">+</span>
                    </span>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{
                      height: open ? "auto" : 0,
                      opacity: open ? 1 : 0,
                    }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {item.a}
                    </p>
                  </motion.div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────────────────── */}
      <section className="w-full px-4 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl px-8 py-20 text-center text-primary-foreground shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 130%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          <BorderBeam
            colorFrom="#ffffff"
            colorTo="#fef3c7"
            duration={6}
            borderWidth={2}
            size={400}
          />

          <h2 className="relative text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
            Ready to build trust?
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-pretty text-lg text-primary-foreground/90">
            Join hundreds of creators using TestiWall to grow their business.
          </p>
          <div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            {isLoggedIn ? (
              <Link href="/app/projects">
                <Button
                  size="lg"
                  className="h-13 bg-primary-foreground px-10 text-base text-primary shadow-lg hover:bg-primary-foreground/90"
                >
                  Go to dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="h-13 bg-primary-foreground px-10 text-base text-primary shadow-lg hover:bg-primary-foreground/90"
                  >
                    Start for free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 border-primary-foreground/50 bg-transparent px-10 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </div>
          {!isLoggedIn && (
            <p className="relative mt-6 text-sm text-primary-foreground/75">
              No credit card required. Cancel anytime.
            </p>
          )}
        </motion.div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer className="w-full border-t border-border/70 bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-4 py-14 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Quote className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-foreground">
                TestiWall
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              The simplest way to collect, moderate, and embed customer
              testimonials. Built for makers, startups, and marketing teams.
            </p>
          </div>

          <FooterCol
            title="Product"
            items={[
              { label: "Live demo", href: "/w/demo-project" },
              { label: "Pricing", href: "#pricing" },
              { label: "Login", href: "/login" },
              { label: "Sign up", href: "/signup" },
            ]}
          />
          <FooterCol
            title="Company"
            items={[
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "Contact", href: "#" },
            ]}
          />
        </div>
        <div className="border-t border-border/60">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground md:flex-row">
            <p>© 2026 TestiWall. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              All systems operational
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Subcomponents                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mx-auto max-w-2xl text-center"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        {eyebrow}
      </p>
      <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <BorderBeam
          colorFrom="#10b981"
          colorTo="#f59e0b"
          duration={4}
          borderWidth={1.2}
          size={160}
        />
      </div>
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

function Step({
  step,
  icon: Icon,
  title,
  desc,
  index,
}: {
  step: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center text-center"
    >
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-accent shadow-lg shadow-primary/25">
          <Icon className="h-8 w-8 text-primary-foreground" />
        </div>
        <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white shadow">
          {step}
        </span>
      </div>
      <h3 className="mb-3 text-xl font-bold text-foreground">{title}</h3>
      <p className="leading-relaxed text-muted-foreground">{desc}</p>
    </motion.div>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
        {title}
      </p>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((it) => (
          <li key={it.label}>
            <Link
              href={it.href}
              className="transition-colors hover:text-primary"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
