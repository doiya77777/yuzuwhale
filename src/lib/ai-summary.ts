import { unstable_cache } from "next/cache";

type AIConfig = {
    url: string;
    key: string;
    model: string;
};

export async function generateDailySummary(
    newsItems: { title: string; summary?: string; source?: string }[],
): Promise<string | null> {
    const config: AIConfig = {
        url: process.env.AI_API_URL || "https://api.openai.com/v1",
        key: process.env.AI_API_KEY || "",
        model: process.env.AI_MODEL_NAME || "gpt-3.5-turbo",
    };

    if (!config.key) {
        console.warn("Missing AI_API_KEY, skipping summary generation.");
        return null;
    }

    if (newsItems.length === 0) {
        return null;
    }

    // Simple prompt construction
    const newsContext = newsItems
        .slice(0, 10) // Limit context
        .map(
            (item, i) =>
                `${i + 1}. [${item.source || "Unknown"}] ${item.title}: ${item.summary || ""}`,
        )
        .join("\n");

    const prompt = `
You are a tech trend analyst (Yuzu).
Summarize the following latest AI news into a "Daily Briefing" (Daily Focus).
Style: Energetic, concise, tech-savvy, using emoji.
Keep it under 150 words (Chinese).
Focus on the most impactful updates.

News:
${newsContext}
`;

    try {
        const response = await fetch(`${config.url}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${config.key}`,
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful AI news assistant.",
                    },
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 300,
            }),
            next: { revalidate: 3600 }, // Cache response for 1 hour to avoid spamming API
        });

        if (!response.ok) {
            console.error("AI API Error:", await response.text());
            return null;
        }

        const json = await response.json();
        return json.choices?.[0]?.message?.content || null;
    } catch (error) {
        console.error("AI Summary Generation Failed:", error);
        return null;
    }
}

// Cached version to be called from the page
export const getCachedDailySummary = unstable_cache(
    async (newsItems) => generateDailySummary(newsItems),
    ["daily-summary"],
    { revalidate: 3600, tags: ["summary"] },
);
