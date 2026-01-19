"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Globe, Loader2, Sparkles, ChevronLeft, ChevronRight, FlaskConical, Newspaper, ArrowUpRight } from "lucide-react";
import type { SiteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";
import { PopMarkdown } from "@/components/pop-markdown";
import { getNewsDetail } from "@/app/news/actions";
import type { NewsDetailData } from "@/components/news-article";
import { NewsQuickRead } from "@/components/news-quick-read";

// Custom X Icon (SVG)
function XIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socials = {
  Twitter: XIcon,
  GitHub: Github, // Kept in map but will filter out key
  Xiaohongshu: Sparkles,
};

type HomeClientProps = {
  data: SiteConfig;
  dailySummary?: string | null;
};

function formatDateLabel(value?: string) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });
}

function getNewsLabel(item: SiteConfig["news"][number]) {
  return item.date || formatDateLabel(item.publishedAt);
}

export function HomeClient({ data, dailySummary }: HomeClientProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeItem = data.gallery.find((item) => item.id === activeId);
  const showGallery = (data.profile.showGallery ?? false) && data.gallery.length > 0;
  
  const [activeNews, setActiveNews] = useState<NewsDetailData | null>(null);
  const [openNewsId, setOpenNewsId] = useState<number | null>(null);
  const [loadingNewsId, setLoadingNewsId] = useState<number | null>(null);
  const openNewsIdRef = useRef<number | null>(null);

  // Gallery Navigation Logic
  const activeGalleryIndex = useMemo(() => 
    activeId ? data.gallery.findIndex((item) => item.id === activeId) : -1,
  [activeId, data.gallery]);

  const hasPrev = activeGalleryIndex > 0;
  const hasNext = activeGalleryIndex < data.gallery.length - 1;

  const handlePrevGallery = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (hasPrev) {
      setActiveId(data.gallery[activeGalleryIndex - 1].id);
    }
  }, [hasPrev, activeGalleryIndex, data.gallery]);

  const handleNextGallery = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (hasNext) {
      setActiveId(data.gallery[activeGalleryIndex + 1].id);
    }
  }, [hasNext, activeGalleryIndex, data.gallery]);

  useEffect(() => {
    if (!activeId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
             handleNextGallery();
        } else if (e.key === 'ArrowLeft') {
             handlePrevGallery();
        } else if (e.key === 'Escape') {
            setActiveId(null);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeId, handleNextGallery, handlePrevGallery]);

  const displaySocials = useMemo(() => {
    return data.profile.socials.filter(s => s.platform !== 'GitHub');
  }, [data.profile.socials]);

  const newsList = useMemo(() => data.news.slice(0, 5), [data.news]);

  async function handleNewsClick(e: React.MouseEvent, id: number) {
    e.preventDefault();
    openNewsIdRef.current = id;
    setOpenNewsId(id);
    setActiveNews(null);
    setLoadingNewsId(id);
    try {
      const data = await getNewsDetail(id);
      if (data && openNewsIdRef.current === id) {
        setActiveNews(data);
      }
    } catch (err) {
      console.error("Failed to fetch news detail", err);
    } finally {
      if (openNewsIdRef.current === id) {
        setLoadingNewsId(null);
      }
    }
  }

  function handleCloseNews() {
    openNewsIdRef.current = null;
    setOpenNewsId(null);
    setActiveNews(null);
    setLoadingNewsId(null);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#FEF9C3_0%,#E0F2FE_100%)] p-4 sm:p-8">
      <div className="pointer-events-none absolute inset-0 yuzu-bg opacity-60 fixed" />

      <main className="relative z-10 mx-auto max-w-7xl">
        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto]">
          
          {/* 1. IDENTITY CARD (Top Left, Large) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-4 border-[#172554] bg-white p-6 hard-shadow md:col-span-2 lg:col-span-3 lg:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                         {data.profile.avatarUrl ? (
                            <Image
                            src={data.profile.avatarUrl}
                            alt="Avatar"
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded-full border-4 border-[#172554]"
                            priority
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#172554] bg-[#FDE047]">
                                <span className="text-2xl">🐳</span>
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-black uppercase text-[#172554] sm:text-4xl">
                                {data.profile.name}
                            </h1>
                            <p className="font-bold text-[#1D4ED8]">{data.profile.title}</p>
                        </div>
                    </div>
                    
                    <div className="max-w-xl space-y-2 text-base font-semibold text-[#1e3a8a]">
                        <p>
                            👋 欢迎来到 <span className="bg-[#FDE047] px-1 text-[#172554]">Yuzu Whale</span>。
                            这是一个探索 <b>AI 技术</b>、<b>交互设计</b> 与 <b>独立开发</b> 的数字花园。
                        </p>
                        <p>
                            我在这里同步每日资讯，分享深度产品测评，并折腾一些有趣的创意实验。
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {data.profile.tags.map((tag) => (
                            <span key={tag} className="rounded-lg border-2 border-[#172554]/20 bg-[#F8FAFC] px-3 py-1 text-xs font-bold text-[#172554]">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Socials (Absolute top right or flexed) */}
                <div className="flex gap-2">
                    {displaySocials.map((social) => {
                        const Icon = socials[social.platform as keyof typeof socials] ?? Globe;
                        return (
                        <a
                            key={social.platform}
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#172554] bg-white text-[#172554] transition hover:bg-[#E0F2FE] hover:scale-110"
                        >
                            <Icon className="h-5 w-5" />
                        </a>
                        );
                    })}
                </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FDE047]/20 blur-3xl pointer-events-none" />
          </div>

          {/* 2. DAILY FOCUS (Right Column / Tall on Desktop) */}
          <div className="flex flex-col rounded-3xl border-4 border-[#172554] bg-white p-5 hard-shadow md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2">
             <div className="mb-4 flex items-center gap-2 border-b-2 border-[#172554]/10 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#172554] text-white">
                    <Sparkles className="h-4 w-4" />
                </div>
                <h2 className="font-black text-[#172554]">Daily Focus</h2>
             </div>
             
             <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
                 {dailySummary ? (
                     <div className="prose prose-sm prose-p:my-2 prose-headings:my-2 prose-headings:text-[#172554] prose-strong:text-[#1D4ED8]">
                         <PopMarkdown content={dailySummary} />
                     </div>
                 ) : (
                     <div className="flex h-full flex-col items-center justify-center gap-2 text-[#172554]/50">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="text-xs font-bold">正在生成今日简报...</span>
                     </div>
                 )}
             </div>
             <div className="mt-4 text-center text-[10px] font-bold text-[#172554]/40">
                Generated by AI • {new Date().toLocaleDateString()}
             </div>
          </div>

          {/* 3. PRODUCT LAB (Navigation Card A) */}
          <Link 
            href="/products"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-4 border-[#172554] bg-[#FDE047] p-6 hard-shadow transition-all hover:-translate-y-1 hover:shadow-none active:translate-y-0 md:col-span-1"
          >
             <div className="relative z-10">
                 <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#172554] bg-white">
                    <FlaskConical className="h-5 w-5 text-[#172554]" />
                 </div>
                 <h3 className="text-2xl font-black text-[#172554]">Product Lab</h3>
                 <p className="text-sm font-bold text-[#172554]/80">深度产品测评与解析</p>
             </div>
             <div className="mt-4 flex items-center gap-2 text-sm font-black text-[#172554]">
                <span>进入实验室</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
             </div>
             <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/20 blur-xl group-hover:bg-white/30 transition-colors" />
          </Link>

          {/* 4. NEWS STATION (Navigation Card B) */}
          <Link 
            href="/news"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-4 border-[#172554] bg-[#E0F2FE] p-6 hard-shadow transition-all hover:-translate-y-1 hover:shadow-none active:translate-y-0 md:col-span-1"
          >
             <div className="relative z-10">
                 <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#172554] bg-white">
                    <Newspaper className="h-5 w-5 text-[#172554]" />
                 </div>
                 <h3 className="text-2xl font-black text-[#172554]">Info Station</h3>
                 <p className="text-sm font-bold text-[#172554]/80">每日 AI 资讯速递</p>
             </div>
             <div className="mt-4 flex items-center gap-2 text-sm font-black text-[#172554]">
                <span>查看全部</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
             </div>
          </Link>

          {/* 5. GALLERY PREVIEW (Navigation Card C / or Gallery Image) */}
           {showGallery && data.gallery.length > 0 ? (
               <div className="group relative overflow-hidden rounded-3xl border-4 border-[#172554] bg-white p-0 hard-shadow md:col-span-1">
                   <Image
                     src={data.gallery[0].imageUrl}
                     alt="Gallery Preview"
                     fill
                     className="object-cover transition-transform duration-500 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#172554]/80 to-transparent flex flex-col justify-end p-4">
                        <span className="text-xs font-bold text-[#FDE047]">Latest Art</span>
                        <h4 className="text-lg font-black text-white truncate">{data.gallery[0].title}</h4>
                   </div>
                   <button 
                     onClick={() => setActiveId(data.gallery[0].id)}
                     className="absolute inset-0 z-10"
                     aria-label="View Gallery"
                   />
               </div>
           ) : (
                // Fallback if no gallery: Maybe a "Contact Me" card?
                <a href={`mailto:${data.profile.email}`} className="flex flex-col items-center justify-center rounded-3xl border-4 border-[#172554] bg-white p-6 hard-shadow hover:bg-gray-50 md:col-span-1">
                    <span className="text-3xl">📧</span>
                    <span className="mt-2 font-black text-[#172554]">Contact Me</span>
                </a>
           )}

           {/* 6. LATEST NEWS FEED (Wide Bottom Block) */}
           <div className="rounded-3xl border-4 border-[#172554] bg-white p-6 hard-shadow md:col-span-3 lg:col-span-3">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-black text-[#172554]">Latest Updates</h3>
                    <Link href="/news" className="text-xs font-bold text-[#1D4ED8] hover:underline">View All</Link>
                </div>
                <div className="space-y-3">
                    {newsList.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={(e) => handleNewsClick(e, item.id)}
                            className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 border-transparent bg-[#F8FAFC] px-4 py-3 transition-colors hover:border-[#172554] hover:bg-white"
                        >
                            <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                                <span className="w-fit shrink-0 rounded bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-bold text-[#172554]">
                                    {getNewsLabel(item)}
                                </span>
                                <span className="truncate text-sm font-bold text-[#172554] group-hover:text-[#1D4ED8]">
                                    {item.title}
                                </span>
                            </div>
                            <div className="text-lg opacity-0 transition-opacity group-hover:opacity-100">
                                →
                            </div>
                        </div>
                    ))}
                    {newsList.length === 0 && (
                        <div className="py-4 text-center text-sm font-semibold text-[#1e3a8a]">暂无最新资讯</div>
                    )}
                </div>
           </div>

        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs font-bold text-[#172554]/60">
             © 2026 Yuzu Whale. Designed & Built with ❤️.
        </footer>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {activeItem ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveId(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl border-4 border-[#172554] bg-white shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative flex aspect-video w-full items-center justify-center bg-black/5">
                <Image
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  fill
                  className="object-contain"
                />
                 {/* Navigation Buttons */}
                 {hasPrev && (
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border-2 border-[#172554] bg-white p-2 text-[#172554] shadow-md hover:bg-[#FDE047] transition-colors"
                        onClick={handlePrevGallery}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                )}
                {hasNext && (
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border-2 border-[#172554] bg-white p-2 text-[#172554] shadow-md hover:bg-[#FDE047] transition-colors"
                        onClick={handleNextGallery}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                )}
              </div>
              <div className="flex items-center justify-between border-t-4 border-[#172554] bg-white p-6">
                 <div>
                    <h3 className="text-xl font-black text-[#172554]">{activeItem.title}</h3>
                    <p className="text-sm font-semibold text-[#1e3a8a]">{activeItem.prompt}</p>
                 </div>
                 <div className="rounded-full bg-[#1D4ED8] px-3 py-1 text-xs font-bold text-white">
                    {activeItem.tag}
                 </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <NewsQuickRead
        item={activeNews}
        isOpen={openNewsId !== null}
        isLoading={loadingNewsId !== null}
        newsId={openNewsId}
        onClose={handleCloseNews}
      />
    </div>
  );
}