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

If the env vars are missing, the app falls back to the local data in `src/data/site-config.ts`.

## Deploy

Push to `main` and Vercel will deploy automatically via GitHub integration.
