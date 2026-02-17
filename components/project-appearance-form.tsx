"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type AppearanceFormProject = {
  slug: string;
  name: string;
  brandColor: string;
  theme: "light" | "dark";
  layout: "grid" | "list" | "carousel";
  carouselAutoplay: boolean;
};

export function ProjectAppearanceForm({
  project,
  action,
}: {
  project: AppearanceFormProject;
  action: (formData: FormData) => Promise<void>;
}) {
  const [layout, setLayout] = useState<AppearanceFormProject["layout"]>(project.layout);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="slug" value={project.slug} />
      <div className="space-y-2">
        <Label htmlFor="name">Wall name</Label>
        <Input id="name" name="name" defaultValue={project.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="brandColor">Accent color</Label>
        <div className="flex items-center gap-2">
          <input
            id="brandColor"
            name="brandColor"
            type="color"
            defaultValue={project.brandColor}
            className="h-10 w-14 cursor-pointer rounded-md border border-input bg-background p-1"
          />
          <Input id="brandColorHex" name="brandColorHex" defaultValue={project.brandColor} placeholder="#0ea5e9" />
        </div>
        <p className="text-xs text-muted-foreground">Used for profile circles and accent highlights in your wall.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select id="theme" name="theme" defaultValue={project.theme}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="layout">Layout</Label>
          <Select
            id="layout"
            name="layout"
            defaultValue={project.layout}
            onChange={(event) => setLayout(event.currentTarget.value as AppearanceFormProject["layout"])}
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
            <option value="carousel">Carousel</option>
          </Select>
        </div>
      </div>

      <input type="hidden" name="carouselAutoplay" value="false" />
      {layout === "carousel" ? (
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50">
          <input
            type="checkbox"
            name="carouselAutoplay"
            value="true"
            defaultChecked={project.carouselAutoplay}
            className="mt-1"
          />
          <span className="text-sm text-foreground">Auto-scroll carousel testimonials</span>
        </label>
      ) : null}

      <Button className="w-full" type="submit">
        Save changes
      </Button>
    </form>
  );
}
