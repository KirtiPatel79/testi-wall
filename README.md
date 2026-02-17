# TestiWall MVP

TestiWall is an MVP SaaS app for collecting customer testimonials and publishing them as a public wall.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn-style UI components
- Auth.js (NextAuth v5 beta) with credentials login
- Prisma ORM + PostgreSQL
- Zod validation
- Local disk upload storage (`public/uploads`) with abstraction in `lib/storage.ts`

## Features

- Signup/login/logout
- Project creation and settings
- One active public form per project (`/f/{formPublicId}`)
- Public no-login testimonial submission with image upload
- Moderation dashboard (pending/approved/rejected + edit/delete)
- Public wall (`/w/{projectSlug}`)
- Embed options:
  - Script embed (`/embed.js`) for SEO-friendly HTML injection
  - Iframe embed (`/embed/w/{projectSlug}`)
- Public API:
  - `GET /api/public/projects/{slug}/testimonials`
  - `POST /api/public/forms/{formPublicId}/submit`
- Middleware IP rate limiting for public submit endpoint

## Setup (Local)

1. Copy env file:

```bash
cp .env.example .env
```

2. Start PostgreSQL:

```bash
docker compose up -d postgres
```

3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client and apply migrations:

```bash
npm run db:generate
npm run db:migrate
```

For a fresh database, migrations run automatically. If you previously used `db:push`, run `npx prisma migrate resolve --applied 0_baseline` first, then `npm run db:migrate`.

5. (Optional) Seed demo data:

```bash
npm run db:seed
```

6. Start app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

See `.env.example`:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXTAUTH_SECRET`
- `SEED_USER_EMAIL`
- `SEED_USER_PASSWORD`

## Local Embed Test (Plain HTML)

Create `embed-test.html` anywhere with:

```html
<!doctype html>
<html>
  <body>
    <h1>Embedded Testimonials</h1>
    <script async src="http://localhost:3000/embed.js" data-project="demo-project" data-theme="light" data-layout="grid" data-limit="6" data-show-rating="true" data-autoplay="false"></script>
  </body>
</html>
```

Open it in your browser while dev server is running.

## Iframe Embed Example (testimonial.to style)

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.9/js/iframeResizer.min.js"></script>
<iframe id="testiwall-wall-demo-project-light" src="http://localhost:3000/embed/w/demo-project?theme=light&layout=grid&autoplay=false" frameborder="0" scrolling="no" width="100%" style="min-width: 100%;"></iframe>
<script type="text/javascript">iFrameResize({log: false, checkOrigin: false}, "#testiwall-wall-demo-project-light");</script>
```

The iframe auto-resizes to fit its content height.

## Production Deployment

### Database migrations

Use Prisma Migrate for production (not `db:push`):

```bash
npx prisma migrate deploy
```

- **Fresh deploy**: Migrations create and update tables.
- **Existing DB (from db:push)**: Run `npx prisma migrate resolve --applied 0_baseline` once, then `npx prisma migrate deploy`.

### Production checklist

- [ ] Strong `NEXTAUTH_SECRET` (32+ random chars)
- [ ] `NEXT_PUBLIC_APP_URL` set to production URL
- [ ] Persistent PostgreSQL with backups
- [ ] File storage: `public/uploads` persisted (or switch to S3/R2 in `lib/storage.ts`)
- [ ] HTTPS enabled
- [ ] Rate limiting on public endpoints (see middleware)

## Docker Deployment (High Level)

- `docker-compose.yml` includes `postgres` and `app` services.
- Build/start:

```bash
docker compose up --build -d
```

- Ensure a production `NEXTAUTH_SECRET` and persistent Postgres volume.
- Run `npx prisma migrate deploy` against production DB before traffic.

## Commands

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run db:generate`
- `npm run db:push`
- `npm run db:migrate`
- `npm run db:seed`

## MVP Notes / TODOs

- Carousel layout is fully supported.
- Iframe auto-resizes via iframe-resizer (testimonial.to style).
- Invite-token requirement exists in schema/settings and is reserved for future enforcement.
