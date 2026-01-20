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
  try {
    const products = await getProducts();
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Supabase products fetch failed, skipping static params.", error);
    }
    return [];
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  let product = null;
  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Supabase product fetch failed, showing not found.", error);
    }
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#FEF9C3_0%,#E0F2FE_100%)] pb-24">
       <div className="pointer-events-none absolute inset-0 yuzu-bg opacity-60 fixed" />

       {/* Navbar */}
       <header className="relative z-20 mx-auto max-w-5xl px-4 pt-8">
            <div className="flex items-center justify-between">
                <Link 
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-full border-4 border-[#172554] bg-white px-4 py-2 text-sm font-black text-[#172554] hard-shadow hover:-translate-y-1 transition-transform"
                >
                    <ArrowLeft className="h-4 w-4" />
                    返回列表
                </Link>
                {/* Category Badge */}
                 <span className="rounded-full bg-[#172554] px-4 py-2 text-sm font-bold text-white shadow-lg">
                    {product.category}
                </span>
            </div>
       </header>

       <main className="relative z-10 mx-auto mt-8 max-w-5xl px-4 space-y-8">
            
            {/* Hero Section */}
            <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                
                {/* Left: Info */}
                <div className="space-y-6">
                    <div className="rounded-3xl border-4 border-[#172554] bg-white p-8 hard-shadow">
                        <div className="flex flex-col gap-6">
                            {product.cover_image && (
                                <div className="relative h-48 w-full overflow-hidden rounded-2xl border-2 border-[#172554]">
                                    <Image 
                                        src={product.cover_image} 
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <h1 className="text-4xl font-black text-[#172554] sm:text-5xl">{product.title}</h1>
                                <p className="text-xl font-bold text-[#1e3a8a]">{product.subtitle}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {product.tags.map(tag => (
                                    <span key={tag} className="rounded-lg border-2 border-[#172554] bg-[#E0F2FE] px-3 py-1 text-xs font-bold text-[#172554]">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {product.website_url && (
                                <a 
                                    href={product.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border-4 border-[#172554] bg-[#FDE047] py-4 text-lg font-black text-[#172554] shadow-[4px_4px_0_0_#172554] transition-transform hover:-translate-y-1 hover:shadow-none active:translate-y-0 active:bg-[#FDE047]/80"
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
                    <div className="flex flex-col items-center justify-center rounded-3xl border-4 border-[#172554] bg-white p-6 hard-shadow min-h-[400px]">
                        <h3 className="mb-4 text-center text-lg font-black text-[#172554] uppercase tracking-widest">
                            Yuzu Picks 测评
                        </h3>
                        <RadarChart data={{
                            usability: product.rating_usability,
                            features: product.rating_features,
                            price: product.rating_price,
                            community: product.rating_community,
                            overall: product.rating_overall
                        }} />
                        <div className="mt-6 text-center">
                            <div className="text-4xl font-black text-[#172554]">{product.rating_overall}</div>
                            <div className="text-xs font-bold text-[#1e3a8a]">综合评分</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pros & Cons */}
            <section>
                <ProsCons pros={product.pros} cons={product.cons} />
            </section>

            {/* Deep Dive Content */}
            <section className="rounded-3xl border-4 border-[#172554] bg-white p-6 sm:p-10 hard-shadow">
                <div className="mb-8 flex items-center gap-3 border-b-4 border-[#172554]/10 pb-4">
                    <span className="text-2xl">📝</span>
                    <h2 className="text-2xl font-black text-[#172554]">深度解析</h2>
                </div>
                <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-[#172554] prose-p:font-medium prose-p:text-[#1e3a8a]">
                    <PopMarkdown content={product.content || "暂无详细测评内容。"} />
                </div>
            </section>

       </main>
    </div>
  );
}
