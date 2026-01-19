"use client";

import { useEffect, useState, useTransition } from "react";
import { getNewsDetail, updateNewsItem } from "./actions";
import { PopMarkdown } from "@/components/pop-markdown";
import { Loader2, Save, ExternalLink } from "lucide-react";

type NewsEditPanelProps = {
    newsId: number | null;
    onClose?: () => void;
};

type NewsData = {
    id: number;
    title: string;
    summary: string;
    source: string;
    url: string;
    emoji: string;
    date: string;
    contentMd: string;
};

export function NewsEditPanel({ newsId, onClose }: NewsEditPanelProps) {
    const [data, setData] = useState<NewsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!newsId) {
            setData(null);
            return;
        }

        setLoading(true);
        setMessage("");
        getNewsDetail(newsId)
            .then((res) => {
                if (res) {
                    // Normalize nulls to strings for inputs
                    setData({
                        id: res.id,
                        title: res.title || "",
                        summary: res.summary || "",
                        source: res.source || "",
                        url: res.url || "",
                        emoji: res.emoji || "",
                        date: res.date || "",
                        contentMd: res.contentMd || "",
                    });
                }
            })
            .finally(() => setLoading(false));
    }, [newsId]);

    const handleChange = (field: keyof NewsData, value: string) => {
        if (!data) return;
        setData({ ...data, [field]: value });
    };

    const handleSubmit = () => {
        if (!data) return;
        setMessage("");
        startTransition(async () => {
            const res = await updateNewsItem(data.id, data);
            if (res.error) {
                setMessage(`Error: ${res.error}`);
            } else {
                setMessage("Saved successfully!");
                // Auto hide message after 3s
                setTimeout(() => setMessage(""), 3000);
            }
        });
    };

    if (!newsId) {
        return (
            <div className="flex h-full items-center justify-center rounded-3xl soft-card p-6 text-center text-ink-muted">
                <p>Select an item to view details</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center rounded-3xl soft-card p-6">
                <Loader2 className="h-8 w-8 animate-spin text-ink" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex h-full items-center justify-center rounded-3xl soft-card p-6">
                <p>Failed to load data.</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col gap-4 rounded-3xl soft-card p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-black text-ink">
                    编辑详情
                </h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="md:hidden rounded-full soft-pill px-3 py-1 text-xs font-semibold text-ink"
                    >
                        Close
                    </button>
                )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Title & Emoji */}
                <div className="flex gap-2">
                    <div className="w-16">
                        <label className="mb-1 block text-xs font-semibold text-ink">
                            Emoji
                        </label>
                        <input
                            className="w-full rounded-lg border border-[var(--border)] bg-white/70 p-2 text-center text-lg focus:outline-none"
                            value={data.emoji}
                            onChange={(e) =>
                                handleChange("emoji", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex-1">
                        <label className="mb-1 block text-xs font-semibold text-ink">
                            Title
                        </label>
                        <input
                            className="w-full rounded-lg border border-[var(--border)] bg-white/70 p-2 font-semibold text-ink focus:outline-none"
                            value={data.title}
                            onChange={(e) =>
                                handleChange("title", e.target.value)
                            }
                        />
                    </div>
                </div>

                {/* Date & Source */}
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="mb-1 block text-xs font-semibold text-ink">
                            Date
                        </label>
                        <input
                            type="date"
                            className="w-full rounded-lg border border-[var(--border)] bg-white/70 p-2 text-sm focus:outline-none"
                            value={data.date}
                            onChange={(e) =>
                                handleChange("date", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex-1">
                        <label className="mb-1 block text-xs font-semibold text-ink">
                            Source
                        </label>
                        <input
                            className="w-full rounded-lg border border-[var(--border)] bg-white/70 p-2 text-sm focus:outline-none"
                            value={data.source}
                            onChange={(e) =>
                                handleChange("source", e.target.value)
                            }
                        />
                    </div>
                </div>

                {/* URL */}
                <div>
                    <label className="mb-1 block text-xs font-semibold text-ink">
                        Original URL
                        {data.url && (
                            <a
                                href={data.url}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-2 inline-block"
                            >
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                    </label>
                    <input
                        className="w-full rounded-lg border border-[var(--border)] bg-white/70 p-2 text-sm text-[#3b6dd8] underline focus:outline-none"
                        value={data.url}
                        onChange={(e) => handleChange("url", e.target.value)}
                    />
                </div>

                {/* Summary */}
                <div>
                    <label className="mb-1 block text-xs font-semibold text-ink">
                        Summary
                    </label>
                    <textarea
                        className="w-full rounded-lg border border-[var(--border)] bg-white/70 p-2 text-sm font-medium text-ink-soft focus:outline-none"
                        rows={3}
                        value={data.summary}
                        onChange={(e) =>
                            handleChange("summary", e.target.value)
                        }
                    />
                </div>

                {/* Markdown Content */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-ink">
                        Content (Markdown)
                    </label>
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <textarea
                            className="h-64 w-full rounded-lg border border-[var(--border)] bg-white/70 p-2 text-xs font-mono focus:outline-none xl:h-96"
                            value={data.contentMd}
                            onChange={(e) =>
                                handleChange("contentMd", e.target.value)
                            }
                        />
                        <div className="h-64 w-full overflow-y-auto rounded-lg border border-[var(--border)] bg-white p-2 xl:h-96">
                            <p className="mb-2 text-xs font-bold text-gray-400">
                                Preview:
                            </p>
                            <PopMarkdown
                                content={data.contentMd || "No content"}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <span className="text-sm font-semibold text-green-600">
                        {message}
                    </span>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-full bg-[var(--yuzu-lemon)] px-6 py-2 font-semibold text-ink shadow-[0_14px_30px_rgba(31,42,68,0.18)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(31,42,68,0.22)] hover:brightness-95 active:translate-y-0 active:brightness-90 disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
