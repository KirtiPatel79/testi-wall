import { randomUUID } from "crypto";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TESTIMONIALS = [
  { name: "Jane Doe", rating: 5, text: "TestiWall made testimonial collection frictionless. Setup took 2 minutes and our landing page now converts 40% better.", status: "APPROVED" as const },
  { name: "Alex Chen", rating: 5, text: "Absolutely love it! We've collected over 50 testimonials in the first month. The embed looks stunning on our site.", status: "APPROVED" as const },
  { name: "Sarah Mitchell", rating: 4.5, text: "Simple, elegant, and it just works. Customer support was incredibly responsive when we had questions.", status: "APPROVED" as const },
  { name: "Mike Thompson", rating: 5, text: "Best testimonial tool we've tried. No more manual copy-pasting from emails into our website.", status: "APPROVED" as const },
  { name: "Emily Roberts", rating: 4, text: "Great product! The moderation dashboard makes it easy to curate what goes live. Would recommend.", status: "APPROVED" as const },
  { name: "David Park", rating: 5, text: "Switched from our old solution and never looked back. Our sales team uses the wall on every demo call.", status: "APPROVED" as const },
  { name: "Lisa Anderson", rating: 4.5, text: "The iframe embed is seamless. Clients often ask how we set it up - they think we built it custom!", status: "APPROVED" as const },
  { name: "James Wilson", rating: 5, text: "Finally, a testimonial tool that doesn't require a developer. Our marketing team runs it independently.", status: "APPROVED" as const },
  { name: "Rachel Green", rating: 4, text: "Clean design, easy to use. The star ratings add credibility. Our conversion rate improved noticeably.", status: "APPROVED" as const },
  { name: "Chris Martinez", rating: 5, text: "10/10 would recommend. We use it for our SaaS product and it's been a game-changer for trust-building.", status: "APPROVED" as const },
  { name: "Amanda Lee", rating: 4.5, text: "Love the grid and list layouts. We switch between them for different pages. Very flexible.", status: "APPROVED" as const },
  { name: "Ryan Cooper", rating: 5, text: "The best $0 we've spent. Free tier is generous. Will definitely upgrade as we grow.", status: "APPROVED" as const },
  { name: "Nicole Brown", rating: 4, text: "Simple setup, professional look. Our testimonials now match our brand perfectly with the custom colors.", status: "APPROVED" as const },
  { name: "Kevin Taylor", rating: 5, text: "Integration was seamless. We had testimonials live on our site in under 10 minutes.", status: "APPROVED" as const },
  { name: "Jessica White", rating: 4.5, text: "The QR code for the form is genius - we use it at events and collect testimonials on the spot.", status: "APPROVED" as const },
  { name: "Daniel Harris", rating: 5, text: "Our customers love leaving testimonials. The approval workflow keeps spam out. Perfect.", status: "APPROVED" as const },
  { name: "Maria Garcia", rating: 4, text: "Great for small teams. No learning curve. We went from zero to 20 testimonials in one week.", status: "APPROVED" as const },
  { name: "Tom Robinson", rating: 5, text: "The embed script is so clean. Our SEO hasn't suffered at all - Google indexes our reviews properly.", status: "APPROVED" as const },
  { name: "Sophie Clark", rating: 4.5, text: "Beautiful out of the box. We barely customized anything and it looks premium on our landing page.", status: "APPROVED" as const },
  { name: "Andrew Lewis", rating: 5, text: "Exactly what we needed. Collect, moderate, display - all in one place. No more scattered spreadsheets.", status: "APPROVED" as const },
  { name: "Olivia Walker", rating: 4, text: "Wish we found this sooner. Would have saved us months of manual testimonial management.", status: "PENDING" as const },
  { name: "Nathan Hall", rating: 5, text: "Just submitted our first batch. The form was so easy for our customers to fill out. Impressed!", status: "PENDING" as const },
  { name: "Emma Young", rating: 4.5, text: "Testing this for our startup. So far so good - the dark theme matches our site aesthetic perfectly.", status: "PENDING" as const },
  { name: "Brandon King", rating: 3.5, text: "Good tool but would love more customization options. The core functionality is solid.", status: "PENDING" as const },
  { name: "Lauren Scott", rating: 5, text: "Our agency uses this for 5 different client sites. One dashboard to rule them all. Highly recommend!", status: "REJECTED" as const },
  { name: "Justin Adams", rating: 2, text: "Had some issues with the embed not loading on mobile. Reaching out to support.", status: "REJECTED" as const },
  { name: "Megan Nelson", rating: 5, text: "Carousel layout on our homepage gets so many compliments. Looks like we paid thousands for custom dev.", status: "APPROVED" as const },
  { name: "Tyler Wright", rating: 4, text: "Simple and effective. Exactly what a testimonial tool should be. No bloat, no complexity.", status: "APPROVED" as const },
  { name: "Hannah Baker", rating: 5, text: "Switched from our old solution and never looked back. Faster, cleaner, and much better UX for our customers.", status: "APPROVED" as const },
  { name: "Jason Hill", rating: 4.5, text: "The consent checkbox is a nice touch - keeps us compliant. Little details matter.", status: "APPROVED" as const },
];

async function main() {
  const email = process.env.SEED_USER_EMAIL || "demo@testiwall.local";
  const password = process.env.SEED_USER_PASSWORD || "password123";
  const passwordHash = await hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  let project = await prisma.project.findFirst({
    where: { userId: user.id, slug: "demo-project" },
    include: { forms: true },
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        userId: user.id,
        name: "Demo Project",
        slug: "demo-project",
        theme: "light",
        layout: "grid",
        brandColor: "#0ea5e9",
        forms: {
          create: {
            publicId: randomUUID(),
            submissionLimitTotal: 0,
            closeWhenLimitReached: true,
            requireInviteToken: false,
            isActive: true,
          },
        },
      },
      include: { forms: true },
    });
    console.log("Created demo project");
  }

  const form = project.forms[0];
  if (!form) throw new Error("No form found on project");

  const resetTestimonials = process.env.RESET_TESTIMONIALS === "true";
  const existingCount = await prisma.testimonial.count({ where: { projectId: project.id } });

  if (resetTestimonials && existingCount > 0) {
    await prisma.testimonial.deleteMany({ where: { projectId: project.id } });
    console.log(`Cleared ${existingCount} existing testimonials for reseed`);
  }

  if (existingCount > 0 && !resetTestimonials) {
    console.log(`Project already has ${existingCount} testimonials. Set RESET_TESTIMONIALS=true to reseed.`);
  } else {
    for (const t of TESTIMONIALS) {
      await prisma.testimonial.create({
        data: {
          projectId: project.id,
          formId: form.id,
          status: t.status,
          name: t.name,
          rating: t.rating,
          text: t.text,
          consentGiven: true,
        },
      });
    }
    console.log(`Added ${TESTIMONIALS.length} testimonials`);
  }

  const totalCount = await prisma.testimonial.count({ where: { projectId: project.id } });

  console.log("\nSeed complete");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Demo wall: /w/demo-project`);
  console.log(`Total testimonials: ${totalCount} (Approved: ~22, Pending: 4, Rejected: 2)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
