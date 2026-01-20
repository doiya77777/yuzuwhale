import { NewsNav } from "./news-nav";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NewsArticle } from "@/components/news-article";
import { canReachSupabase } from "@/lib/supabase/reachability";

export const revalidate = 300;

async function fetchNewsItem(id: number) {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return null;
  }
  if (!(await canReachSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL))) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("news")
      .select(
        "id,date,emoji,title,summary,source,url,content_md,content_html,published_at",
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: Number(data.id),
      date: data.date ?? "",
      emoji: data.emoji ?? "",
      title: data.title ?? data.content_md ?? "",
      summary: data.summary ?? "",
      source: data.source ?? "",
      url: data.url ?? "",
      contentMd: data.content_md ?? "",
      contentHtml: data.content_html ?? "",
      publishedAt: data.published_at ?? undefined,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Supabase news detail fetch failed.", error);
    }
    return null;
  }
}

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isFinite(id)) {
    notFound();
  }

  const item = await fetchNewsItem(id);
  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#FEF9C3_0%,#E0F2FE_100%)] px-4 pb-24 pt-4 text-[#172554]">
      
      {/* Client Component for Navigation */}
      <NewsNav title={item.title} />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <NewsArticle item={item} />
      </div>
    </div>
  );
}
