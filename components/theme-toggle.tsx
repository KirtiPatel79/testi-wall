"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const EMPTY_SUBSCRIBE = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Avoid hydration mismatch by only rendering theme-specific UI on the client.
  const mounted = useSyncExternalStore(
    EMPTY_SUBSCRIBE,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-9 w-9 p-0" aria-label="Toggle theme">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 w-9 p-0"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
