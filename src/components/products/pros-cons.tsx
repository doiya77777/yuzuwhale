import { CheckCircle2, XCircle } from "lucide-react";

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Pros */}
      <div className="rounded-2xl border-4 border-[#172554] bg-[#F0FDF4] p-5">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-[#166534]">
            <CheckCircle2 className="h-6 w-6" />
            值得推荐 (Pros)
        </h3>
        <ul className="space-y-3">
            {pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-bold text-[#14532d]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#166534]" />
                    {pro}
                </li>
            ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="rounded-2xl border-4 border-[#172554] bg-[#FEF2F2] p-5">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-[#991B1B]">
            <XCircle className="h-6 w-6" />
            需要注意 (Cons)
        </h3>
        <ul className="space-y-3">
            {cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-bold text-[#7f1d1d]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#991B1B]" />
                    {con}
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
