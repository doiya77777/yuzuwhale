import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Yuzu",
    description: "Yuzu 的高能波普 AI 创作基地。",
    icons: {
        icon: [
            { url: "/yuzu.svg?v=2", type: "image/svg+xml" },
            { url: "/favicon.ico?v=2" },
        ],
        shortcut: [{ url: "/yuzu.svg?v=2", type: "image/svg+xml" }],
        apple: [{ url: "/yuzu.svg?v=2", type: "image/svg+xml" }],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN">
            <body className="antialiased">{children}</body>
        </html>
    );
}
