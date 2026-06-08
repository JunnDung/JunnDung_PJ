# Private Margins

Fullstack personal editorial blog built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and Supabase Postgres.

## Features

- Editorial homepage and long-form post pages
- Search API backed by Postgres
- Newsletter subscriptions stored in DB
- Admin login with HttpOnly cookie sessions
- Admin CMS for articles
- Bookmarks for logged-in users
- Sitemap, robots, JSON-LD metadata
- Security headers, same-origin mutation guard, basic rate limiting
- Vercel-ready build setup

## Local setup

```bash
npm install
cp .env.example .env
```

Edit `.env` with Supabase Postgres URLs and a strong admin password.

Generate Prisma client:

```bash
npx prisma generate
```

Apply schema and seed sample data:

```bash
npx prisma migrate dev --name init
npm run db:seed
```

Run dev server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Admin

Login page:

```txt
/login
```

Admin pages:

```txt
/admin
/admin/articles
/admin/articles/new
/admin/newsletter
/admin/audit
/admin/security
```

Admin credentials come from `.env`:

```env
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-with-a-long-random-password"
```

Use a 20+ character password for demo deploys.

## Vercel deploy

Set these Environment Variables in Vercel:

```env
DATABASE_URL="postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres"
NEXT_PUBLIC_SITE_URL="https://your-project.vercel.app"
NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_xxx"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-with-a-long-random-password"
IMAGE_ALLOWED_HOSTS="images.unsplash.com"
```

Build command is configured through `npm run build`, which runs Prisma generate first.

Before deploy:

```bash
npx prisma validate
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run build
```

Do not run seed automatically on every Vercel deploy. Seed once from local or Supabase SQL workflow.

## Security notes

- Rotate any DB password that was shared outside secret storage.
- `.env*` is gitignored; never commit real secrets.
- Mutating API routes check same-origin requests.
- Admin pages require DB-backed admin sessions.
- CSP is report-only by default to avoid breaking the demo; inspect console before enforcing.
- Rate limiting is in-memory, enough for a small CV demo. Use Redis/Upstash for high-traffic production.

## Useful commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npx prisma studio
npm run db:seed
```
