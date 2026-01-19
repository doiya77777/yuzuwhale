import { getProducts } from "@/lib/supabase/tools";
import { ProductCard } from "@/components/products/product-card";
import { ArrowLeft, FlaskConical } from "lucide-react";
import Link from "next/link";

export const revalidate = 60; // Revalidate every minute

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="relative min-h-screen yuzu-shell overflow-hidden">
            <div className="pointer-events-none absolute inset-0 yuzu-bg opacity-40 fixed" />
            <div className="pointer-events-none absolute -top-24 right-[-6rem] h-72 w-72 rounded-full yuzu-orb blur-3xl opacity-80" />

            <header className="relative z-10 mx-auto max-w-6xl px-4 pt-10 pb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full soft-pill px-4 py-2 text-sm font-semibold text-ink hard-shadow hover:-translate-y-1 transition-transform mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    返回首页
                </Link>

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-xl soft-pill bg-[var(--yuzu-lemon)] px-3 py-1 text-xs font-semibold text-ink">
                            <FlaskConical className="h-3 w-3" />
                            Product Lab
                        </div>
                        <h1 className="font-display text-5xl font-black text-ink leading-none sm:text-6xl">
                            Yuzu Picks
                        </h1>
                        <p className="max-w-xl text-lg font-semibold text-ink-soft">
                            沉浸式体验与深度解析。从交互细节到技术架构，带你以开发者的视角，看懂每一个好产品。
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:block rounded-2xl soft-card p-4 text-center rotate-1">
                        <div className="font-display text-3xl font-black text-ink">
                            {products.length}
                        </div>
                        <div className="text-xs font-semibold text-ink-muted">
                            已收录产品
                        </div>
                    </div>
                </div>

                {/* Intro / Manifesto Block */}
                <div className="mt-12 rounded-3xl soft-card p-6 md:p-8">
                    <h2 className="font-display mb-3 text-xl font-black text-ink">
                        这里展示什么？
                    </h2>
                    <div className="space-y-2 text-sm font-semibold text-ink-soft md:text-base">
                        <p>
                            这不是一个简单的工具导航站。我会亲自试用每一个产品，从{" "}
                            <span className="bg-[var(--yuzu-lemon)] px-1">
                                UX 体验
                            </span>
                            、
                            <span className="bg-[var(--yuzu-sky)] px-1">
                                技术实现
                            </span>
                            、
                            <span className="bg-[var(--yuzu-mint)] px-1">
                                商业模式
                            </span>{" "}
                            等多个维度进行拆解。
                        </p>
                        <p>
                            无论是改变生产力的 AI
                            Agent，还是设计精妙的独立应用，只要它足够有趣，就会出现在这里。
                        </p>
                    </div>
                </div>
            </header>

            <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="rounded-3xl soft-card p-12 text-center">
                        <p className="text-xl font-semibold text-ink">
                            暂无产品收录，实验室正在装修中...
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
