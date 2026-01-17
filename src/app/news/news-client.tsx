"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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

export function NewsClient({ items }: NewsClientProps) {
  const [keyword, setKeyword] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [rangeFilter, setRangeFilter] = useState("7d");

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
      const haystack = [
        item.title,
        item.summary,
        item.source,
        item.url,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(lowerKeyword);
    });
  }, [items, keyword, rangeFilter, sourceFilter]);

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
      <div className="rounded-3xl border-4 border-[#172554] bg-white p-4 hard-shadow">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-xs font-semibold tracking-[0.2em] text-[#172554]">
              搜索
            </label>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="按标题 / 摘要 / 来源检索"
              className="rounded-2xl border-2 border-[#172554] px-4 py-2 text-sm font-semibold text-[#172554] placeholder:text-[#1e3a8a]/60 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-end">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#172554]">
                来源
              </span>
              <select
                value={sourceFilter}
                onChange={(event) => setSourceFilter(event.target.value)}
                className="rounded-2xl border-2 border-[#172554] px-3 py-2 text-sm font-semibold text-[#172554] focus:outline-none"
              >
                <option value="all">全部来源</option>
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#172554]">
                时间
              </span>
              <select
                value={rangeFilter}
                onChange={(event) => setRangeFilter(event.target.value)}
                className="rounded-2xl border-2 border-[#172554] px-3 py-2 text-sm font-semibold text-[#172554] focus:outline-none"
              >
                <option value="7d">最近 7 天</option>
                <option value="30d">最近 30 天</option>
                <option value="all">全部时间</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {grouped.length ? (
        grouped.map(([label, groupItems]) => (
          <div
            key={label}
            className="rounded-3xl border-4 border-[#172554] bg-white p-5 hard-shadow"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-[#1D4ED8] px-3 py-1 text-xs font-bold text-white">
                {label}
              </span>
              <span className="text-xs font-semibold text-[#172554]">
                共 {groupItems.length} 条
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {groupItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border-2 border-[#172554] bg-[#F8FAFC] p-4"
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#172554]">
                    <span>{item.emoji}</span>
                    <span>{item.source}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-black text-[#172554]">
                    {item.title}
                  </h2>
                  {item.summary ? (
                    <p className="mt-2 text-sm font-semibold text-[#1e3a8a]">
                      {item.summary}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#172554]">
                    <span>{getDateLabel(item)}</span>
                    <Link
                      href={`/news/${item.id}`}
                      className="rounded-full border-2 border-[#172554] bg-[#FDE047] px-3 py-1 font-bold"
                    >
                      阅读详情 →
                    </Link>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#1D4ED8] underline"
                      >
                        原文链接
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-3xl border-4 border-[#172554] bg-white p-5 text-sm font-semibold text-[#1e3a8a] hard-shadow">
          没有匹配的资讯，试试调整关键词或筛选条件。
        </div>
      )}
    </div>
  );
}
