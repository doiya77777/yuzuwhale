"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
      className="text-[#172554]"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Bold text: Yellow highlight, heavy font
          strong: ({ children }) => (
            <span className="inline-block -skew-x-6 bg-[#FDE047] px-1 font-black text-[#172554]">
              {children}
            </span>
          ),
          // Paragraphs: Spaced out, bold font
          p: ({ children }) => (
            <motion.p variants={itemVariants} className="mb-3 text-sm font-bold leading-relaxed last:mb-0">
              {children}
            </motion.p>
          ),
          // Headings: Big, uppercase, blue
          h1: ({ children }) => <motion.h1 variants={itemVariants} className="mb-2 font-black text-xl">{children}</motion.h1>,
          h2: ({ children }) => <motion.h2 variants={itemVariants} className="mb-2 font-black text-lg">{children}</motion.h2>,
          h3: ({ children }) => <motion.h3 variants={itemVariants} className="mb-1 font-black text-base uppercase tracking-wider">{children}</motion.h3>,
          // Lists: Custom bullets
          ul: ({ children }) => (
            <motion.ul variants={itemVariants} className="mb-3 space-y-1 pl-1">
              {children}
            </motion.ul>
          ),
          ol: ({ children }) => (
            <motion.ol variants={itemVariants} className="mb-3 list-decimal space-y-1 pl-4 font-bold">
              {children}
            </motion.ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-sm font-semibold">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#172554]" />
              <span>{children}</span>
            </li>
          ),
          // Blockquotes: Thick border
          blockquote: ({ children }) => (
            <motion.blockquote variants={itemVariants} className="my-3 border-l-4 border-[#172554] bg-[#E0F2FE] p-3 text-sm font-bold italic">
              {children}
            </motion.blockquote>
          ),
          // Code: Monospace bubble
          code: ({ children }) => (
            <code className="rounded bg-[#E0F2FE] px-1 py-0.5 font-mono text-xs font-bold text-[#1D4ED8]">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}
