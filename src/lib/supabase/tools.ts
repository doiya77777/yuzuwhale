import { createClient } from "@supabase/supabase-js";
import { MOCK_TOOLS, type Tool } from "@/data/mock-tools";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Optional: create client only if env vars exist
const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export async function getTools(): Promise<Tool[]> {
  if (!supabase) {
    console.warn("Supabase not configured, returning mock tools.");
    return MOCK_TOOLS;
  }

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("published", true)
    .order("rating_overall", { ascending: false });

  if (error) {
    console.error("Error fetching tools:", error);
    return MOCK_TOOLS; // Fallback to mock on error
  }

  // If table is empty, return mock data for demonstration
  if (!data || data.length === 0) {
      return MOCK_TOOLS;
  }

  return data as Tool[];
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
    if (!supabase) {
        return MOCK_TOOLS.find(t => t.slug === slug) || null;
    }

    const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("slug", slug)
        .single();
    
    if (error || !data) {
        // Fallback to mock
        return MOCK_TOOLS.find(t => t.slug === slug) || null;
    }

    return data as Tool;
}
