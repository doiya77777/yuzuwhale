"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { DEFAULT_LANG, type Lang, translate } from "@/lib/i18n";

type LanguageContextValue = {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "yuzu-lang";

function detectLang(): Lang {
    if (typeof navigator === "undefined") {
        return DEFAULT_LANG;
    }
    const locale = navigator.language.toLowerCase();
    return locale.startsWith("en") ? "en" : "zh";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
        if (stored === "en" || stored === "zh") {
            setLangState(stored);
        } else {
            setLangState(detectLang());
        }
    }, []);

    useEffect(() => {
        document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
        window.localStorage.setItem(STORAGE_KEY, lang);
    }, [lang]);

    const setLang = useCallback((next: Lang) => {
        setLangState(next);
    }, []);

    const value = useMemo<LanguageContextValue>(() => {
        return {
            lang,
            setLang,
            t: (key: string) => translate(lang, key),
        };
    }, [lang, setLang]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useI18n() {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error("useI18n must be used within LanguageProvider");
    }
    return ctx;
}
