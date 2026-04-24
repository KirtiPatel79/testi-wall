"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { ArrowLeft, Check as CheckIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordCheck = { label: string; passed: boolean };

function usePasswordChecks(password: string): PasswordCheck[] {
  return useMemo(
    () => [
      { label: "At least 8 characters", passed: password.length >= 8 },
      { label: "Contains a letter", passed: /[A-Za-z]/.test(password) },
      { label: "Contains a number", passed: /[0-9]/.test(password) },
    ],
    [password]
  );
}

function strengthScore(checks: PasswordCheck[], password: string): number {
  let score = checks.filter((c) => c.passed).length;
  if (password.length >= 12) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

const STRENGTH_LABELS = ["Very weak", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = [
  "bg-destructive",
  "bg-destructive/80",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-emerald-600",
];

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const checks = usePasswordChecks(password);
  const score = strengthScore(checks, password);
  const allPassed = checks.every((c) => c.passed);

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <Card className="border-border shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Start collecting testimonials in minutes. No credit card required.</CardDescription>
          </CardHeader>
          <CardContent>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);

              const formData = new FormData(e.currentTarget);
              const email = String(formData.get("email") || "");
              const passwordValue = String(formData.get("password") || "");

              const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: passwordValue }),
              });

              if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                const message =
                  typeof body?.error === "string"
                    ? body.error
                    : "Failed to create account.";
                setError(message);
                setLoading(false);
                return;
              }

              const signin = await signIn("credentials", { email, password: passwordValue, redirect: false });
              setLoading(false);

              if (signin?.error) {
                setError("Account created, but login failed. Please try logging in.");
                return;
              }

              router.push("/app/projects");
              router.refresh();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                placeholder="At least 8 characters, 1 letter, 1 number"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password.length > 0 ? (
                <div aria-live="polite" className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-1.5 flex-1 gap-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            "flex-1 rounded-full bg-muted transition-colors",
                            i < score && STRENGTH_COLORS[score]
                          )}
                        />
                      ))}
                    </div>
                    <span className="w-20 text-right text-xs font-medium text-muted-foreground">
                      {STRENGTH_LABELS[score]}
                    </span>
                  </div>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {checks.map((check) => (
                      <li key={check.label} className="flex items-center gap-2">
                        {check.passed ? (
                          <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-muted-foreground/60" />
                        )}
                        <span className={check.passed ? "text-emerald-600 dark:text-emerald-400" : ""}>
                          {check.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            {error ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </div>
            ) : null}
            <Button className="w-full" type="submit" disabled={loading || !allPassed}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
      </motion.div>
    </main>
  );
}
