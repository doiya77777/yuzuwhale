import type {
  GalleryItem,
  NewsItem,
  Profile,
  Product,
  SiteConfig,
  SocialLink,
} from "@/data/site-config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MOCK_PRODUCTS } from "@/data/mock-products";

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

      const socials = (profileRow.socials as SocialLink[]) || [];
      
      // Patch: Ensure X link is correct and filter out empty ones
      const updatedSocials = socials.map(s => {
        if (s.platform.toLowerCase() === 'twitter' || s.platform.toLowerCase() === 'x') {
          return { ...s, url: 'https://x.com/yuzuwvle' };
        }
        return s;
      }).filter(s => s.url && s.url !== '#' && !s.url.includes('example.com'));
  
      // If no Twitter/X exists, add it (optional, based on request)
      if (!updatedSocials.find(s => s.platform.toLowerCase() === 'twitter' || s.platform.toLowerCase() === 'x')) {
         updatedSocials.push({ platform: 'Twitter', url: 'https://x.com/yuzuwvle' });
      }
  
      const profile: Profile = {
        name: profileRow.name ?? "",
        title: profileRow.title ?? "",
        slogan: profileRow.slogan ?? "",
        email: profileRow.email ?? "",
        tags: Array.isArray(profileRow.tags) ? profileRow.tags : [],
        socials: updatedSocials,
        avatarUrl: profileRow.avatar_url ?? "",
        showGallery: profileRow.show_gallery ?? false,
      };
  const { data: newsRows } = await supabase
    .from("news")
    .select(
      "id,date,emoji,title,summary,source,url,content_md,content_html,published_at",
    )
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: false });

  const news: NewsItem[] = (newsRows ?? []).map((item) => ({
    id: Number(item.id),
    date: item.date ?? "",
    emoji: item.emoji ?? "",
    title: item.title ?? "",
    summary: item.summary ?? "",
    source: item.source ?? "",
    url: item.url ?? "",
    contentMd: item.content_md ?? "",
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

  const { data: productRows } = await supabase
    .from("tools")
    .select("id,slug,title,subtitle,cover_image,category,tags,rating_overall")
    .eq("published", true)
    .order("rating_overall", { ascending: false });

  let products: Product[] = [];
  if (productRows && productRows.length > 0) {
     products = productRows.map((item) => ({
        id: Number(item.id),
        slug: item.slug,
        title: item.title,
        subtitle: item.subtitle,
        coverImage: item.cover_image,
        category: item.category,
        tags: item.tags ?? [],
        ratingOverall: Number(item.rating_overall),
     }));
  } else {
     // Fallback to MOCK_PRODUCTS if DB is empty
     products = MOCK_PRODUCTS.map(p => ({
         id: p.id,
         slug: p.slug,
         title: p.title,
         subtitle: p.subtitle,
         coverImage: p.cover_image,
         category: p.category,
         tags: p.tags,
         ratingOverall: p.rating_overall
     }));
  }

  return { profile, news, gallery, products };
}
