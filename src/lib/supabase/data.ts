import type { GalleryItem, NewsItem, Profile, SiteConfig, SocialLink } from "@/data/site-config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DEFAULT_COLOR = "bg-white";

export async function fetchSiteConfig(): Promise<SiteConfig | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("profile")
    .select("name,title,slogan,email,tags,socials")
    .maybeSingle();

  if (profileError || !profileRow) {
    return null;
  }

  const profile: Profile = {
    name: profileRow.name ?? "",
    title: profileRow.title ?? "",
    slogan: profileRow.slogan ?? "",
    email: profileRow.email ?? "",
    tags: Array.isArray(profileRow.tags) ? profileRow.tags : [],
    socials: Array.isArray(profileRow.socials)
      ? (profileRow.socials as SocialLink[])
      : [],
  };

  const { data: newsRows } = await supabase
    .from("news")
    .select("id,date,emoji,content,sort_order")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("id", { ascending: true });

  const news: NewsItem[] = (newsRows ?? []).map((item) => ({
    id: Number(item.id),
    date: item.date ?? "",
    emoji: item.emoji ?? "",
    content: item.content ?? "",
  }));

  const { data: galleryRows } = await supabase
    .from("gallery")
    .select("id,title,image_url,tag,prompt,sort_order")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("id", { ascending: true });

  const gallery: GalleryItem[] = (galleryRows ?? []).map((item) => ({
    id: Number(item.id),
    title: item.title ?? "",
    imageUrl: item.image_url ?? "",
    tag: item.tag ?? "",
    prompt: item.prompt ?? "",
    color: DEFAULT_COLOR,
  }));

  return { profile, news, gallery };
}
