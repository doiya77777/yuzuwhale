import { getProductBySlug, getProducts } from "@/lib/supabase/tools";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe } from "lucide-react";
import Link from "next/link";
import { RadarChart } from "@/components/products/radar-chart";
import { ProsCons } from "@/components/products/pros-cons";
import { PopMarkdown } from "@/components/pop-markdown";
import Image from "next/image";

type Props = {
    params: Promise<{ slug: string }>;
};

// Generate static params for known products
export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product) => ({
        slug: product.slug,
    }));
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="relative min-h-screen yuzu-shell pb-24 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 yuzu-bg opacity-40 fixed" />
            <div className="pointer-events-none absolute -top-24 right-[-6rem] h-72 w-72 rounded-full yuzu-orb blur-3xl opacity-80" />

            {/* Navbar */}
            <header className="relative z-20 mx-auto max-w-5xl px-4 pt-8">
                <div className="flex items-center justify-between">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 rounded-full soft-pill px-4 py-2 text-sm font-semibold text-ink hover:-translate-y-1 transition-transform"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        返回列表
                    </Link>
                    {/* Category Badge */}
                    <span className="rounded-full bg-[var(--yuzu-ink)] px-4 py-2 text-sm font-semibold text-white shadow-lg">
                        {product.category}
                    </span>
                </div>
            </header>

            <main className="relative z-10 mx-auto mt-8 max-w-5xl px-4 space-y-8">
                {/* Hero Section */}
                <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* Left: Info */}
                    <div className="space-y-6">
                        <div className="rounded-3xl soft-card p-8">
                            <div className="flex flex-col gap-6">
                                {product.cover_image && (
                                    <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-[var(--border)]">
                                        <Image
                                            src={product.cover_image}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <h1 className="font-display text-4xl font-black text-ink sm:text-5xl">
                                        {product.title}
                                    </h1>
                                    <p className="text-xl font-semibold text-ink-soft">
                                        {product.subtitle}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-lg soft-pill bg-[var(--yuzu-sky)] px-3 py-1 text-xs font-semibold text-ink"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {product.website_url && (
                                    <a
                                        href={product.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--yuzu-lemon)] py-4 text-lg font-semibold text-ink shadow-[0_14px_30px_rgba(31,42,68,0.18)] transition-transform hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(31,42,68,0.22)] hover:brightness-95 active:translate-y-0 active:brightness-90"
                                    >
                                        <Globe className="h-5 w-5" />
                                        访问官网
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Radar & Stats */}
                    <div className="space-y-6">
                        <div className="flex flex-col items-center justify-center rounded-3xl soft-card p-6 min-h-[400px]">
                            <h3 className="font-display mb-4 text-center text-lg font-black text-ink tracking-[0.2em]">
                                Yuzu Picks 测评
                            </h3>
                            <RadarChart
                                data={{
                                    usability: product.rating_usability,
                                    features: product.rating_features,
                                    price: product.rating_price,
                                    community: product.rating_community,
                                    overall: product.rating_overall,
                                }}
                            />
                            <div className="mt-6 text-center">
                                <div className="font-display text-4xl font-black text-ink">
                                    {product.rating_overall}
                                </div>
                                <div className="text-xs font-semibold text-ink-muted">
                                    综合评分
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pros & Cons */}
                <section>
                    <ProsCons pros={product.pros} cons={product.cons} />
                </section>

                {/* Deep Dive Content */}
                <section className="rounded-3xl soft-card p-6 sm:p-10">
                    <div className="mb-8 flex items-center gap-3 border-b border-[var(--border)] pb-4">
                        <span className="text-2xl">📝</span>
                        <h2 className="font-display text-2xl font-black text-ink">
                            深度解析
                        </h2>
                    </div>
                    <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-[var(--yuzu-ink)] prose-p:font-medium prose-p:text-[var(--yuzu-ink-soft)]">
                        <PopMarkdown
                            content={product.content || "暂无详细测评内容。"}
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}
