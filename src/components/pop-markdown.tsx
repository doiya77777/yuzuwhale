"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { motion } from "framer-motion";

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

export function PopMarkdown({ content }: { content: string }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={listVariants}
            className="text-ink pop-markdown-container"
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                    // Bold text: Yellow highlight, heavy font
                    strong: ({ children }) => (
                        <span className="inline-block rounded-md bg-[var(--yuzu-lemon)] px-1 font-semibold text-ink">
                            {children}
                        </span>
                    ),
                    // Paragraphs: Spaced out, bold font
                    p: ({ children }) => (
                        <motion.p
                            variants={itemVariants}
                            className="mb-4 text-base font-medium leading-relaxed text-ink-soft last:mb-0"
                        >
                            {children}
                        </motion.p>
                    ),
                    // Headings: Big, uppercase, blue
                    h1: ({ children }) => (
                        <motion.h1
                            variants={itemVariants}
                            className="font-display mt-8 mb-4 text-3xl font-black text-ink"
                        >
                            {children}
                        </motion.h1>
                    ),
                    h2: ({ children }) => (
                        <motion.h2
                            variants={itemVariants}
                            className="font-display mt-6 mb-3 text-2xl font-black text-ink"
                        >
                            {children}
                        </motion.h2>
                    ),
                    h3: ({ children }) => (
                        <motion.h3
                            variants={itemVariants}
                            className="font-display mt-4 mb-2 text-xl font-black text-ink"
                        >
                            {children}
                        </motion.h3>
                    ),
                    // Lists: Custom bullets
                    ul: ({ children }) => (
                        <motion.ul
                            variants={itemVariants}
                            className="mb-4 space-y-2 pl-2"
                        >
                            {children}
                        </motion.ul>
                    ),
                    ol: ({ children }) => (
                        <motion.ol
                            variants={itemVariants}
                            className="mb-4 list-decimal space-y-2 pl-5 font-semibold text-ink-soft"
                        >
                            {children}
                        </motion.ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-sm font-medium leading-relaxed text-ink-soft">
                            {children}
                        </li>
                    ),
                    // Blockquotes: Thick border
                    blockquote: ({ children }) => (
                        <motion.blockquote
                            variants={itemVariants}
                            className="my-6 border-l-4 border-[var(--yuzu-ink)]/40 bg-[var(--yuzu-sky)] p-4 text-sm font-semibold italic text-ink"
                        >
                            {children}
                        </motion.blockquote>
                    ),
                    // Code: Monospace bubble
                    code: ({ className, children }) => {
                        const isBlock = className?.includes("language-");
                        if (isBlock) {
                            return (
                                <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[#1f2a44] p-4 text-white">
                                    <code className="font-mono text-xs">
                                        {children}
                                    </code>
                                </pre>
                            );
                        }
                        return (
                            <code className="rounded bg-[var(--yuzu-sky)] px-1 py-0.5 font-mono text-sm font-semibold text-[#3b6dd8]">
                                {children}
                            </code>
                        );
                    },
                    // Images
                    img: ({ src, alt }) => (
                        <motion.img
                            variants={itemVariants}
                            src={src}
                            alt={alt}
                            className="my-6 h-auto w-full rounded-xl border border-[var(--border)] bg-white shadow-[0_16px_32px_rgba(31,42,68,0.15)]"
                        />
                    ),
                    // Links
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#3b6dd8] underline decoration-2 underline-offset-2 hover:bg-[var(--yuzu-lemon)]"
                        >
                            {children}
                        </a>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </motion.div>
    );
}
