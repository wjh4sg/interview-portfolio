export type PortfolioProject = {
  name: string;
  eyebrow: string;
  summary: string;
  release: string;
  repoUrl: string;
  releaseUrl: string;
  architecture: string;
  architectureAlt: string;
  status: string;
  demoUrl?: string;
  highlights: string[];
  tags: string[];
};

export const siteConfig: {
  name: string;
  title: string;
  description: string;
  github: string;
  resume: string;
  projects: PortfolioProject[];
} = {
  name: "WJH",
  title: "AI 应用开发 / 后端开发",
  description:
    "WJH 的 AI 应用开发作品集，聚焦 Agent 工程、RAG 检索增强生成与可靠的后端实现。",
  github: "https://github.com/wjh4sg",
  resume: "/resume.pdf",
  projects: [
    {
      name: "MiniCode",
      eyebrow: "Agent Engineering · CLI Coding Agent",
      summary:
        "一个受控的本地 CLI Coding Agent MVP。围绕工具调用、安全边界、上下文压缩与可追踪执行链，验证 Agent 从“会回答”到“能可靠行动”的工程路径。",
      release: "v0.2.1",
      repoUrl: "https://github.com/wjh4sg/Mini-Code",
      releaseUrl: "https://github.com/wjh4sg/Mini-Code/releases/tag/v0.2.1",
      architecture: "/images/minicode-architecture.svg",
      architectureAlt: "MiniCode Agent 工具调用与安全执行架构图",
      status: "演示视频即将上线",
      highlights: [
        "Skill 路由与只读工具调用",
        "工作区隔离及敏感路径保护",
        "上下文压缩、执行轨迹与记忆",
        "OpenAI-compatible API 与 Mock fallback",
      ],
      tags: ["Python", "Agent", "Tool Calling", "CLI", "Safety"],
    },
    {
      name: "Personal RAG",
      eyebrow: "RAG Engineering · Knowledge Base",
      summary:
        "一个面向个人文档的本地混合检索知识库。支持多格式摄取、向量与 BM25 融合、可定位引用和离线评测，把 RAG 的效果变成可检查的工程指标。",
      release: "v0.1.2",
      repoUrl: "https://github.com/wjh4sg/personal-rag-knowledge-base",
      releaseUrl:
        "https://github.com/wjh4sg/personal-rag-knowledge-base/releases/tag/v0.1.2",
      architecture: "/images/rag-architecture.svg",
      architectureAlt: "Personal RAG 文档摄取、混合检索与生成评测架构图",
      status: "在线 Demo 即将上线",
      highlights: [
        "Markdown / TXT / PDF 文档摄取",
        "Chroma + Jieba BM25 混合检索",
        "RRF 融合、引用定位与增量索引",
        "Hit@K / MRR 离线评测与 CI",
      ],
      tags: ["Python", "RAG", "Chroma", "BM25", "Evaluation"],
    },
  ],
};
