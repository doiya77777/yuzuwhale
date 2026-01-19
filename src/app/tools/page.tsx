import { getTools } from "@/lib/supabase/tools";
import { ToolCard } from "@/components/tools/tool-card";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 60; // Revalidate every minute

export default async function ToolsPage() {
  const tools = await getTools();

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#FEF9C3_0%,#E0F2FE_100%)]">
        <div className="pointer-events-none absolute inset-0 yuzu-bg opacity-60 fixed" />
        
        <header className="relative z-10 mx-auto max-w-6xl px-4 pt-10 pb-6">
             <Link 
                href="/"
                className="inline-flex items-center gap-2 rounded-full border-4 border-[#172554] bg-white px-4 py-2 text-sm font-black text-[#172554] hard-shadow hover:-translate-y-1 transition-transform mb-8"
            >
                <ArrowLeft className="h-4 w-4" />
                返回首页
            </Link>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-xl border-2 border-[#172554] bg-[#FDE047] px-3 py-1 text-xs font-black text-[#172554]">
                        <Sparkles className="h-3 w-3" />
                        Yuzu Lab
                    </div>
                    <h1 className="text-5xl font-black text-[#172554] uppercase leading-none sm:text-6xl">
                        Toolbox
                    </h1>
                    <p className="max-w-xl text-lg font-bold text-[#172554]">
                        精选 AI 工具、Agent 框架与开发神器。不仅仅是列表，更是深度测评与避坑指南。
                    </p>
                </div>
                
                {/* Stats or Filter placeholder */}
                <div className="hidden md:block rounded-2xl border-4 border-[#172554] bg-white p-4 text-center hard-shadow rotate-2">
                    <div className="text-3xl font-black text-[#172554]">{tools.length}</div>
                    <div className="text-xs font-bold text-[#1e3a8a]">收录工具</div>
                </div>
            </div>
        </header>

        <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                ))}
            </div>
            
            {tools.length === 0 && (
                <div className="rounded-3xl border-4 border-[#172554] bg-white p-12 text-center hard-shadow">
                    <p className="text-xl font-bold text-[#172554]">暂无工具收录，实验室正在装修中...</p>
                </div>
            )}
        </main>
    </div>
  );
}
