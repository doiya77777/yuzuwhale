"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { NewsArticle, type NewsDetailData } from "@/components/news-article";
import { SkeletonNewsArticle } from "@/components/skeleton-news-article";

type NewsQuickReadProps = {
  item: NewsDetailData | null;
  isOpen: boolean;
  isLoading?: boolean;
  newsId?: number | null;
  onClose: () => void;
};

export function NewsQuickRead({
  item,
  isOpen,
  isLoading = false,
  newsId,
  onClose,
}: NewsQuickReadProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setDragOffset(0);
      setIsDragging(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isOpen || isDesktop) {
      return;
    }
    dragStartY.current = event.touches[0]?.clientY ?? 0;
    dragStartScroll.current = scrollRef.current?.scrollTop ?? 0;
    setIsDragging(false);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isOpen || isDesktop) {
      return;
    }
    const currentY = event.touches[0]?.clientY ?? 0;
    const delta = currentY - dragStartY.current;
    if (delta <= 0) {
      if (isDragging) {
        setDragOffset(0);
      }
      return;
    }
    if (dragStartScroll.current > 0 && !isDragging) {
      return;
    }
    if (!isDragging) {
      setIsDragging(true);
    }
    setDragOffset(delta);
    event.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isOpen || isDesktop) {
      return;
    }
    if (!isDragging) {
      return;
    }
    if (dragOffset > 120) {
      onClose();
      return;
    }
    setDragOffset(0);
    setIsDragging(false);
  };

  const mobileTransform = isDesktop
    ? "translateY(0)"
    : isOpen
      ? `translateY(${dragOffset}px)`
      : "translateY(100%)";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-stretch justify-center bg-black/30 transition-opacity duration-300 lg:justify-end ${
        isOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`flex h-[100dvh] w-full transform lg:h-full lg:max-w-4xl lg:transition-transform lg:duration-300 ${
          isOpen ? "lg:translate-x-0" : "lg:translate-x-full"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex h-full w-full flex-col overflow-hidden rounded-none bg-[linear-gradient(135deg,#FEF9C3_0%,#E0F2FE_100%)] shadow-2xl transition-transform duration-300 lg:rounded-none"
          style={{
            transform: mobileTransform,
            transition: isDragging ? "none" : undefined,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-center pt-2 lg:hidden">
            <span className="h-1.5 w-12 rounded-full bg-[#172554]/20" />
          </div>

          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#172554]/10 bg-white/90 p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-black text-[#172554] sm:text-lg">
                资讯详情
              </h2>
              {newsId ? (
                <Link
                  href={`/news/${newsId}`}
                  className="inline-flex items-center gap-1 rounded-full border-2 border-[#172554] bg-white px-2.5 py-1 text-xs font-bold text-[#172554] hover:bg-[#E0F2FE]"
                >
                  打开详情页
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              ) : null}
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-[#172554]/10 p-2 text-[#172554] hover:bg-[#172554]/20"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-6"
          >
            {isLoading ? (
              <SkeletonNewsArticle />
            ) : item ? (
              <NewsArticle item={item} />
            ) : (
              <div className="flex h-40 items-center justify-center">
                <span className="text-sm font-semibold text-[#172554]">
                  暂无内容
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
