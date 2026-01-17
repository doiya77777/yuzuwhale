import Parser from "rss-parser";
import TurndownService from "turndown";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const feeds = [
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml",
    emoji: "🧠",
  },
  {
    name: "Anthropic News",
    url: "https://www.anthropic.com/news/rss.xml",
    emoji: "⚡",
  },
  {
    name: "Google AI Blog",
    url: "https://ai.googleblog.com/feeds/posts/default?alt=rss",
    emoji: "✨",
  },
  {
    name: "Meta AI",
    url: "https://ai.meta.com/blog/rss/",
    emoji: "🧪",
  },
];

const parser = new Parser({
  customFields: {
    item: [
      ["content:encoded", "contentEncoded"],
      ["content", "content"],
    ],
  },
});

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

turndown.addRule("stripImages", {
  filter: "img",
  replacement: () => "",
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function stripHtml(input = "") {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSummary(entry, fallback = "") {
  const source =
    entry.contentSnippet || entry.summary || entry.content || fallback;
  return stripHtml(source).slice(0, 180);
}

function formatDate(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });
}

const items = [];
for (const feed of feeds) {
  try {
    const data = await parser.parseURL(feed.url);
    for (const entry of data.items.slice(0, 6)) {
      if (!entry.link) {
        continue;
      }
      const publishedAt = entry.isoDate || entry.pubDate || null;
      const contentHtml =
        entry.contentEncoded || entry.content || entry.summary || "";
      const contentMd = contentHtml ? turndown.turndown(contentHtml) : "";
      const title = entry.title || "";
      const summary = buildSummary(entry, title);

      items.push({
        date: formatDate(publishedAt),
        emoji: feed.emoji,
        title,
        summary,
        content: summary,
        source: feed.name,
        url: entry.link,
        content_md: contentMd,
        content_html: contentHtml,
        published_at: publishedAt,
      });
    }
  } catch (error) {
    console.error(`Failed to parse ${feed.url}`, error);
  }
}

const { error } = await supabase
  .from("news")
  .upsert(items, { onConflict: "url" });

if (error) {
  console.error("Supabase upsert failed", error);
  process.exit(1);
}

console.log(`Upserted ${items.length} items.`);
