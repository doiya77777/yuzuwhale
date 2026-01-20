import { createClient } from "@supabase/supabase-js";

const shouldLog = process.env.NODE_ENV !== "production";

const safeFetch: typeof fetch = async (...args) => {
  try {
    return await fetch(...args);
  } catch (error) {
    if (shouldLog) {
      console.warn("Supabase fetch failed.", error);
    }
    return new Response(null, {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
};

export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
    global: { fetch: safeFetch },
  });
}
