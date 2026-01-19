import { Loader2 } from "lucide-react";

export function SkeletonNewsArticle() {
    return (
        <article className="rounded-3xl soft-card p-6 animate-pulse">
            {/* Date/Tags row */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="h-7 w-20 rounded-full bg-[var(--yuzu-sky)]" />
                <div className="h-6 w-24 rounded bg-[var(--yuzu-sky)]" />
            </div>

            {/* Title */}
            <div className="mt-4 space-y-2">
                <div className="h-8 w-3/4 rounded bg-[rgba(31,42,68,0.15)]" />
                <div className="h-8 w-1/2 rounded bg-[rgba(31,42,68,0.15)]" />
            </div>

            {/* Summary */}
            <div className="mt-4 space-y-2">
                <div className="h-4 w-full rounded bg-[var(--yuzu-sky)]" />
                <div className="h-4 w-5/6 rounded bg-[var(--yuzu-sky)]" />
            </div>

            {/* Source Box */}
            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--yuzu-wash)] p-4">
                <div className="h-4 w-16 rounded bg-[var(--yuzu-sky)] mb-2" />
                <div className="h-4 w-32 rounded bg-[var(--yuzu-sky)] mb-2" />
                <div className="h-4 w-24 rounded bg-[var(--yuzu-sky)]" />
            </div>

            {/* Content */}
            <div className="mt-6 space-y-4">
                <div className="h-4 w-full rounded bg-[var(--yuzu-sky)]" />
                <div className="h-4 w-full rounded bg-[var(--yuzu-sky)]" />
                <div className="h-4 w-5/6 rounded bg-[var(--yuzu-sky)]" />
                <div className="h-32 w-full rounded-xl border border-[var(--border)] bg-[var(--yuzu-sky)]" />
                <div className="h-4 w-full rounded bg-[var(--yuzu-sky)]" />
                <div className="h-4 w-4/5 rounded bg-[var(--yuzu-sky)]" />
            </div>

            <div className="mt-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-ink-muted" />
            </div>
        </article>
    );
}
