"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Search,
    Filter,
    X,
    Calendar,
    ChevronDown,
    Loader2,
} from "lucide-react";
import { getNewsDetail } from "./actions";
import type { NewsDetailData } from "@/components/news-article";
import { NewsQuickRead } from "@/components/news-quick-read";

type NewsListItem = {
    id: number;
    title: string;
    summary?: string | null;
    source?: string | null;
    url?: string | null;
    emoji?: string | null;
    date?: string | null;
    publishedAt?: string | null;
};

type NewsClientProps = {
    initialDate?: string;
    items: NewsListItem[];
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
        month: "short",
        day: "numeric",
    });
}

function getDateLabel(item: NewsListItem) {
    return item.date || formatDate(item.publishedAt) || "未标注日期";
}

function getDateValue(item: NewsListItem) {
    const raw = item.publishedAt || item.date;
    if (!raw) {
        return null;
    }
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }
    return parsed;
}

export function NewsClient({ items, initialDate }: NewsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [keyword, setKeyword] = useState("");
    const [sourceFilter, setSourceFilter] = useState("all");
    const [rangeFilter, setRangeFilter] = useState("7d");
    const [dateFilter, setDateFilter] = useState(initialDate || "");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Quick Read Panel State
    const [activeNews, setActiveNews] = useState<NewsDetailData | null>(null);
    const [openId, setOpenId] = useState<number | null>(null);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const openIdRef = useRef<number | null>(null);

    useEffect(() => {
        setDateFilter(initialDate || "");
        if (initialDate) {
            setRangeFilter("all");
        }
    }, [initialDate]);

    async function handleNewsClick(e: React.MouseEvent, id: number) {
        e.preventDefault();
        openIdRef.current = id;
        setOpenId(id);
        setActiveNews(null);
        setLoadingId(id);
        try {
            const data = await getNewsDetail(id);
            if (data && openIdRef.current === id) {
                setActiveNews(data);
            }
        } catch (err) {
            console.error("Failed to fetch news detail", err);
        } finally {
            if (openIdRef.current === id) {
                setLoadingId(null);
            }
        }
    }

    function handleClosePanel() {
        openIdRef.current = null;
        setOpenId(null);
        setActiveNews(null);
        setLoadingId(null);
    }

    function updateDateParam(nextDate: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (nextDate) {
            params.set("date", nextDate);
        } else {
            params.delete("date");
        }
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
    }

    const sources = useMemo(() => {
        const unique = new Set<string>();
        items.forEach((item) => {
            if (item.source) {
                unique.add(item.source);
            }
        });
        return Array.from(unique);
    }, [items]);

    const filteredItems = useMemo(() => {
        const now = new Date();
        const rangeDays =
            rangeFilter === "7d" ? 7 : rangeFilter === "30d" ? 30 : null;
        const lowerKeyword = keyword.trim().toLowerCase();

        return items.filter((item) => {
            if (dateFilter) {
                return item.date === dateFilter;
            }

            if (sourceFilter !== "all" && item.source !== sourceFilter) {
                return false;
            }

            if (rangeDays) {
                const date = getDateValue(item);
                if (!date) {
                    return false;
                }
                const diffDays = (now.getTime() - date.getTime()) / 86400000;
                if (diffDays > rangeDays) {
                    return false;
                }
            }

            if (!lowerKeyword) {
                return true;
            }
            const haystack = [item.title, item.summary, item.source, item.url]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return haystack.includes(lowerKeyword);
        });
    }, [dateFilter, items, keyword, rangeFilter, sourceFilter]);

    const grouped = useMemo(() => {
        const groups = new Map<string, NewsListItem[]>();
        filteredItems.forEach((item) => {
            const label = getDateLabel(item);
            if (!groups.has(label)) {
                groups.set(label, []);
            }
            groups.get(label)?.push(item);
        });
        return Array.from(groups.entries());
    }, [filteredItems]);

    return (
        <div className="space-y-6">
            <NewsQuickRead
                item={activeNews}
                isOpen={openId !== null}
                isLoading={loadingId !== null}
                newsId={openId}
                onClose={handleClosePanel}
            />

            {/* Refactored Filter Bar: Compact & Collapsible */}
            <div className="sticky top-4 z-20 rounded-3xl soft-card p-3 transition-all">
                <div className="flex items-center gap-2">
                    {/* Search Input - Always Visible */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
                        <input
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            placeholder="搜索资讯..."
                            className="w-full rounded-xl border border-[var(--border)] bg-white/70 py-2 pl-10 pr-4 text-sm font-semibold text-ink placeholder:text-ink-muted focus:bg-white focus:outline-none"
                        />
                        {keyword && (
                            <button
                                onClick={() => setKeyword("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink hover:bg-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] transition-all md:hidden ${isFilterOpen ? "bg-[var(--yuzu-lemon)] shadow-none translate-y-[2px] translate-x-[2px]" : "bg-white shadow-[2px_2px_0_0_rgba(31,42,68,0.15)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"}`}
                    >
                        <Filter className="h-5 w-5 text-ink" />
                    </button>
                </div>

                {/* Filters Area - Collapsible on Mobile, Flex on Desktop */}
                <div
                    className={`${isFilterOpen ? "flex" : "hidden"} mt-3 flex-col gap-3 border-t border-dashed border-[var(--border)] pt-3 md:flex md:flex-row md:items-center md:border-none md:pt-0`}
                >
                    {/* Quick Range Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-ink md:hidden">
                            时间范围
                        </span>
                        {["7d", "30d", "all"].map((r) => (
                            <button
                                key={r}
                                onClick={() => {
                                    setRangeFilter(r);
                                    setDateFilter("");
                                    updateDateParam("");
                                }}
                                disabled={Boolean(dateFilter)}
                                className={`rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-semibold transition-all ${
                                    rangeFilter === r && !dateFilter
                                        ? "bg-[var(--yuzu-ink)] text-white"
                                        : "bg-white text-ink hover:bg-[var(--yuzu-sky)] disabled:opacity-50"
                                }`}
                            >
                                {r === "7d"
                                    ? "最近7天"
                                    : r === "30d"
                                      ? "最近30天"
                                      : "全部"}
                            </button>
                        ))}
                    </div>

                    <div className="hidden h-6 w-0.5 bg-[var(--border)] md:block mx-1" />

                    {/* Source Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-ink md:hidden">
                            来源
                        </span>
                        <div className="relative w-full md:w-auto">
                            <select
                                value={sourceFilter}
                                onChange={(event) =>
                                    setSourceFilter(event.target.value)
                                }
                                className="w-full appearance-none rounded-lg border border-[var(--border)] bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-ink focus:outline-none md:w-auto"
                            >
                                <option value="all">全部来源</option>
                                {sources.map((source) => (
                                    <option key={source} value={source}>
                                        {source}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-muted pointer-events-none" />
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="flex items-center gap-2 md:ml-auto">
                        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-2 py-1">
                            <Calendar className="h-3.5 w-3.5 text-ink" />
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(event) => {
                                    const next = event.target.value;
                                    setDateFilter(next);
                                    setRangeFilter("all");
                                    updateDateParam(next);
                                }}
                                className="bg-transparent text-xs font-semibold text-ink outline-none"
                            />
                            {dateFilter && (
                                <button
                                    onClick={() => {
                                        setDateFilter("");
                                        updateDateParam("");
                                    }}
                                >
                                    <X className="h-3.5 w-3.5 text-ink hover:text-red-500" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {grouped.length ? (
                grouped.map(([label, groupItems], index) => (
                    <details
                        key={label}
                        open={index < 2}
                        className="group rounded-3xl soft-card p-5"
                    >
                        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="rounded-full bg-[var(--yuzu-ink)] px-3 py-1 text-xs font-semibold text-white">
                                    {label}
                                </span>
                                <span className="text-xs font-semibold text-ink">
                                    共 {groupItems.length} 条
                                </span>
                            </div>
                            <span className="rounded-full soft-pill px-3 py-1 text-xs font-semibold text-ink transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none">
                                <span className="group-open:hidden">展开</span>
                                <span className="hidden group-open:inline">
                                    收起
                                </span>
                            </span>
                        </summary>

                        <div className="mt-4 space-y-4">
                            {groupItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl soft-tint p-4"
                                >
                                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-ink">
                                        <span>{item.emoji}</span>
                                        <span>{item.source}</span>
                                    </div>

                                    {/* Clickable Title */}
                                    <Link
                                        href={`/news/${item.id}`}
                                        onClick={(e) =>
                                            handleNewsClick(e, item.id)
                                        }
                                        className="mt-3 block font-display text-lg font-black text-ink hover:text-ink-soft transition-colors"
                                    >
                                        {item.title}
                                    </Link>

                                    {item.summary ? (
                                        <p className="mt-2 text-sm font-semibold text-ink-soft">
                                            {item.summary}
                                        </p>
                                    ) : null}
                                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-ink">
                                        <span>{getDateLabel(item)}</span>
                                        <Link
                                            href={`/news/${item.id}`}
                                            onClick={(e) =>
                                                handleNewsClick(e, item.id)
                                            }
                                            className="inline-flex items-center gap-1 rounded-full soft-pill bg-[var(--yuzu-lemon)] px-3 py-1 font-semibold hover:brightness-95 disabled:opacity-50"
                                        >
                                            {loadingId === item.id ? (
                                                <>
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    加载中...
                                                </>
                                            ) : (
                                                "阅读详情 →"
                                            )}
                                        </Link>
                                        {item.url ? (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-semibold text-[#3b6dd8] underline"
                                            >
                                                原文链接
                                            </a>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </details>
                ))
            ) : (
                <div className="rounded-3xl soft-card p-5 text-sm font-semibold text-ink-soft">
                    没有匹配的资讯，试试调整关键词或筛选条件。
                </div>
            )}
        </div>
    );
}
