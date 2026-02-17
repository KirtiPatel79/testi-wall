"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { createProjectAction } from "@/app/app/projects/actions";

export function CreateProjectForm() {
  const [state, formAction] = useActionState(createProjectAction, { success: true, error: null });

  return (
    <Card className="border-none shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle>Create New Wall</CardTitle>
        <CardDescription>Launch a new collection space in seconds.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Wall name</Label>
            <Input id="name" name="name" required placeholder="My Awesome Product" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandColor">Brand Color</Label>
            <div className="flex items-center gap-3">
              <Input id="brandColor" name="brandColor" type="color" defaultValue="#b71c1c" className="h-10 w-14 cursor-pointer rounded-lg border-input p-1" />
              <span className="text-xs text-muted-foreground">Pick your accent color</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select id="theme" name="theme" defaultValue="light">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="layout">Layout</Label>
              <Select id="layout" name="layout" defaultValue="grid">
                <option value="grid">Grid</option>
                <option value="list">List</option>
              </Select>
            </div>
          </div>
          {state?.error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          ) : null}
          <Button type="submit" className="w-full shadow-lg">
            Create Project <PlusCircle className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
