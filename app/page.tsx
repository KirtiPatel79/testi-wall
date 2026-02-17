"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageSquare, Shield, Zap, Globe, Code, ArrowRight, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex w-full flex-col items-center justify-center bg-muted/30 px-4 py-24 text-center md:py-32">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] bg-size-[20px_20px]"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10 flex flex-col items-center"
        >
          <div className="mb-6 flex items-center gap-2 rounded-full border border-secondary/50 bg-secondary/20 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary"></span>
            </span>
            Embed-ready & SEO-optimized
          </div>
          
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-foreground md:text-7xl">
            Collect testimonials <br />
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              without the friction.
            </span>
          </h1>
          
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            The easiest way to gather social proof and showcase it on your website. 
            Set up in minutes, embed anywhere with one line of code.
          </p>
          
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg">
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/w/demo-project" target="_blank">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                View Demo
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {["Alex", "Emma", "Jordan", "Sam"].map((name) => (
                <Image
                  key={name}
                  src={`https://api.dicebear.com/7.x/avataaars/png?seed=${name}&size=64`}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border-2 border-background object-cover ring-2 ring-background"
                />
              ))}
            </div>
            <span>Joined by 500+ makers and startups</span>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-6xl px-4 py-24">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Everything you need to boost conversions</h2>
          <p className="mt-4 text-muted-foreground">Built for founders, by founders.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard 
            icon={<MessageSquare className="h-6 w-6 text-primary" />}
            title="Custom Collection Forms"
            description="Create beautiful, branded forms. No login required for your customers."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-primary" />}
            title="Moderation Dashboard"
            description="Review, edit, and approve testimonials before they go live on your site."
          />
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Instant Embedding"
            description="Copy-paste a single line of code to display a stunning 'Wall of Love'."
          />
          <FeatureCard 
            icon={<Globe className="h-6 w-6 text-primary" />}
            title="SEO Optimized"
            description="Testimonials are injected as semantic HTML, helping your search rankings."
          />
          <FeatureCard 
            icon={<Code className="h-6 w-6 text-primary" />}
            title="Developer API"
            description="Fully customizable via API for advanced headless integrations."
          />
          <FeatureCard 
            icon={<Star className="h-6 w-6 text-primary" />}
            title="Star Ratings & Photos"
            description="Collect ratings and customer photos for richer, more credible social proof."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="w-full bg-card px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Get social proof in 3 simple steps</h2>
          </div>
          
          <div className="grid gap-12 md:grid-cols-3">
            <Step 
              number="1" 
              title="Create a project" 
              description="Sign up and create a space for your product or service in seconds."
            />
            <Step 
              number="2" 
              title="Share your link" 
              description="Send your custom collection link to your happy customers."
            />
            <Step 
              number="3" 
              title="Embed the wall" 
              description="Select the best testimonials and embed them on your landing page."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 py-24">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground shadow-2xl">
          <h2 className="text-3xl font-bold md:text-5xl">Ready to build trust?</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/90">
            Join hundreds of creators who are already using TestiWall to grow their business.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="h-12 bg-primary-foreground px-8 text-base text-primary hover:bg-primary-foreground/90">
                Get started for free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 border-primary-foreground/50 bg-transparent px-8 text-base text-primary-foreground hover:bg-primary-foreground/10">
                Sign in
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-primary-foreground/70">No credit card required. Cancel anytime.</p>
        </div>
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-accent/20">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-accent text-2xl font-bold text-primary-foreground shadow-lg">
        {number}
      </div>
      <h3 className="mb-3 text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

