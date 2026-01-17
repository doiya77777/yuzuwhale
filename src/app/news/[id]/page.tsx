import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
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
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function fetchNewsItem(id: number) {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

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
    <div className="min-h-screen bg-[linear-gradient(135deg,#FEF9C3_0%,#E0F2FE_100%)] px-4 pb-24 pt-10 text-[#172554]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Link
          href="/"
          className="w-fit rounded-full border-2 border-[#172554] bg-white px-4 py-2 text-sm font-bold hard-shadow"
        >
          ← 返回首页
        </Link>

        <article className="rounded-3xl border-4 border-[#172554] bg-white p-6 hard-shadow">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <span className="rounded-full bg-[#1D4ED8] px-3 py-1 text-white">
              {item.date}
            </span>
            {item.publishedAt ? (
              <span>{formatDate(item.publishedAt)}</span>
            ) : null}
            <span>{item.emoji}</span>
          </div>

          <h1 className="mt-4 text-3xl font-black leading-tight">
            {item.title}
          </h1>
          {item.summary ? (
            <p className="mt-3 text-base font-semibold text-[#1e3a8a]">
              {item.summary}
            </p>
          ) : null}

          <div className="mt-6 rounded-2xl border-2 border-[#172554] bg-[#F8FAFC] p-4 text-sm">
            <p className="font-semibold">引用信息</p>
            <p className="mt-2">来源：{item.source || "未标注"}</p>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block font-bold text-[#1D4ED8] underline"
              >
                原文链接
              </a>
            ) : null}
          </div>

          <div className="markdown mt-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {item.contentMd ||
                item.contentHtml ||
                item.summary ||
                "暂无详情内容。"}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}
