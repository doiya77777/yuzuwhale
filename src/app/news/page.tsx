import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NewsClient } from "@/app/news/news-client";
import { canReachSupabase } from "@/lib/supabase/reachability";

export const revalidate = 300;
type NewsRow = {
  id: number;
  title?: string | null;
  summary?: string | null;
  source?: string | null;
  url?: string | null;
  emoji?: string | null;
  date?: string | null;
  published_at?: string | null;
};

function normalizeDateParam(value: string | string[] | undefined) {
  if (!value) return "";
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return "";
  return trimmed;
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const dateFilter = normalizeDateParam(params.date);
  const supabase = createSupabaseServerClient();

  if (
    !supabase ||
    !(await canReachSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL))
  ) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#FEF9C3_0%,#E0F2FE_100%)] px-6 py-16 text-[#172554]">
        <div className="mx-auto max-w-2xl rounded-3xl border-4 border-[#172554] bg-white p-6 text-center hard-shadow">
          <h1 className="text-2xl font-black">资讯尚未配置</h1>
          <p className="mt-3 text-sm font-semibold text-[#1e3a8a]">
            请先配置 Supabase 后再查看资讯列表。
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full border-2 border-[#172554] bg-white px-4 py-2 text-sm font-bold hard-shadow"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  let query = supabase
    .from("news")
    .select("id,title,summary,source,url,emoji,date,published_at");

  if (dateFilter) {
    query = query.eq("date", dateFilter);
  }

  let newsItems: NewsRow[] | null = null;

  try {
    const { data } = await query
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("id", { ascending: false });
    newsItems = data as NewsRow[] | null;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Supabase news query failed, returning empty list.", error);
    }
  }

  const items =
    newsItems?.map((item) => ({
      id: Number(item.id),
      title: item.title ?? "",
      summary: item.summary ?? "",
      source: item.source ?? "",
      url: item.url ?? "",
      emoji: item.emoji ?? "",
      date: item.date ?? "",
      publishedAt: item.published_at ?? undefined,
    })) ?? [];

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#FEF9C3_0%,#E0F2FE_100%)] px-4 pb-24 pt-10 text-[#172554]">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.3em]">AI NEWS</p>
            <h1 className="text-3xl font-black">资讯汇总</h1>
            {dateFilter ? (
              <p className="mt-2 text-sm font-semibold text-[#1e3a8a]">
                当前日期筛选：{dateFilter}
              </p>
            ) : null}
          </div>
          <Link
            href="/"
            className="rounded-full border-2 border-[#172554] bg-white px-4 py-2 text-sm font-bold hard-shadow"
          >
            返回首页
          </Link>
        </div>

        <NewsClient items={items} initialDate={dateFilter} />
      </div>
    </div>
  );
}
