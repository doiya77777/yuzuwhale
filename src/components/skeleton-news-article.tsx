import { Loader2 } from "lucide-react";

export function SkeletonNewsArticle() {
  return (
    <article className="rounded-3xl border-4 border-[#172554] bg-white p-6 hard-shadow animate-pulse">
      {/* Date/Tags row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="h-7 w-20 rounded-full bg-[#E0F2FE]" />
        <div className="h-6 w-24 rounded bg-[#E0F2FE]" />
      </div>

      {/* Title */}
      <div className="mt-4 space-y-2">
        <div className="h-8 w-3/4 rounded bg-[#172554]/20" />
        <div className="h-8 w-1/2 rounded bg-[#172554]/20" />
      </div>

      {/* Summary */}
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-[#E0F2FE]" />
        <div className="h-4 w-5/6 rounded bg-[#E0F2FE]" />
      </div>

      {/* Source Box */}
      <div className="mt-6 rounded-2xl border-2 border-[#172554]/20 bg-[#F8FAFC] p-4">
        <div className="h-4 w-16 rounded bg-[#E0F2FE] mb-2" />
        <div className="h-4 w-32 rounded bg-[#E0F2FE] mb-2" />
        <div className="h-4 w-24 rounded bg-[#E0F2FE]" />
      </div>

      {/* Content */}
      <div className="mt-6 space-y-4">
        <div className="h-4 w-full rounded bg-[#E0F2FE]" />
        <div className="h-4 w-full rounded bg-[#E0F2FE]" />
        <div className="h-4 w-5/6 rounded bg-[#E0F2FE]" />
        <div className="h-32 w-full rounded-xl border-2 border-[#172554]/10 bg-[#E0F2FE]" />
        <div className="h-4 w-full rounded bg-[#E0F2FE]" />
        <div className="h-4 w-4/5 rounded bg-[#E0F2FE]" />
      </div>

      <div className="mt-8 flex justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-[#172554]/50" />
      </div>
    </article>
  );
}
