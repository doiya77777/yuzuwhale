import { createClient } from "@supabase/supabase-js";
import { MOCK_PRODUCTS, type Product } from "@/data/mock-products";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Optional: create client only if env vars exist
const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export async function getProducts(): Promise<Product[]> {
  if (!supabase) {
    console.warn("Supabase not configured, returning mock products.");
    return MOCK_PRODUCTS;
  }

  const { data, error } = await supabase
    .from("tools") // Keep table name as 'tools' for now
    .select("*")
    .eq("published", true)
    .order("rating_overall", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return MOCK_PRODUCTS; // Fallback to mock on error
  }

  if (!data || data.length === 0) {
      return MOCK_PRODUCTS;
  }

  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    if (!supabase) {
        return MOCK_PRODUCTS.find(t => t.slug === slug) || null;
    }

    const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("slug", slug)
        .single();
    
    if (error || !data) {
        return MOCK_PRODUCTS.find(t => t.slug === slug) || null;
    }

    return data as Product;
}
