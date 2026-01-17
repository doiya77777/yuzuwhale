export type SocialLink = {
  platform: string;
  url: string;
};

export type Profile = {
  name: string;
  title: string;
  slogan: string;
  email: string;
  tags: string[];
  socials: SocialLink[];
};

export type NewsItem = {
  id: number;
  date: string;
  emoji: string;
  content: string;
};

export type GalleryItem = {
  id: number;
  title: string;
  imageUrl: string;
  tag: string;
  color: string;
  prompt: string;
};

export type SiteConfig = {
  profile: Profile;
  news: NewsItem[];
  gallery: GalleryItem[];
};

export const siteConfig: SiteConfig = {
  profile: {
    name: "YUZU WHALE",
    title: "AI 观察员 / 内容创造者",
    slogan: "用最鲜的视角，拆解 AI 的每一次升级。",
    email: "hi@yuzuwhale.com",
    tags: ["AI 速递", "视觉趋势", "Prompt Tips"],
    socials: [
      { platform: "Twitter", url: "https://twitter.com/" },
      { platform: "GitHub", url: "https://github.com/" },
      { platform: "Xiaohongshu", url: "https://www.xiaohongshu.com/" },
    ],
  },
  news: [
    {
      id: 1,
      date: "2小时前",
      emoji: "🧠",
      content: "Sora 2.0 公测要点：可控性更强，细节稳定度明显提升。",
    },
    {
      id: 2,
      date: "昨天",
      emoji: "✨",
      content: "今天分享一组“高对比+干净背景”Prompt，适配大多数风格。",
    },
    {
      id: 3,
      date: "3天前",
      emoji: "🎨",
      content: "一周配色复盘：浅黄×浅蓝，视觉更干净、更耐看。",
    },
  ],
  gallery: [
    {
      id: 1,
      title: "Yuzu Pop",
      imageUrl: "/images/art1.svg",
      tag: "Midjourney",
      color: "bg-white",
      prompt: "pop art whale, clean lines, lemon yellow",
    },
    {
      id: 2,
      title: "Neon Splash",
      imageUrl: "/images/art2.svg",
      tag: "Niji",
      color: "bg-white",
      prompt: "anime neon, crisp highlights, bold outline",
    },
    {
      id: 3,
      title: "Arcade Wave",
      imageUrl: "/images/art3.svg",
      tag: "Sora",
      color: "bg-white",
      prompt: "arcade poster, airy background, soft glow",
    },
    {
      id: 4,
      title: "Bubble Riot",
      imageUrl: "/images/art4.svg",
      tag: "Stable",
      color: "bg-white",
      prompt: "floating bubbles, clean texture, light pop",
    },
  ],
};
