"use client";

import Link from "next/link";
import { NewsClient } from "@/app/news/news-client";
import { useI18n } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";

type NewsListItem = Parameters<typeof NewsClient>[0]["items"];

type NewsPageClientProps = {
    items?: NewsListItem;
    initialDate?: string;
    isConfigured?: boolean;
};

export function NewsPageClient({
    items = [],
    initialDate = "",
    isConfigured = true,
}: NewsPageClientProps) {
    const { t } = useI18n();

    if (!isConfigured) {
        return (
            <div className="relative min-h-screen bg-[linear-gradient(135deg,#FEF9C3_0%,#E0F2FE_100%)] px-6 py-16 text-[#172554]">
                <div className="pointer-events-none absolute inset-0 yuzu-bg opacity-60" />
                <div className="relative mx-auto max-w-2xl rounded-3xl border-4 border-[#172554] bg-white p-6 text-center hard-shadow">
                    <h1 className="text-2xl font-black">
                        {t("setup.news.title")}
                    </h1>
                    <p className="mt-3 text-sm font-semibold text-[#1e3a8a]">
                        {t("setup.news.desc")}
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex rounded-full border-2 border-[#172554] bg-white px-4 py-2 text-sm font-bold hard-shadow"
                        >
                            {t("nav.backHome")}
                        </Link>
                        <LanguageToggle />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[linear-gradient(135deg,#FEF9C3_0%,#E0F2FE_100%)] px-4 pb-24 pt-10 text-[#172554]">
            <div className="pointer-events-none absolute inset-0 yuzu-bg opacity-60" />
            <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold tracking-[0.3em]">
                            AI NEWS
                        </p>
                        <h1 className="text-3xl font-black">
                            {t("news.title")}
                        </h1>
                        {initialDate ? (
                            <p className="mt-2 text-sm font-semibold text-[#1e3a8a]">
                                {t("news.filter.dateLabel")} {initialDate}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="rounded-full border-2 border-[#172554] bg-white px-4 py-2 text-sm font-bold hard-shadow"
                        >
                            {t("nav.backHome")}
                        </Link>
                        <LanguageToggle />
                    </div>
                </div>

                <NewsClient items={items} initialDate={initialDate} />
            </div>
        </div>
    );
}
