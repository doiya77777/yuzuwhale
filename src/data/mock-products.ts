export type Product = {
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

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "cursor",
    title: "Cursor",
    subtitle: "重新定义编码体验的 AI 编辑器",
    cover_image: "https://images.unsplash.com/photo-1642132652859-3ef5a92903ae?q=80&w=3260&auto=format&fit=crop",
    category: "IDE",
    tags: ["生产力", "VS Code", "AI Native"],
    rating_overall: 4.8,
    rating_usability: 5.0,
    rating_features: 4.5,
    rating_price: 3.5,
    rating_community: 4.0,
    pros: ["意图预测 (Copilot++) 极其精准", "Codebase 全局索引能力强", "无缝迁移 VS Code 配置"],
    cons: ["订阅价格较高 ($20/mo)", "大型项目索引偶尔卡顿"],
    content: `
## 为什么它是目前最好的 AI 编辑器？

在试用了 Copilot X, Cody, Codeium 等众多竞品后，Cursor 给我的感觉是唯一一个真正思考 "AI Native" 交互的产品。

它不再是简单的 "侧边栏聊天框"，而是将 AI 植入到了光标的每一次跳动中。

### 核心体验

1.  **沉浸式补全**: 当你敲下回车，它似乎知道你下一步要写 \`console.log\` 还是 \`if (err)\`。这种 "心流" 不被打断的感觉非常棒。
2.  **自然语言改代码**: 选中一段乱糟糟的逻辑，Cmd+K 输入 "优化可读性并添加注释"，它直接原地 Diff 修改，无需复制粘贴。
    `,
    website_url: "https://cursor.sh",
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    slug: "v0-dev",
    title: "v0.dev",
    subtitle: "Vercel 出品的生成式 UI 设计神器",
    cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    category: "Design",
    tags: ["UI/UX", "Generative AI", "React"],
    rating_overall: 4.5,
    rating_usability: 4.8,
    rating_features: 4.0,
    rating_price: 4.0,
    rating_community: 3.5,
    pros: ["生成的 Shadcn UI 代码直接可用", "支持深色模式一键切换", "交互式迭代修改体验好"],
    cons: ["复杂业务逻辑生成能力较弱", "目前仅限于 React 技术栈"],
    content: `
## 前端开发的 "Midjourney"

v0.dev 彻底改变了原型开发流程。以前我们需要 Figma -> Code，现在直接 Prompt -> Code。

对于独立开发者来说，这意味着你不再需要雇佣设计师，甚至不需要自己纠结配色和圆角。

### 体验心得

-   **用图生图**: 随手画一个线框图，或者截一张竞品的图扔进去，它能还原 80% 的结构。
-   **组件化思维**: 不要试图让它一次生成整个 Dashboard。让它先生成 "一个带有搜索栏和用户头像的顶部导航"，效果最好。
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
    category: "LLM Ops",
    tags: ["Agent", "Workflow", "Open Source"],
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
