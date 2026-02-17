"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageSquare, Shield, Zap, Globe, Code, ArrowRight, Star, Sparkles, LayoutGrid, LayoutList, Play } from "lucide-react";
import { TestimonialWall } from "@/components/testimonial-wall";
import type { WallItem } from "@/components/testimonial-wall";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const SAMPLE_TESTIMONIALS: WallItem[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    rating: 4.5,
    text: "Setup took 2 minutes and our landing page now converts 40% better. Absolutely love it!",
    photoUrl: `https://api.dicebear.com/7.x/avataaars/png?seed=Sarah&size=96`,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Alex Chen",
    rating: 5,
    text: "We've collected over 50 testimonials in the first month. The embed looks stunning on our site.",
    photoUrl: `https://api.dicebear.com/7.x/avataaars/png?seed=Alex&size=96`,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "David Park",
    rating: 5,
    text: "Switched from our old solution and never looked back. Our sales team uses the wall on every demo call.",
    photoUrl: `https://api.dicebear.com/7.x/avataaars/png?seed=David&size=96`,
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Megan Nelson",
    rating: 5,
    text: "Carousel layout on our homepage gets so many compliments. Looks like we paid thousands for custom dev.",
    photoUrl: `https://api.dicebear.com/7.x/avataaars/png?seed=Megan&size=96`,
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "Jason Hill",
    rating: 4.5,
    text: "The consent checkbox is a nice touch. Little details matter. Simple and effective.",
    photoUrl: `https://api.dicebear.com/7.x/avataaars/png?seed=Jason&size=96`,
    createdAt: new Date(),
  },
  {
    id: "6",
    name: "Emma Roberts",
    rating: 5,
    text: "Finally, a testimonial tool that doesn't require a developer. Our marketing team runs it independently.",
    photoUrl: `https://api.dicebear.com/7.x/avataaars/png?seed=Emma&size=96`,
    createdAt: new Date(),
  },
];

export default function Home() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;
  const [demoLayout, setDemoLayout] = useState<"grid" | "carousel" | "list">("carousel");
  const [demoTheme, setDemoTheme] = useState<"light" | "dark">("light");

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-28 md:py-40">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary"
          >
            <Sparkles className="h-4 w-4" />
            Embed-ready · SEO-optimized · No code
          </motion.div>

          <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-7xl lg:text-8xl">
            Collect testimonials
            <br />
            <span className="bg-linear-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
              without the friction
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            The easiest way to gather social proof and showcase it on your website.
            Set up in minutes, embed anywhere with one line of code.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            {!isLoggedIn && (
              <Link href="/signup">
                <Button size="lg" className="h-14 px-10 text-base shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl">
                  Start for free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link href="/w/demo-project" target="_blank">
              <Button size="lg" variant="outline" className="h-14 px-10 text-base">
                <Play className="mr-2 h-5 w-5" />
                View live demo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-14 flex items-center gap-4 text-sm text-muted-foreground"
          >
            <div className="flex -space-x-3">
              {["Alex", "Emma", "Jordan", "Sam", "Taylor"].map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-muted shadow-md"
                >
                  <Image
                    src={`https://api.dicebear.com/7.x/avataaars/png?seed=${name}&size=64`}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 object-cover"
                  />
                </motion.div>
              ))}
            </div>
            <span>Joined by 500+ makers and startups</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Live Demo Showcase */}
      <section className="w-full border-y border-border bg-muted/20 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">See it in action</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Real testimonial wall. Switch layouts and themes — this is what your visitors will see.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-6"
          >
            {/* Layout & theme toggles */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex rounded-lg border border-border bg-background p-1">
                {(["grid", "carousel", "list"] as const).map((layout) => (
                  <button
                    key={layout}
                    onClick={() => setDemoLayout(layout)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      demoLayout === layout
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {layout === "grid" && <LayoutGrid className="h-4 w-4" />}
                    {layout === "list" && <LayoutList className="h-4 w-4" />}
                    {layout === "carousel" && <Play className="h-4 w-4" />}
                    {layout.charAt(0).toUpperCase() + layout.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex rounded-lg border border-border bg-background p-1">
                {(["light", "dark"] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setDemoTheme(theme)}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors",
                      demoTheme === theme ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo wall */}
            <div className={cn("rounded-2xl", demoTheme === "dark" ? "bg-slate-900/50" : "bg-card/50")}>
              <TestimonialWall
                items={SAMPLE_TESTIMONIALS}
                layout={demoLayout}
                theme={demoTheme}
                brandColor="#059669"
                carouselAutoplay={demoLayout === "carousel"}
              />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              <Link href="/w/demo-project" target="_blank" className="font-medium text-primary hover:underline">
                Open full demo wall →
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Everything you need to boost conversions</h2>
            <p className="mt-4 text-lg text-muted-foreground">Built for founders, by founders.</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: MessageSquare, title: "Custom Collection Forms", desc: "Beautiful, branded forms. No login required for your customers.", color: "text-primary" },
              { icon: Shield, title: "Moderation Dashboard", desc: "Review, edit, and approve testimonials before they go live.", color: "text-primary" },
              { icon: Zap, title: "Instant Embedding", desc: "Copy-paste one line of code. Display a stunning Wall of Love.", color: "text-primary" },
              { icon: Globe, title: "SEO Optimized", desc: "Semantic HTML. Testimonials help your search rankings.", color: "text-primary" },
              { icon: Code, title: "Developer API", desc: "Fully customizable for advanced headless integrations.", color: "text-primary" },
              { icon: Star, title: "Ratings & Photos", desc: "Collect star ratings and customer photos for richer social proof.", color: "text-primary" },
            ].map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full border-t border-border bg-muted/10 px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Get social proof in 3 steps</h2>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-3">
            {[
              { step: "1", title: "Create a project", desc: "Sign up and create a space for your product in seconds." },
              { step: "2", title: "Share your link", desc: "Send your custom form link to happy customers." },
              { step: "3", title: "Embed the wall", desc: "Copy the embed code and add it to your landing page." },
            ].map((item, i) => (
              <Step key={item.step} {...item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-4 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-primary px-8 py-20 text-center text-primary-foreground shadow-2xl"
        >
          <h2 className="text-3xl font-bold md:text-5xl">Ready to build trust?</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/90">
            Join hundreds of creators using TestiWall to grow their business.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            {isLoggedIn ? (
              <Link href="/app/projects">
                <Button size="lg" className="h-14 bg-primary-foreground px-10 text-base text-primary shadow-lg hover:bg-primary-foreground/90">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg" className="h-14 bg-primary-foreground px-10 text-base text-primary shadow-lg hover:bg-primary-foreground/90">
                    Get started for free
                  </Button>
                </Link>
                <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 border-primary-foreground/50 bg-transparent px-10 text-base text-primary-foreground hover:bg-primary-foreground/10">
                Sign in
              </Button>
            </Link>
              </>
            )}
          </div>
          {!isLoggedIn && <p className="mt-6 text-sm text-primary-foreground/70">No credit card required. Cancel anytime.</p>}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
          <div className="text-lg font-bold text-foreground">TestiWall</div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">Twitter</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 TestiWall. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Icon className={cn("h-7 w-7", color)} />
      </div>
      <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function Step({
  step,
  title,
  desc,
  index,
}: {
  step: string;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-accent text-2xl font-bold text-primary-foreground shadow-lg">
        {step}
      </div>
      <h3 className="mb-3 text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}
