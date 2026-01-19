"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function NewsNav({ title }: { title: string }) {
    const router = useRouter();

    return (
        <nav className="sticky top-4 z-50 mx-auto mb-6 flex w-full max-w-3xl items-center gap-4 rounded-full soft-pill bg-white/90 px-4 py-3 backdrop-blur">
            <button
                onClick={() => router.back()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--yuzu-ink)] text-white transition-transform active:scale-95 hover:brightness-95"
                aria-label="Back"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 truncate font-semibold text-ink">
                {title}
            </div>
        </nav>
    );
}
