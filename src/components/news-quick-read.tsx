"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { NewsArticle, type NewsDetailData } from "@/components/news-article";
import { SkeletonNewsArticle } from "@/components/skeleton-news-article";

type NewsQuickReadProps = {
    item: NewsDetailData | null;
    isOpen: boolean;
    isLoading?: boolean;
    newsId?: number | null;
    onClose: () => void;
};

export function NewsQuickRead({
    item,
    isOpen,
    isLoading = false,
    newsId,
    onClose,
}: NewsQuickReadProps) {
    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-stretch justify-center bg-black/30 transition-opacity duration-300 lg:justify-end ${
                isOpen
                    ? "visible opacity-100"
                    : "invisible opacity-0 pointer-events-none"
            }`}
            onClick={onClose}
        >
            <div
                className={`flex h-[100dvh] w-full transform flex-col overflow-hidden rounded-none yuzu-shell shadow-2xl transition-transform duration-300 lg:h-full lg:max-w-4xl ${
                    isOpen
                        ? "translate-y-0 lg:translate-x-0"
                        : "translate-y-full lg:translate-y-0 lg:translate-x-full"
                }`}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex justify-center pt-2 lg:hidden">
                    <span className="h-1.5 w-12 rounded-full bg-[rgba(31,42,68,0.2)]" />
                </div>

                <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-white/90 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <h2 className="font-display text-base font-black text-ink sm:text-lg">
                            资讯详情
                        </h2>
                        {newsId ? (
                            <Link
                                href={`/news/${newsId}`}
                                className="inline-flex items-center gap-1 rounded-full soft-pill px-2.5 py-1 text-xs font-semibold text-ink hover:bg-[var(--yuzu-sky)]"
                            >
                                打开详情页
                                <ArrowUpRight className="h-3 w-3" />
                            </Link>
                        ) : null}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-[rgba(31,42,68,0.1)] p-2 text-ink hover:bg-[rgba(31,42,68,0.2)]"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-6">
                    {isLoading ? (
                        <SkeletonNewsArticle />
                    ) : item ? (
                        <NewsArticle item={item} />
                    ) : (
                        <div className="flex h-40 items-center justify-center">
                            <span className="text-sm font-semibold text-ink">
                                暂无内容
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
