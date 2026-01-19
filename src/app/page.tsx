import { HomeClient } from "@/app/home-client";
import { fetchSiteConfig } from "@/lib/supabase/data";
import { getCachedDailySummary } from "@/lib/ai-summary";

export const revalidate = 300;

export default async function Home() {
    const supabaseConfig = await fetchSiteConfig();

    if (!supabaseConfig) {
        return (
            <div className="min-h-screen yuzu-shell px-6 py-16 text-ink">
                <div className="mx-auto max-w-2xl rounded-3xl soft-card p-6 text-center">
                    <h1 className="font-display text-2xl font-black">
                        请先配置 Supabase 数据
                    </h1>
                    <p className="mt-3 text-sm font-medium text-ink-soft">
                        配置完成后，首页会自动从数据库加载资讯和资料。
                    </p>
                </div>
            </div>
        );
    }

    // Try to fetch AI summary in parallel (or just await it since it's cached)
    // We use the top 10 news items for the summary context
    const summary = await getCachedDailySummary(supabaseConfig.news);

    return <HomeClient data={supabaseConfig} dailySummary={summary} />;
}
