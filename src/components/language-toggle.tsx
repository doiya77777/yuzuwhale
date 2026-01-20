"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/components/language-provider";

export function LanguageToggle({ className }: { className?: string }) {
    const { lang, setLang, t } = useI18n();
    const isZh = lang === "zh";

    return (
        <button
            type="button"
            onClick={() => setLang(isZh ? "en" : "zh")}
            className={cn(
                "rounded-full border-2 border-[#172554] bg-white px-3 py-2 text-xs font-black text-[#172554] hard-shadow transition hover:-translate-y-1",
                className,
            )}
            aria-label="Toggle language"
        >
            {isZh ? t("lang.en") : t("lang.zh")}
        </button>
    );
}
