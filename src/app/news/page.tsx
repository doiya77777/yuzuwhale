import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const revalidate = 300;

function formatDate(value?: string) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });
}

export default async function NewsPage() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
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

  const { data: newsItems } = await supabase
    .from("news")
    .select("id,title,summary,source,url,emoji,date,published_at")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: false });

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#FEF9C3_0%,#E0F2FE_100%)] px-4 pb-24 pt-10 text-[#172554]">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.3em]">AI NEWS</p>
            <h1 className="text-3xl font-black">资讯汇总</h1>
          </div>
          <Link
            href="/"
            className="rounded-full border-2 border-[#172554] bg-white px-4 py-2 text-sm font-bold hard-shadow"
          >
            返回首页
          </Link>
        </div>

        <div className="space-y-4">
          {(newsItems ?? []).map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border-4 border-[#172554] bg-white p-5 hard-shadow"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                <span className="rounded-full bg-[#1D4ED8] px-3 py-1 text-white">
                  {item.date || formatDate(item.published_at)}
                </span>
                <span>{item.emoji}</span>
                <span className="text-[#1e3a8a]">{item.source}</span>
              </div>
              <h2 className="mt-3 text-xl font-black">{item.title}</h2>
              {item.summary ? (
                <p className="mt-2 text-sm font-semibold text-[#1e3a8a]">
                  {item.summary}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={`/news/${item.id}`}
                  className="rounded-full border-2 border-[#172554] bg-[#FDE047] px-3 py-1 text-xs font-bold"
                >
                  阅读详情 →
                </Link>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#1D4ED8] underline"
                  >
                    原文链接
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
