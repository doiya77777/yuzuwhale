"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getNewsDetail(id: number) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: Number(data.id),
    title: data.title ?? "",
    summary: data.summary ?? "",
    source: data.source ?? "",
    url: data.url ?? "",
    emoji: data.emoji ?? "",
    date: data.date ?? "",
    contentMd: data.content_md ?? "",
    contentHtml: data.content_html ?? "",
    publishedAt: data.published_at ?? null,
  };
}

type NewsUpdateData = {
  title?: string;
  summary?: string;
  contentMd?: string;
  source?: string;
  url?: string;
  emoji?: string;
  date?: string;
};

export async function updateNewsItem(id: number, formData: NewsUpdateData) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase
    .from("news")
    .update({
      title: formData.title,
      summary: formData.summary,
      content_md: formData.contentMd,
      source: formData.source,
      url: formData.url,
      emoji: formData.emoji,
      date: formData.date,
      // We generally update content_html if we have a mechanism to generate it from md,
      // but for now we might just be updating what was passed. 
      // If content_html isn't passed, we assume content_md is the source of truth.
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/news");
  revalidatePath(`/news/${id}`);
  return { success: true };
}
