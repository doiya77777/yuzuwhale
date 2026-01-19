import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import type { Product } from "@/data/mock-products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col rounded-3xl border-4 border-[#172554] bg-white p-5 hard-shadow transition-all hover:-translate-y-1 hover:shadow-none">
        
      {/* Header with Category & Rating */}
      <div className="mb-4 flex items-start justify-between">
        <span className="rounded-full bg-[#E0F2FE] px-3 py-1 text-xs font-bold text-[#172554] border-2 border-[#172554]">
          {product.category}
        </span>
        <div className="flex items-center gap-1 rounded-full bg-[#FDE047] px-2 py-1 border-2 border-[#172554]">
          <Star className="h-3.5 w-3.5 fill-[#172554] text-[#172554]" />
          <span className="text-xs font-black text-[#172554]">{product.rating_overall}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <h3 className="text-2xl font-black text-[#172554] group-hover:text-[#1D4ED8] transition-colors">
            <Link href={`/products/${product.slug}`} className="before:absolute before:inset-0">
                {product.title}
            </Link>
        </h3>
        <p className="text-sm font-semibold text-[#1e3a8a] line-clamp-2">
            {product.subtitle}
        </p>
      </div>

      {/* Footer Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {product.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] font-bold text-[#172554]/60 uppercase tracking-wider">
                #{tag}
            </span>
        ))}
      </div>

      {/* Decorative Arrow */}
      <div className="absolute bottom-5 right-5 opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowRight className="h-6 w-6 text-[#1D4ED8]" />
      </div>
    </div>
  );
}
