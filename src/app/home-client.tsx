"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Github,
    Globe,
    Loader2,
    Sparkles,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import type { SiteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";
import { PopMarkdown } from "@/components/pop-markdown";
import { getNewsDetail } from "@/app/news/actions";
import type { NewsDetailData } from "@/components/news-article";
import { NewsQuickRead } from "@/components/news-quick-read";

// Custom X Icon (SVG)
function XIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

const socials = {
    Twitter: XIcon,
    GitHub: Github, // Kept in map but will filter out key
    Xiaohongshu: Sparkles,
};

const btnStyle =
    "px-6 py-3 rounded-full bg-white/90 text-ink font-semibold border border-[var(--border)] shadow-[0_12px_24px_rgba(31,42,68,0.12)] hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(31,42,68,0.16)] transition-all";

type HomeClientProps = {
    data: SiteConfig;
    dailySummary?: string | null;
};

function formatDateLabel(value?: string) {
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

function getNewsLabel(item: SiteConfig["news"][number]) {
    return item.date || formatDateLabel(item.publishedAt);
}

export function HomeClient({ data, dailySummary }: HomeClientProps) {
    const brandName = data.profile.name?.trim() || "Yuzu";
    const shortBrand = brandName.replace(/\s+/g, " ").trim() || brandName;
    const [activeId, setActiveId] = useState<number | null>(null);
    const activeItem = data.gallery.find((item) => item.id === activeId);
    const showGallery =
        (data.profile.showGallery ?? false) && data.gallery.length > 0;
    const [activeNews, setActiveNews] = useState<NewsDetailData | null>(null);
    const [openNewsId, setOpenNewsId] = useState<number | null>(null);
    const [loadingNewsId, setLoadingNewsId] = useState<number | null>(null);
    const openNewsIdRef = useRef<number | null>(null);

    // Gallery Navigation Logic
    const activeGalleryIndex = useMemo(
        () =>
            activeId
                ? data.gallery.findIndex((item) => item.id === activeId)
                : -1,
        [activeId, data.gallery],
    );

    const hasPrev = activeGalleryIndex > 0;
    const hasNext = activeGalleryIndex < data.gallery.length - 1;

    const handlePrevGallery = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();
            if (hasPrev) {
                setActiveId(data.gallery[activeGalleryIndex - 1].id);
            }
        },
        [hasPrev, activeGalleryIndex, data.gallery],
    );

    const handleNextGallery = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();
            if (hasNext) {
                setActiveId(data.gallery[activeGalleryIndex + 1].id);
            }
        },
        [hasNext, activeGalleryIndex, data.gallery],
    );

    // Keyboard navigation for gallery
    useEffect(() => {
        if (!activeId) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                handleNextGallery();
            } else if (e.key === "ArrowLeft") {
                handlePrevGallery();
            } else if (e.key === "Escape") {
                setActiveId(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeId, handleNextGallery, handlePrevGallery]);

    // Filter out GitHub from socials and ensure Twitter uses XIcon
    const displaySocials = useMemo(() => {
        return data.profile.socials.filter((s) => s.platform !== "GitHub");
    }, [data.profile.socials]);

    const groupedNews = useMemo(() => {
        const groups = new Map<
            string,
            { date: string; items: SiteConfig["news"] }
        >();
        data.news.forEach((item) => {
            const label = getNewsLabel(item) || "未标注日期";
            if (!groups.has(label)) {
                groups.set(label, { date: label, items: [] });
            }
            groups.get(label)?.items.push(item);
        });
        return Array.from(groups.values()).slice(0, 3);
    }, [data.news]);

    async function handleNewsClick(e: React.MouseEvent, id: number) {
        e.preventDefault();
        openNewsIdRef.current = id;
        setOpenNewsId(id);
        setActiveNews(null);
        setLoadingNewsId(id);
        try {
            const data = await getNewsDetail(id);
            if (data && openNewsIdRef.current === id) {
                setActiveNews(data);
            }
        } catch (err) {
            console.error("Failed to fetch news detail", err);
        } finally {
            if (openNewsIdRef.current === id) {
                setLoadingNewsId(null);
            }
        }
    }

    function handleCloseNews() {
        openNewsIdRef.current = null;
        setOpenNewsId(null);
        setActiveNews(null);
        setLoadingNewsId(null);
    }

    return (
        <div className="relative min-h-screen overflow-hidden yuzu-shell">
            <div className="pointer-events-none absolute inset-0 yuzu-bg opacity-40" />
            <div className="pointer-events-none absolute -top-32 right-[-6rem] h-72 w-72 rounded-full yuzu-orb blur-3xl opacity-80" />
            <div className="pointer-events-none absolute top-24 left-[-5rem] h-60 w-60 rounded-full yuzu-orb-cool blur-3xl opacity-70" />

            <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-4 pb-6 pt-10 sm:px-6">
                <div className="flex items-center gap-3 rounded-full soft-pill px-4 py-2 text-ink">
                    {data.profile.avatarUrl ? (
                        <Image
                            src={data.profile.avatarUrl}
                            alt="Yuzu avatar"
                            width={28}
                            height={28}
                            className="h-7 w-7 rounded-full border border-[var(--border)]"
                            priority
                        />
                    ) : (
                        <Image
                            src="/yuzu.svg"
                            alt="Yuzu icon"
                            width={28}
                            height={28}
                            className="h-7 w-7"
                            priority
                        />
                    )}
                    <span className="font-display font-black tracking-wide hidden sm:inline">
                        {shortBrand || "Yuzu"}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {displaySocials.map((social) => {
                        const Icon =
                            socials[social.platform as keyof typeof socials] ??
                            Globe;
                        return (
                            <a
                                key={social.platform}
                                href={social.url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full soft-pill p-2 text-ink-soft transition hover:-translate-y-1"
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        );
                    })}
                </div>
            </header>

            <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 sm:px-6">
                <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                    <div className="space-y-6 self-center">
                        <div className="space-y-4">
                            <p className="text-sm font-semibold tracking-[0.3em] text-ink-muted">
                                {data.profile.title}
                            </p>
                            <h1 className="font-display text-4xl font-black leading-tight text-ink sm:text-6xl">
                                {shortBrand}
                            </h1>
                            <p className="text-lg font-semibold text-ink-soft sm:text-xl">
                                {data.profile.slogan}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {data.profile.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full soft-pill px-4 py-2 text-sm font-semibold text-ink-soft"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/news"
                                className={`${btnStyle} inline-flex items-center justify-center`}
                            >
                                今日资讯 →
                            </Link>
                            <Link
                                href="/products"
                                className={`${btnStyle} inline-flex items-center justify-center bg-[linear-gradient(135deg,#1f2a44_0%,#3a4761_100%)] text-white`}
                            >
                                产品测评 🧪
                            </Link>
                            <span className="rounded-full soft-pill px-4 py-3 text-sm font-semibold text-ink-soft">
                                更新频率：每日
                            </span>
                        </div>
                    </div>

                    <div className="rounded-3xl soft-card p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl soft-pill bg-[var(--yuzu-wash)]">
                                <span className="text-xl">🤖</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-ink-muted leading-none">
                                    Daily Focus
                                </p>
                                <p className="font-display text-lg font-black text-ink leading-tight">
                                    AI 每日简报
                                </p>
                            </div>
                        </div>

                        {dailySummary ? (
                            <div className="relative overflow-hidden rounded-2xl soft-tint p-4">
                                <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                                    <Sparkles className="h-12 w-12 text-ink-muted" />
                                </div>
                                <div className="max-h-[500px] overflow-y-auto pr-2">
                                    <PopMarkdown content={dailySummary} />
                                </div>
                            </div>
                        ) : (
                            <div className="mt-5 space-y-3 text-sm font-semibold text-ink-soft">
                                <div className="flex items-center justify-between rounded-2xl soft-tint px-4 py-3">
                                    <span>更新频率</span>
                                    <span>每日</span>
                                </div>
                                <div className="flex items-center justify-between rounded-2xl soft-tint px-4 py-3">
                                    <span>内容类型</span>
                                    <span>资讯 / Prompt</span>
                                </div>
                                <div className="flex items-center justify-between rounded-2xl soft-pill px-4 py-3">
                                    <span>合作邮箱</span>
                                    <span>{data.profile.email || "-"}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Product Lab Section */}
                {data.products && data.products.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🧪</span>
                            <h2 className="font-display text-2xl font-black text-ink">
                                Product Lab / 产品测评
                            </h2>
                            <Link
                                href="/products"
                                className="ml-auto rounded-full soft-pill px-3 py-1 text-xs font-semibold text-ink-soft"
                            >
                                查看全部 →
                            </Link>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {data.products.slice(0, 3).map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="group relative flex flex-col rounded-3xl soft-card p-5 transition-all hover:-translate-y-1"
                                >
                                    <div className="flex items-start justify-between">
                                        <span className="rounded-full soft-pill bg-[var(--yuzu-wash)] px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
                                            {product.category}
                                        </span>
                                        <span className="text-xs font-semibold text-ink-muted">
                                            ⭐️ {product.ratingOverall}
                                        </span>
                                    </div>
                                    <h3 className="mt-3 font-display text-xl font-black text-ink group-hover:text-ink-soft">
                                        {product.title}
                                    </h3>
                                    <p className="mt-1 text-sm font-medium text-ink-muted line-clamp-2 italic">
                                        {product.subtitle}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-1">
                                        {product.tags.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] font-semibold text-ink-muted tracking-tight"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <section
                    className={cn(
                        "grid gap-8",
                        showGallery
                            ? "lg:grid-cols-[1.05fr_0.95fr]"
                            : "lg:grid-cols-1",
                    )}
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📰</span>
                            <h2 className="font-display text-2xl font-black text-ink">
                                News / 情报站
                            </h2>
                            <Link
                                href="/news"
                                className="ml-auto rounded-full soft-pill px-3 py-1 text-xs font-semibold text-ink-soft"
                            >
                                查看全部 →
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {groupedNews.length ? (
                                groupedNews.map((group) => (
                                    <div
                                        key={group.date}
                                        className="rounded-3xl soft-card p-5"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <span className="rounded-full bg-[var(--yuzu-ink)] px-3 py-1 text-xs font-semibold text-white">
                                                {group.date}
                                            </span>
                                            <span className="text-xs font-medium text-ink-muted">
                                                共 {group.items.length} 条
                                            </span>
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            {group.items
                                                .slice(0, 3)
                                                .map((item) => (
                                                    <motion.div
                                                        key={item.id}
                                                        whileHover={{
                                                            rotate: -1,
                                                            x: 4,
                                                            y: -4,
                                                        }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 240,
                                                            damping: 15,
                                                        }}
                                                        className="rounded-2xl soft-tint p-4"
                                                    >
                                                        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-ink-muted">
                                                            <span>
                                                                {item.emoji}
                                                            </span>
                                                            <span>
                                                                {item.source}
                                                            </span>
                                                        </div>
                                                        <Link
                                                            href={`/news/${item.id}`}
                                                            onClick={(event) =>
                                                                handleNewsClick(
                                                                    event,
                                                                    item.id,
                                                                )
                                                            }
                                                            className="mt-2 block font-display text-base font-black text-ink hover:text-ink-soft transition-colors"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                        <div className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold text-ink-muted">
                                                            <span>
                                                                {getNewsLabel(
                                                                    item,
                                                                )}
                                                            </span>
                                                            <Link
                                                                href={`/news/${item.id}`}
                                                                onClick={(
                                                                    event,
                                                                ) =>
                                                                    handleNewsClick(
                                                                        event,
                                                                        item.id,
                                                                    )
                                                                }
                                                                className="rounded-full bg-[var(--yuzu-ink)] px-3 py-1 font-semibold text-white"
                                                            >
                                                                {loadingNewsId ===
                                                                item.id ? (
                                                                    <span className="inline-flex items-center gap-1">
                                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                                        加载中...
                                                                    </span>
                                                                ) : (
                                                                    "查看详情 →"
                                                                )}
                                                            </Link>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-3xl soft-card p-5 text-sm font-semibold text-ink-muted">
                                    暂无资讯，请先运行 RSS 同步脚本。
                                </div>
                            )}
                        </div>
                    </div>

                    {showGallery ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🎨</span>
                                <h2 className="font-display text-2xl font-black text-ink">
                                    Gallery / 作品集
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {data.gallery.map((item) => (
                                    <button
                                        type="button"
                                        key={item.id}
                                        onClick={() => setActiveId(item.id)}
                                        className="relative overflow-hidden rounded-3xl soft-card p-4 text-left"
                                    >
                                        <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-[var(--border)]">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.title}
                                                fill
                                                sizes="(min-width: 1024px) 28vw, 45vw"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-sm font-black text-ink">
                                                {item.title}
                                            </span>
                                            <span className="rounded-full bg-[var(--yuzu-ink)] px-2 py-1 text-xs font-semibold text-white">
                                                {item.tag}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs font-semibold text-ink-muted">
                                            {item.prompt}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </section>

                <footer className="rounded-3xl soft-card p-6 text-ink-muted">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-ink">
                                商务合作
                            </p>
                            <p className="text-sm">{data.profile.email}</p>
                        </div>
                        <div className="text-xs font-medium">
                            © 2025 {shortBrand}. All rights reserved.
                        </div>
                    </div>
                </footer>
            </main>

            <AnimatePresence>
                {activeItem ? (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2a44]/70 p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveId(null)}
                    >
                        <motion.div
                            className="relative w-full max-w-3xl overflow-hidden rounded-3xl soft-card"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 240,
                                damping: 18,
                            }}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="relative h-[360px] w-full bg-black/5">
                                <Image
                                    src={activeItem.imageUrl}
                                    alt={activeItem.title}
                                    fill
                                    sizes="(min-width: 1024px) 60vw, 90vw"
                                    className="object-contain"
                                />

                                {/* Navigation Buttons */}
                                {hasPrev && (
                                    <button
                                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full soft-pill bg-white p-2 text-ink-soft shadow-md hover:bg-[var(--yuzu-ink)] hover:text-white transition-colors"
                                        onClick={handlePrevGallery}
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                )}
                                {hasNext && (
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full soft-pill bg-white p-2 text-ink-soft shadow-md hover:bg-[var(--yuzu-ink)] hover:text-white transition-colors"
                                        onClick={handleNextGallery}
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2 p-6 text-ink">
                                <h3 className="font-display text-xl font-black">
                                    {activeItem.title}
                                </h3>
                                <p className="text-sm font-medium text-ink-muted">
                                    {activeItem.prompt}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <NewsQuickRead
                item={activeNews}
                isOpen={openNewsId !== null}
                isLoading={loadingNewsId !== null}
                newsId={openNewsId}
                onClose={handleCloseNews}
            />
        </div>
    );
}
