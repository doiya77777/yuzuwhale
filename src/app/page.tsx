"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Globe, Sparkles, Twitter } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

const socials = {
  Twitter: Twitter,
  GitHub: Github,
  Xiaohongshu: Sparkles,
};

const btnStyle =
  "px-6 py-3 bg-white font-black border-2 border-[#172554] shadow-[4px_4px_0px_0px_#172554] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#FDE047]";

export default function Home() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeItem = siteConfig.gallery.find((item) => item.id === activeId);

  const bubbles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        id: index,
        size: 40 + index * 8,
        left: `${10 + index * 10}%`,
        duration: 12 + index * 2,
        delay: index * 1.2,
      })),
    [],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#FEF9C3_0%,#E0F2FE_100%)]">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="pointer-events-none absolute bottom-0 rounded-full border-4 border-[#1D4ED8]/40 bg-white/30"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.left,
          }}
          animate={{ y: [0, -900] }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-4 pb-6 pt-10 sm:px-6">
        <div className="flex items-center gap-3 rounded-full border-4 border-[#172554] bg-white px-4 py-2 text-[#172554] hard-shadow">
          <span className="text-xl">🐳</span>
          <span className="font-black tracking-wide">YUZU.AI</span>
        </div>
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
                className="rounded-full border-4 border-[#172554] bg-white p-2 text-[#172554] hard-shadow transition hover:-translate-y-1"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 sm:px-6">
        <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl border-4 border-[#172554] bg-[#1D4ED8]" />
            <div className="relative rounded-3xl border-4 border-[#172554] bg-white p-4 hard-shadow">
              <Image
                src="/images/avatar.svg"
                alt="Yuzu Whale avatar"
                width={520}
                height={520}
                className="h-auto w-full rounded-2xl border-4 border-[#172554]"
                priority
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold tracking-[0.3em] text-[#172554]">
                {siteConfig.profile.title}
              </p>
              <h1 className="text-5xl font-black uppercase leading-tight text-[#172554] sm:text-6xl">
                {siteConfig.profile.name}
              </h1>
              <p className="text-xl font-semibold text-[#172554]">
                {siteConfig.profile.slogan}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {siteConfig.profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border-2 border-[#172554] bg-white px-4 py-2 text-sm font-bold text-[#172554] hard-shadow"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <button type="button" className={btnStyle}>
                查看我的大脑 🧠
              </button>
              <span className="rounded-full border-2 border-[#172554] bg-[#1D4ED8] px-4 py-3 text-sm font-bold text-white hard-shadow">
                AI Creator
              </span>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📰</span>
              <h2 className="text-2xl font-black text-[#172554]">
                News / 情报站
              </h2>
            </div>
            <div className="space-y-4">
              {siteConfig.news.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ rotate: -1, x: 4, y: -4 }}
                  transition={{ type: "spring", stiffness: 240, damping: 15 }}
                  className="rounded-3xl border-4 border-[#172554] bg-white p-5 hard-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#1D4ED8] px-3 py-1 text-xs font-bold text-white">
                      {item.date}
                    </span>
                    <span className="text-xl">{item.emoji}</span>
                  </div>
                  <p className="mt-4 text-base font-semibold text-[#172554]">
                    {item.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <h2 className="text-2xl font-black text-[#172554]">
                Gallery / 作品集
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {siteConfig.gallery.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className="relative overflow-hidden rounded-3xl border-4 border-[#172554] bg-white p-4 text-left hard-shadow"
                >
                  <div className="relative h-36 w-full overflow-hidden rounded-2xl border-4 border-[#172554]">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 28vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-black text-[#172554]">
                      {item.title}
                    </span>
                    <span className="rounded-full bg-[#1D4ED8] px-2 py-1 text-xs font-bold text-white">
                      {item.tag}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-[#172554]">
                    {item.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <footer className="rounded-3xl border-4 border-[#172554] bg-white/80 p-6 text-[#172554] hard-shadow">
          <div className="rounded-3xl border-4 border-[#172554] bg-white p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold">商务合作</p>
                <p className="text-sm">{siteConfig.profile.email}</p>
              </div>
              <div className="text-xs font-semibold">
                © 2025 Yuzu Whale. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {activeItem ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/70 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveId(null)}
          >
            <motion.div
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border-4 border-[#172554] bg-white hard-shadow"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
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
              <div className="space-y-2 p-6 text-[#172554]">
                <h3 className="text-xl font-black">{activeItem.title}</h3>
                <p className="text-sm font-semibold">{activeItem.prompt}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
