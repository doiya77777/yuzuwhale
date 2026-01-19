export type Tool = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  cover_image: string | null;
  category: string;
  tags: string[];
  rating_overall: number;
  rating_usability: number;
  rating_features: number;
  rating_price: number;
  rating_community: number;
  pros: string[];
  cons: string[];
  content: string | null;
  website_url: string | null;
  published: boolean;
  created_at: string;
};

export const MOCK_TOOLS: Tool[] = [
  {
    id: 1,
    slug: "cursor",
    title: "Cursor",
    subtitle: "AI Native 代码编辑器",
    cover_image: "https://images.unsplash.com/photo-1642132652859-3ef5a92903ae?q=80&w=3260&auto=format&fit=crop",
    category: "IDE",
    tags: ["AI Coding", "VS Code Fork", "Productivity"],
    rating_overall: 4.8,
    rating_usability: 5.0,
    rating_features: 4.5,
    rating_price: 3.5,
    rating_community: 4.0,
    pros: ["无缝继承 VS Code 插件生态", "Codebase 索引能力极强", "Tab 补全体验流畅"],
    cons: ["每月 $20 订阅费略贵", "偶尔索引会卡顿"],
    content: `
## Cursor 为什么这么火？

Cursor 是目前最接近 "AI Native" 定义的代码编辑器。它不仅仅是一个加了 Chat 窗口的 VS Code，而是深入到了编辑器内核。

### 核心亮点

1. **Copilot++**: 它的预测能力远超 GitHub Copilot，能够根据你的光标移动预测下一个改动位置。
2. **Codebase Context**: 它可以读取整个项目文件，当你问 "如何增加一个新页面" 时，它知道你的路由结构、组件规范。

### 真实体验

我用它重构了 Yuzu Whale 的前端代码，效率提升了至少 30%。特别是处理繁琐的 TypeScript 类型定义时，它几乎能秒给正确答案。
    `,
    website_url: "https://cursor.sh",
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    slug: "v0-dev",
    title: "v0.dev",
    subtitle: "生成式 UI 设计工具 by Vercel",
    cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    category: "Design",
    tags: ["UI/UX", "Tailwind CSS", "React"],
    rating_overall: 4.5,
    rating_usability: 4.8,
    rating_features: 4.0,
    rating_price: 4.0,
    rating_community: 3.5,
    pros: ["生成的 Shadcn UI 代码质量极高", "支持深色模式预览", "与 Next.js 生态完美融合"],
    cons: ["复杂交互逻辑生成能力较弱", "目前仅支持 React/Tailwind 栈"],
    content: `
## 前端开发的加速器

v0.dev 彻底改变了原型开发流程。以前我们需要 Figma -> Code，现在直接 Prompt -> Code。

### 最佳实践

- **迭代式生成**: 不要试图一次生成整个 Dashboard。先生成 Sidebar，再生成 Header，最后生成 Content Area。
- **带图 Prompt**: 上传一张手绘草图，它的还原度惊人。
    `,
    website_url: "https://v0.dev",
    published: true,
    created_at: new Date().toISOString(),
  },
    {
    id: 3,
    slug: "dify",
    title: "Dify",
    subtitle: "开源 LLM 应用开发平台",
    cover_image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2832&auto=format&fit=crop",
    category: "Agent",
    tags: ["LLM Ops", "Workflow", "No-Code"],
    rating_overall: 4.7,
    rating_usability: 4.2,
    rating_features: 4.8,
    rating_price: 5.0,
    rating_community: 4.8,
    pros: ["开源且支持私有化部署", "工作流编排功能强大", "RAG 检索效果调优空间大"],
    cons: ["复杂的 Agent 模式上手有门槛", "Python 插件机制还在完善中"],
    content: `
## 企业级 Agent 必选

如果你想搭建一套自己的 GPTs 甚至更复杂的 AI 工作流，Dify 目前是开源界的最佳选择。

### 为什么选择 Dify?

相比于 LangChain 的纯代码开发，Dify 提供了一套可视化的编排界面，让非技术人员也能参与 Prompt 调试。同时它又保留了 API 接口，方便集成到现有业务系统。
    `,
    website_url: "https://dify.ai",
    published: true,
    created_at: new Date().toISOString(),
  }
];
