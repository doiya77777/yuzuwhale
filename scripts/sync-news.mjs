import Parser from "rss-parser";
import TurndownService from "turndown";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL =
  process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const RSS_ITEMS_PER_FEED = Number(process.env.RSS_ITEMS_PER_FEED || "6");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY (AI summary is required).");
  process.exit(1);
}

const defaultFeeds = [
  {
    name: "OpenAI Blog",
    url: "https://openai.com/news/rss.xml",
    emoji: "🧠",
  },
  {
    name: "Anthropic News",
    url: "https://www.anthropic.com/news/rss",
    emoji: "⚡",
  },
  {
    name: "DeepSeek News",
    url: "https://blog.deepseek.com/feed.xml",
    emoji: "🐋",
  },
];

const feeds = process.env.RSS_SOURCES
  ? JSON.parse(process.env.RSS_SOURCES)
  : defaultFeeds;

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

async function summarizeWithAI({ title, text, source, url }) {
  try {
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "你是中文 AI 资讯编辑。请输出 JSON：{summary: string, bullets: string[]}，summary 不超过 120 字，bullets 给 3 条要点。",
          },
          {
            role: "user",
            content: `标题：${title}\n来源：${source}\n正文：${text}\n原文：${url}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (!content) {
      return null;
    }

    const parsed = JSON.parse(content);
    const summary = String(parsed.summary || "").slice(0, 120);
    const bullets = Array.isArray(parsed.bullets)
      ? parsed.bullets.slice(0, 3)
      : [];
    if (!summary || bullets.length === 0) {
      return null;
    }
    const contentMd = `## 摘要\n${summary}\n\n## 要点\n${bullets
      .map((item) => `- ${item}`)
      .join("\n")}\n\n## 引用\n- 来源：${source}\n- 原文：${url}`;

    return { summary, contentMd };
  } catch (error) {
    console.error("OpenAI summary failed", error);
    return null;
  }
}

const items = [];
for (const feed of feeds) {
  try {
    const data = await parser.parseURL(feed.url);
    for (const entry of data.items.slice(0, RSS_ITEMS_PER_FEED)) {
      if (!entry.link) {
        continue;
      }
      const publishedAt = entry.isoDate || entry.pubDate || null;
      const contentHtml =
        entry.contentEncoded || entry.content || entry.summary || "";
      const contentMdRaw = contentHtml ? turndown.turndown(contentHtml) : "";
      const title = entry.title || "";
      const text = stripHtml(contentMdRaw).slice(0, 2000);
      const aiResult = await summarizeWithAI({
        title,
        text,
        source: feed.name,
        url: entry.link,
      });
      if (!aiResult) {
        console.error(`AI summary failed for ${entry.link}`);
        continue;
      }

      items.push({
        date: formatDate(publishedAt),
        emoji: feed.emoji,
        title,
        summary: aiResult.summary,
        content: aiResult.summary,
        source: feed.name,
        url: entry.link,
        content_md: aiResult.contentMd,
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
