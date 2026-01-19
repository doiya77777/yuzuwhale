import { getProducts } from "@/lib/supabase/tools";
import { ProductCard } from "@/components/products/product-card";
import { Sparkles, ArrowLeft, FlaskConical } from "lucide-react";
import Link from "next/link";

export const revalidate = 60; // Revalidate every minute

export default async function ProductsPage() {
  const products = await getProducts();

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
                        <FlaskConical className="h-3 w-3" />
                        Product Lab
                    </div>
                    <h1 className="text-5xl font-black text-[#172554] uppercase leading-none sm:text-6xl">
                        Yuzu Picks
                    </h1>
                    <p className="max-w-xl text-lg font-bold text-[#172554]">
                        沉浸式体验与深度解析。从交互细节到技术架构，带你以开发者的视角，看懂每一个好产品。
                    </p>
                </div>
                
                {/* Stats */}
                <div className="hidden md:block rounded-2xl border-4 border-[#172554] bg-white p-4 text-center hard-shadow rotate-2">
                    <div className="text-3xl font-black text-[#172554]">{products.length}</div>
                    <div className="text-xs font-bold text-[#1e3a8a]">已收录产品</div>
                </div>
            </div>

            {/* Intro / Manifesto Block */}
            <div className="mt-12 rounded-3xl border-4 border-[#172554] bg-white p-6 md:p-8 hard-shadow">
                <h2 className="mb-3 text-xl font-black text-[#172554]">
                    这里展示什么？
                </h2>
                <div className="space-y-2 text-sm font-semibold text-[#1e3a8a] md:text-base">
                    <p>
                        这不是一个简单的工具导航站。我会亲自试用每一个产品，从 <span className="bg-[#FDE047] px-1">UX 体验</span>、<span className="bg-[#E0F2FE] px-1">技术实现</span>、<span className="bg-[#F0FDF4] px-1">商业模式</span> 等多个维度进行拆解。
                    </p>
                    <p>
                        无论是改变生产力的 AI Agent，还是设计精妙的独立应用，只要它足够有趣，就会出现在这里。
                    </p>
                </div>
            </div>
        </header>

        <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            
            {products.length === 0 && (
                <div className="rounded-3xl border-4 border-[#172554] bg-white p-12 text-center hard-shadow">
                    <p className="text-xl font-bold text-[#172554]">暂无产品收录，实验室正在装修中...</p>
                </div>
            )}
        </main>
    </div>
  );
}
