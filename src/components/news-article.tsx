import { PopMarkdown } from "@/components/pop-markdown";

export type NewsDetailData = {
    id: number;
    date?: string | null;
    emoji?: string | null;
    title: string;
    summary?: string | null;
    source?: string | null;
    url?: string | null;
    contentMd?: string | null;
    contentHtml?: string | null;
    publishedAt?: string | null;
};

function formatDate(value?: string | null) {
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

export function NewsArticle({ item }: { item: NewsDetailData }) {
    // Prioritize HTML content if available, but PopMarkdown now handles both via rehype-raw
    const content =
        item.contentHtml || item.contentMd || item.summary || "暂无详情内容。";

    return (
        <article className="rounded-3xl soft-card p-6">
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-ink">
                {item.date ? (
                    <span className="rounded-full bg-[var(--yuzu-ink)] px-3 py-1 text-white">
                        {item.date}
                    </span>
                ) : null}
                {item.publishedAt ? (
                    <span>{formatDate(item.publishedAt)}</span>
                ) : null}
                {item.emoji ? <span>{item.emoji}</span> : null}
            </div>

            <h1 className="font-display mt-4 text-3xl font-black leading-tight text-ink">
                {item.title}
            </h1>
            {item.summary ? (
                <p className="mt-3 text-base font-semibold text-ink-soft">
                    {item.summary}
                </p>
            ) : null}

            <div className="mt-6 rounded-2xl soft-tint p-4 text-sm text-ink">
                <p className="font-semibold">引用信息</p>
                <p className="mt-2">来源：{item.source || "未标注"}</p>
                {item.url ? (
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block font-semibold text-[#3b6dd8] underline"
                    >
                        原文链接
                    </a>
                ) : null}
            </div>

            <div className="mt-6">
                <PopMarkdown content={content} />
            </div>
        </article>
    );
}
