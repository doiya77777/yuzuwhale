import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NewsClient } from "@/app/news/news-client";

export const revalidate = 300;

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

    if (!supabase) {
        return (
            <div className="relative min-h-screen yuzu-shell px-6 py-16 text-ink">
                <div className="pointer-events-none absolute inset-0 yuzu-bg opacity-35" />
                <div className="relative mx-auto max-w-2xl rounded-3xl soft-card p-6 text-center">
                    <h1 className="font-display text-2xl font-black">
                        资讯尚未配置
                    </h1>
                    <p className="mt-3 text-sm font-semibold text-ink-soft">
                        请先配置 Supabase 后再查看资讯列表。
                    </p>
                    <Link
                        href="/"
                        className="mt-6 inline-flex rounded-full soft-pill px-4 py-2 text-sm font-semibold text-ink"
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

    const { data: newsItems } = await query
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("id", { ascending: false });

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
        <div className="relative min-h-screen yuzu-shell px-4 pb-24 pt-10 text-ink">
            <div className="pointer-events-none absolute inset-0 yuzu-bg opacity-35" />
            <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold tracking-[0.3em] text-ink-muted">
                            AI NEWS
                        </p>
                        <h1 className="font-display text-3xl font-black">
                            资讯汇总
                        </h1>
                        {dateFilter ? (
                            <p className="mt-2 text-sm font-semibold text-ink-soft">
                                当前日期筛选：{dateFilter}
                            </p>
                        ) : null}
                    </div>
                    <Link
                        href="/"
                        className="rounded-full soft-pill px-4 py-2 text-sm font-semibold text-ink"
                    >
                        返回首页
                    </Link>
                </div>

                <NewsClient items={items} initialDate={dateFilter} />
            </div>
        </div>
    );
}
