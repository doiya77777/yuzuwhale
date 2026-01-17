"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Globe, Sparkles, Twitter } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

const socials = {
  Twitter: Twitter,
  GitHub: Github,
  Xiaohongshu: Sparkles,
};

export default function Home() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeItem = siteConfig.gallery.find((item) => item.id === activeId);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(253,224,71,0.4),rgba(253,224,71,0))]" />
      <div className="pointer-events-none absolute -right-32 top-40 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,rgba(186,230,253,0.55),rgba(186,230,253,0))]" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle_at_center,rgba(253,164,175,0.45),rgba(253,164,175,0))]" />

      <header className="sticky top-6 z-30 flex justify-center px-4">
        <div className="glass soft-shadow flex items-center gap-4 rounded-full border-2 border-white/50 px-6 py-3">
          <span className="text-sm font-bold">🐳 Yuzu.AI</span>
          <div className="h-6 w-px bg-white/70" />
          <div className="flex items-center gap-3">
            {siteConfig.profile.socials.map((social) => {
              const Icon =
                socials[social.platform as keyof typeof socials] ?? Globe;
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border-2 border-white/50 bg-white/70 p-2 text-slate-600 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass soft-shadow inline-flex w-fit items-center gap-3 rounded-3xl border-2 border-white/50 px-4 py-2 text-sm font-semibold"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              Yuzu Whale AI Playground
            </motion.div>
            <div className="space-y-4">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-6xl"
              >
                🐳
              </motion.div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-700 sm:text-5xl">
                Hi, 我是{siteConfig.profile.name}！
              </h1>
              <p className="text-lg text-slate-600">
                {siteConfig.profile.slogan}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {siteConfig.profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border-2 border-white/50 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="glass soft-shadow relative flex flex-col gap-4 rounded-3xl border-2 border-white/50 p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600">今日能量</span>
              <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-bold text-slate-700">
                99% 软萌模式
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "粉丝温度", value: "甜度爆表" },
                { label: "灵感存储", value: "满格" },
                { label: "创作频率", value: "每日更新" },
                { label: "AI 技能", value: "无限拓展" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border-2 border-white/50 bg-white/80 p-4 text-sm"
                >
                  <p className="font-semibold text-slate-700">{item.label}</p>
                  <p className="text-slate-500">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📰</span>
              <h2 className="text-2xl font-bold text-slate-700">
                每日 AI 情报局
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {siteConfig.news.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ rotate: 1, y: -2 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="glass soft-shadow rounded-3xl border-2 border-white/50 p-5"
                >
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{item.date}</span>
                    <span className="text-xl">{item.emoji}</span>
                  </div>
                  <p className="mt-3 text-base font-semibold text-slate-700">
                    {item.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <h2 className="text-2xl font-bold text-slate-700">柚子画廊</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
              {siteConfig.gallery.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl border-2 border-white/50 text-left",
                    "col-span-2 h-48 sm:h-52",
                    index === 0 && "sm:col-span-4 sm:h-64",
                    index === 1 && "sm:col-span-2 sm:row-span-2 sm:h-auto",
                    index === 2 && "sm:col-span-2",
                    index === 3 && "sm:col-span-4",
                  )}
                >
                  <div className={cn("absolute inset-0", item.color)} />
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/0 via-black/0 to-black/40 p-4 text-white opacity-0 transition group-hover:opacity-100">
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {item.tag}
                    </span>
                    <span className="text-sm font-semibold">{item.prompt}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700">
                    {item.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-6 rounded-3xl border-2 border-white/50 bg-white/70 p-8 text-sm text-slate-600">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">商务合作</p>
              <p>{siteConfig.profile.email}</p>
            </div>
            <div className="text-xs text-slate-500">
              © 2025 Yuzu Whale. All rights reserved.
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="whale" aria-hidden="true" />
            <span>一只正在游动的鲸鱼，守护每一次灵感。</span>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {activeItem ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveId(null)}
          >
            <motion.div
              className="glass soft-shadow relative w-full max-w-3xl overflow-hidden rounded-3xl border-2 border-white/50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative h-[360px] w-full">
                <Image
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-6">
                <h3 className="text-xl font-bold text-slate-700">
                  {activeItem.title}
                </h3>
                <p className="text-sm text-slate-600">{activeItem.prompt}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
