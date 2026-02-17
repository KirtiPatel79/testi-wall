import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
import { moderationUpdateSchema } from "@/lib/validations";
import { sanitizePlainText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Star, Calendar, Image as ImageIcon } from "lucide-react";

export default async function ModerationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const userId = await requireUserId();
  const { slug } = await params;
  const { status } = await searchParams;
  const filter = status && ["PENDING", "APPROVED", "REJECTED"].includes(status) ? status : "ALL";

  const project = await prisma.project.findFirst({ where: { slug, userId } });
  if (!project) notFound();

  const testimonials = await prisma.testimonial.findMany({
    where: {
      projectId: project.id,
      ...(filter === "ALL" ? {} : { status: filter as "PENDING" | "APPROVED" | "REJECTED" }),
    },
    orderBy: { createdAt: "desc" },
  });

  async function updateTestimonial(formData: FormData) {
    "use server";
    const userIdInner = await requireUserId();
    const slugInner = String(formData.get("slug") || "");
    const id = String(formData.get("id") || "");
    const projectInner = await prisma.project.findFirst({ where: { slug: slugInner, userId: userIdInner } });
    if (!projectInner) notFound();

    const parsed = moderationUpdateSchema.safeParse({
      name: String(formData.get("name") || ""),
      text: String(formData.get("text") || ""),
      status: String(formData.get("status") || "PENDING"),
    });

    if (!parsed.success) return;

    await prisma.testimonial.updateMany({
      where: { id, projectId: projectInner.id },
      data: {
        name: sanitizePlainText(parsed.data.name),
        text: sanitizePlainText(parsed.data.text),
        status: parsed.data.status,
      },
    });

    revalidatePath(`/app/projects/${slugInner}/testimonials`);
    revalidatePath(`/w/${slugInner}`);
  }

  async function deleteTestimonial(formData: FormData) {
    "use server";
    const userIdInner = await requireUserId();
    const slugInner = String(formData.get("slug") || "");
    const id = String(formData.get("id") || "");
    const projectInner = await prisma.project.findFirst({ where: { slug: slugInner, userId: userIdInner } });
    if (!projectInner) notFound();

    await prisma.testimonial.deleteMany({ where: { id, projectId: projectInner.id } });
    revalidatePath(`/app/projects/${slugInner}/testimonials`);
    revalidatePath(`/w/${slugInner}`);
  }

  const statusConfig = {
    PENDING: { label: "Pending", className: "border-accent/50 bg-accent/20 text-accent-foreground" },
    APPROVED: { label: "Approved", className: "border-secondary/50 bg-secondary/20 text-secondary-foreground" },
    REJECTED: { label: "Rejected", className: "border-destructive/50 bg-destructive/20 text-destructive-foreground" },
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-foreground">Review Submissions</h2>
        <div className="flex flex-wrap gap-2">
          {[
            ["ALL", "All"],
            ["PENDING", "Pending"],
            ["APPROVED", "Approved"],
            ["REJECTED", "Rejected"],
          ].map(([key, label]) => {
            const isActive = filter === key;
            const config = key === "ALL" ? null : statusConfig[key as keyof typeof statusConfig];
            return (
              <Link
                key={key}
                href={`/app/projects/${slug}/testimonials${key === "ALL" ? "" : `?status=${key}`}`}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? key === "ALL"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "ring-2 ring-offset-1 " + (config?.className ?? "")
                    : key === "ALL"
                    ? "bg-muted text-foreground hover:bg-muted/80"
                    : config?.className ?? "bg-muted"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {testimonials.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted p-12 text-center text-muted-foreground">
          No submissions in this view yet.
        </div>
      ) : null}

      {testimonials.map((t) => (
        <Card key={t.id} className="overflow-hidden border-border">
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {t.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.photoUrl} alt={t.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                    {t.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  <CardDescription className="mt-0.5 flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(t.createdAt)}
                    </span>
                    {t.photoUrl && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <ImageIcon className="h-3.5 w-3.5" />
                        Photo
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
              <Badge className={statusConfig[t.status as keyof typeof statusConfig]?.className}>
                {statusConfig[t.status as keyof typeof statusConfig]?.label ?? t.status}
              </Badge>
            </div>
            {t.rating != null && (
              <div className="mt-2 flex items-center gap-1.5 text-amber-600">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="text-sm font-medium">{t.rating.toFixed(1)} / 5</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <form action={updateTestimonial} className="space-y-4">
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="id" value={t.id} />
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name</label>
                <Input name="name" defaultValue={t.name} placeholder="Customer name" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Testimonial</label>
                <Textarea name="text" defaultValue={t.text} placeholder="Testimonial text" required className="min-h-24" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <Select name="status" defaultValue={t.status} className="w-36">
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </Select>
                </div>
                <Button type="submit" size="sm">Save changes</Button>
              </div>
            </form>
            <form action={deleteTestimonial} className="mt-4 pt-4 border-t border-border">
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="id" value={t.id} />
              <Button type="submit" variant="destructive" size="sm">Delete</Button>
            </form>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

