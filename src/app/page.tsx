import { siteConfig } from "@/data/site-config";
import { HomeClient } from "@/app/home-client";
import { fetchSiteConfig } from "@/lib/supabase/data";

export default async function Home() {
  const supabaseConfig = await fetchSiteConfig();

  return <HomeClient data={supabaseConfig ?? siteConfig} />;
}
