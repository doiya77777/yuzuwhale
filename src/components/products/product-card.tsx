import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import type { Product } from "@/data/mock-products";

export function ProductCard({ product }: { product: Product }) {
    return (
        <div className="group relative flex flex-col rounded-3xl soft-card p-5 transition-all hover:-translate-y-1">
            {/* Header with Category & Rating */}
            <div className="mb-4 flex items-start justify-between">
                <span className="rounded-full soft-pill bg-[var(--yuzu-sky)] px-3 py-1 text-xs font-semibold text-ink">
                    {product.category}
                </span>
                <div className="flex items-center gap-1 rounded-full soft-pill bg-[var(--yuzu-lemon)] px-2 py-1">
                    <Star className="h-3.5 w-3.5 fill-[var(--yuzu-ink)] text-[var(--yuzu-ink)]" />
                    <span className="text-xs font-semibold text-ink">
                        {product.rating_overall}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
                <h3 className="font-display text-2xl font-black text-ink group-hover:text-ink-soft transition-colors">
                    <Link
                        href={`/products/${product.slug}`}
                        className="before:absolute before:inset-0"
                    >
                        {product.title}
                    </Link>
                </h3>
                <p className="text-sm font-semibold text-ink-soft line-clamp-2">
                    {product.subtitle}
                </p>
            </div>

            {/* Footer Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.slice(0, 3).map((tag) => (
                    <span
                        key={tag}
                        className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider"
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Decorative Arrow */}
            <div className="absolute bottom-5 right-5 opacity-0 transition-opacity group-hover:opacity-100">
                <ArrowRight className="h-6 w-6 text-ink-soft" />
            </div>
        </div>
    );
}
