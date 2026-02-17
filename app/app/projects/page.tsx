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
          <h2 className="text-xl font-semibold text-slate-900">Your Projects</h2>
          <Badge className="border-sky-100 bg-sky-50 text-sky-700">
            {projects.length} Total
          </Badge>
        </div>
        
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
              <LayoutDashboard size={24} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No walls yet</h3>
            <p className="mt-1 text-slate-500">Create your first testimonial wall to start collecting feedback.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <div key={project.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-sky-200 hover:shadow-md">
                <div className="flex flex-col p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div 
                      className="mt-1 h-3 w-3 rounded-full" 
                      style={{ backgroundColor: project.brandColor }} 
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{project.name}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">/w/{project.slug}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3 sm:mt-0">
                    <div className="text-right mr-4 hidden sm:block">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Submissions</p>
                      <p className="text-lg font-bold text-slate-900">{project._count.testimonials}</p>
                    </div>
                    <Link href={`/app/projects/${project.slug}`}>
                      <Button size="sm" className="bg-slate-900 hover:bg-slate-800">Manage</Button>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                  <Link href={`/w/${project.slug}`} target="_blank" className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-sky-600">
                    <Globe size={14} /> Public Wall
                  </Link>
                  {project.forms[0] ? (
                    <Link href={`/f/${project.forms[0].publicId}`} target="_blank" className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-sky-600">
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
        
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-600 p-6 text-white shadow-lg shadow-indigo-200/50">
          <h4 className="font-bold">Pro Tip</h4>
          <p className="mt-2 text-sm text-indigo-100 opacity-95">Embed your Wall of Love on your landing page to increase conversion rates by up to 20%.</p>
          <Link href="/app/projects">
            <Button variant="ghost" className="mt-3 h-auto p-0 text-sm font-semibold text-white hover:bg-white/10 hover:text-white">
              Go to project settings <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
