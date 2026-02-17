import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
import { CopyButton } from "@/components/copy-button";
import { ShareButton } from "@/components/share-button";
import { ShareQrButton } from "@/components/share-qr-button";
import { ProjectAppearanceForm } from "@/components/project-appearance-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBaseUrl } from "@/lib/utils";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const userId = await requireUserId();
  const { slug } = await params;

  const project = await prisma.project.findFirst({
    where: { slug, userId },
    include: {
      forms: { take: 1 },
      _count: { select: { testimonials: true } },
    },
  });

  if (!project || !project.forms[0]) notFound();
  const statusGroups = await prisma.testimonial.groupBy({
    by: ["status"],
    where: { projectId: project.id },
    _count: { _all: true },
  });

  const pendingCount = statusGroups.find((group) => group.status === "PENDING")?._count._all ?? 0;
  const approvedCount = statusGroups.find((group) => group.status === "APPROVED")?._count._all ?? 0;
  const rejectedCount = statusGroups.find((group) => group.status === "REJECTED")?._count._all ?? 0;

  async function updateProject(formData: FormData) {
    "use server";
    const userIdInner = await requireUserId();
    const slugInner = String(formData.get("slug") || "");
    const existing = await prisma.project.findFirst({ where: { slug: slugInner, userId: userIdInner } });
    if (!existing) notFound();
    const nameInput = String(formData.get("name") || existing.name).trim();
    const themeInput = String(formData.get("theme") || existing.theme);
    const layoutInput = String(formData.get("layout") || existing.layout);
    const brandColorPickerInput = String(formData.get("brandColor") || existing.brandColor);
    const brandColorHexInput = String(formData.get("brandColorHex") || "").trim();

    const theme = themeInput === "dark" ? "dark" : "light";
    const layout = layoutInput === "list" ? "list" : layoutInput === "carousel" ? "carousel" : "grid";
    const autoplayValues = formData.getAll("carouselAutoplay").map(String);
    const carouselAutoplay = layout === "carousel" && autoplayValues.includes("true");
    const brandColorSource = brandColorHexInput || brandColorPickerInput;
    const brandColor = /^#([0-9a-fA-F]{6})$/.test(brandColorSource) ? brandColorSource : existing.brandColor;

    await prisma.project.update({
      where: { id: existing.id },
      data: {
        name: nameInput || existing.name,
        brandColor,
        theme,
        layout,
        carouselAutoplay,
      },
    });

    revalidatePath(`/app/projects/${slugInner}`);
    revalidatePath(`/w/${slugInner}`);
    revalidatePath(`/embed/w/${slugInner}`);
    redirect(`/app/projects/${slugInner}`);
  }

  async function updateFormAvailability(formData: FormData) {
    "use server";
    const userIdInner = await requireUserId();
    const slugInner = String(formData.get("slug") || "");
    const isActive = String(formData.get("isActive") || "") === "true";
    const existing = await prisma.project.findFirst({
      where: { slug: slugInner, userId: userIdInner },
      include: { forms: { take: 1 } },
    });
    if (!existing || !existing.forms[0]) notFound();

    await prisma.form.update({
      where: { id: existing.forms[0].id },
      data: { isActive },
    });

    revalidatePath(`/app/projects/${slugInner}`);
    revalidatePath(`/f/${existing.forms[0].publicId}`);
  }

  const base = getBaseUrl();
  const formUrl = `${base}/f/${project.forms[0].publicId}`;
  const wallUrl = `${base}/w/${project.slug}`;
  const embedUrl = `${base}/embed/w/${project.slug}?theme=${project.theme}&layout=${project.layout}&autoplay=${project.carouselAutoplay}`;
  const iframeId = `testiwall-${project.slug}`;
  const formQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(formUrl)}`;
  const embedSnippet = `<script src="https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.9/js/iframeResizer.min.js"></script>
<iframe id="${iframeId}" src="${embedUrl}" frameborder="0" scrolling="no" width="100%" style="min-width:100%"></iframe>
<script>iFrameResize({log:false,checkOrigin:false},"#${iframeId}");</script>`;

  return (
    <section className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-sm">
        <div className="border border-border bg-linear-to-r from-muted/30 to-card p-6" style={{ borderTop: `3px solid ${project.brandColor}` }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Project</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{project.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">/{project.slug}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={wallUrl} target="_blank">
                <Button variant="outline">Open wall</Button>
              </Link>
              <Link href={`/app/projects/${project.slug}/testimonials`}>
                <Button>Review submissions</Button>
              </Link>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="mt-1 text-xl font-semibold">{project._count.testimonials}</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-700">Pending</p>
              <p className="mt-1 text-xl font-semibold text-amber-900">{pendingCount}</p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800/60 dark:bg-emerald-950/40">
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Approved</p>
              <p className="mt-1 text-xl font-semibold text-emerald-900 dark:text-emerald-100">{approvedCount}</p>
            </div>
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
              <p className="text-xs text-rose-700">Rejected</p>
              <p className="mt-1 text-xl font-semibold text-rose-900">{rejectedCount}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share Links</CardTitle>
              <CardDescription>Send your form link to customers and share the public wall.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-border p-3 text-sm">
                <p className="font-medium">Customer form link</p>
                <p className="mt-1 break-all text-muted-foreground">{formUrl}</p>
                <div className="mt-3 flex gap-2">
                  <CopyButton value={formUrl} label="Copy form link" />
                  <ShareButton url={formUrl} title={`${project.name} testimonial form`} label="Share form link" />
                  <Link href={formUrl} target="_blank"><Button size="sm" variant="outline">Open</Button></Link>
                </div>
                <div className="mt-4 w-fit rounded-md border border-border bg-card p-3">
                  <p className="mb-2 text-xs text-muted-foreground">Scan QR to open form</p>
                  <p className="mb-3 text-xs text-muted-foreground max-w-[200px]">
                    Share this QR code at events, on print materials, or post it for customers to scan and leave testimonials.
                  </p>
                  <Image src={formQrCodeUrl} alt={`QR code for ${project.name} form link`} width={160} height={160} className="rounded-md" unoptimized />
                  <ShareQrButton
                    imageUrl={formQrCodeUrl}
                    title={`${project.name} testimonial form`}
                    description={`Scan this QR code to leave your testimonial for ${project.name}. Or open: ${formUrl}`}
                    label="Share QR code"
                    className="mt-3 w-full"
                  />
                </div>
              </div>
              <div className="rounded-md border border-border p-3 text-sm">
                <p className="font-medium">Public wall page</p>
                <p className="mt-1 break-all text-muted-foreground">{wallUrl}</p>
                <div className="mt-3 flex gap-2">
                  <CopyButton value={wallUrl} label="Copy wall link" />
                  <ShareButton url={wallUrl} title={`${project.name} testimonial wall`} label="Share wall link" />
                  <Link href={wallUrl} target="_blank"><Button size="sm" variant="outline">Open</Button></Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Website Embed</CardTitle>
              <CardDescription>Add the Wall of Love to your website. Paste this code where you want testimonials to appear.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Paste this where you want testimonials. It reflects your current layout ({project.layout}) and theme ({project.theme}).
              </p>
              <div className="min-w-0">
                <pre className="embed-code-scrollbar max-w-full overflow-x-auto rounded-lg border border-slate-700/50 bg-slate-950 px-4 py-3 font-mono text-[13px] leading-relaxed text-slate-300 dark:border-slate-600/50">
                  <code className="block whitespace-pre">{embedSnippet}</code>
                </pre>
              </div>
              <div className="flex flex-wrap gap-2">
                <CopyButton value={embedSnippet} label="Copy embed code" />
                <Link href={embedUrl} target="_blank">
                  <Button variant="outline" size="sm">Preview</Button>
                </Link>
                <Link href={wallUrl} target="_blank">
                  <Button variant="outline" size="sm">Open full wall</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Form Access</CardTitle>
            <CardDescription>Enable or disable public submissions from your form link.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border border-border bg-muted p-3 text-sm">
              <p className="font-medium">Current status: {project.forms[0].isActive ? "Accepting submissions" : "Not accepting submissions"}</p>
              <p className="mt-1 text-muted-foreground">Form URL stays the same. Turning this off blocks new submissions instantly.</p>
            </div>
            <form action={updateFormAvailability}>
              <input type="hidden" name="slug" value={project.slug} />
              <input type="hidden" name="isActive" value={project.forms[0].isActive ? "false" : "true"} />
              <Button className="w-full" type="submit" variant={project.forms[0].isActive ? "outline" : "default"}>
                {project.forms[0].isActive ? "Disable submissions" : "Enable submissions"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance Settings</CardTitle>
            <CardDescription>Customize how your testimonial wall looks.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectAppearanceForm
              action={updateProject}
              project={{
                slug: project.slug,
                name: project.name,
                brandColor: project.brandColor,
                theme: project.theme,
                layout: project.layout,
                carouselAutoplay: project.carouselAutoplay,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

