import type {
  GalleryItem,
  NewsItem,
  Profile,
  SiteConfig,
  SocialLink,
} from "@/data/site-config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DEFAULT_COLOR = "bg-white";

export async function fetchSiteConfig(): Promise<SiteConfig | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("profile")
    .select("name,title,slogan,email,tags,socials,avatar_url,show_gallery")
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
    avatarUrl: profileRow.avatar_url ?? "",
    showGallery: profileRow.show_gallery ?? false,
  };

  const { data: newsRows } = await supabase
    .from("news")
    .select(
      "id,date,emoji,title,summary,source,url,content,content_md,content_html,published_at,sort_order",
    )
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: false });

  const news: NewsItem[] = (newsRows ?? []).map((item) => ({
    id: Number(item.id),
    date: item.date ?? "",
    emoji: item.emoji ?? "",
    title: item.title ?? item.content ?? "",
    summary: item.summary ?? item.content ?? "",
    source: item.source ?? "",
    url: item.url ?? "",
    contentMd: item.content_md ?? item.content ?? "",
    contentHtml: item.content_html ?? undefined,
    publishedAt: item.published_at ?? undefined,
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
