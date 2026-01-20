import { createClient } from "@supabase/supabase-js";
import { MOCK_PRODUCTS, type Product } from "@/data/mock-products";
import { canReachSupabase } from "@/lib/supabase/reachability";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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

// Optional: create client only if env vars exist
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { global: { fetch: safeFetch } })
  : null;

export async function getProducts(): Promise<Product[]> {
  if (!supabase) {
    if (shouldLog) {
      console.warn("Supabase not configured, returning mock products.");
    }
    return MOCK_PRODUCTS;
  }
  if (!(await canReachSupabase(supabaseUrl))) {
    return MOCK_PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from("tools") // Keep table name as 'tools' for now
      .select("*")
      .eq("published", true)
      .order("rating_overall", { ascending: false });

    if (error) {
      if (shouldLog) {
        console.warn(
          "Supabase products query failed, using mock products.",
          error,
        );
      }
      return MOCK_PRODUCTS;
    }

    if (!data || data.length === 0) {
      return MOCK_PRODUCTS;
    }

    return data as Product[];
  } catch (error) {
    if (shouldLog) {
      console.warn("Supabase products fetch failed, using mock products.", error);
    }
    return MOCK_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) {
    return MOCK_PRODUCTS.find((t) => t.slug === slug) || null;
  }
  if (!(await canReachSupabase(supabaseUrl))) {
    return MOCK_PRODUCTS.find((t) => t.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return MOCK_PRODUCTS.find((t) => t.slug === slug) || null;
    }

    return data as Product;
  } catch (error) {
    if (shouldLog) {
      console.warn(
        "Supabase product lookup failed, using mock products.",
        error,
      );
    }
    return MOCK_PRODUCTS.find((t) => t.slug === slug) || null;
  }
}
