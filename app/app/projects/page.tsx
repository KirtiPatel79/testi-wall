import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateProjectForm } from "@/components/create-project-form";
import { LayoutDashboard, Globe, MessageSquare, ArrowRight } from "lucide-react";

export default async function ProjectsPage() {
  const userId = await requireUserId();

  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      forms: { take: 1 },
      _count: { select: { testimonials: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_350px]">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Your Projects</h2>
          <Badge className="border-primary/20 bg-primary/10 text-primary">
            {projects.length} Total
          </Badge>
        </div>
        
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <LayoutDashboard size={24} />
            </div>
            <h3 className="text-lg font-medium text-foreground">No walls yet</h3>
            <p className="mt-1 text-muted-foreground">Create your first testimonial wall to start collecting feedback.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <div key={project.id} className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-accent/50 hover:shadow-md">
                <div className="flex flex-col p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div 
                      className="mt-1 h-3 w-3 rounded-full" 
                      style={{ backgroundColor: project.brandColor }} 
                    />
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">/w/{project.slug}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3 sm:mt-0">
                    <div className="text-right mr-4 hidden sm:block">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Submissions</p>
                      <p className="text-lg font-bold text-foreground">{project._count.testimonials}</p>
                    </div>
                    <Link href={`/app/projects/${project.slug}`}>
                      <Button size="sm">Manage</Button>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-t border-border bg-muted/30 px-5 py-3">
                  <Link href={`/w/${project.slug}`} target="_blank" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary">
                    <Globe size={14} /> Public Wall
                  </Link>
                  {project.forms[0] ? (
                    <Link href={`/f/${project.forms[0].publicId}`} target="_blank" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary">
                      <MessageSquare size={14} /> Submission Form
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <CreateProjectForm />
        
        <div className="rounded-2xl bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground shadow-lg">
          <h4 className="font-bold">Pro Tip</h4>
          <p className="mt-2 text-sm opacity-95">Embed your Wall of Love on your landing page to increase conversion rates by up to 20%.</p>
          <Link href="/app/projects">
            <Button variant="ghost" className="mt-3 h-auto p-0 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              Go to project settings <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
