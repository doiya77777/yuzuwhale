# Yuzu Whale Site

## Local Dev

```bash
npm install
npm run dev
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Insert one row into `profile`, and fill `news` / `gallery` tables.
4. Copy the Project URL and anon key into environment variables.

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

If the env vars are missing, the app will show a setup message on the homepage.

### Profile Fields

`profile` supports:

- `name`, `title`, `slogan`, `email`
- `tags` (text array)
- `socials` (json array: `{ platform, url }`)
- `avatar_url` (optional)
- `show_gallery` (boolean)

## RSS News Sync

We fetch real news from official AI blogs and write into Supabase.

Set the server-side env vars:

```bash
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
```

Run once:

```bash
npm run sync:news
```

This will pull latest RSS entries, summarize with AI, and store `title/summary/content` for the news list and detail page.

### GitHub Actions (自动同步)

Add repo secrets:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` (optional, for AI summaries)
- `OPENAI_MODEL` (optional)

The workflow `Sync News` runs every 6 hours and can be triggered manually.

## Deploy

Push to `main` and Vercel will deploy automatically via GitHub integration.
