import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { siteConfig } from "./config";

describe("portfolio content contract", () => {
  it("presents WJH for AI application and backend roles", () => {
    expect(siteConfig.name).toBe("WJH");
    expect(siteConfig.title).toBe("AI 应用开发 / 后端开发");
    expect(siteConfig.github).toBe("https://github.com/wjh4sg");
    expect(siteConfig.resume).toBe("/resume.pdf");
  });

  it("features the two interview projects with pinned releases", () => {
    expect(siteConfig.projects).toHaveLength(2);
    expect(
      siteConfig.projects.map(({ name, release }) => ({ name, release })),
    ).toEqual([
      { name: "MiniCode", release: "v0.2.1" },
      { name: "Personal RAG", release: "v0.1.2" },
    ]);
  });

  it("marks demos as upcoming instead of exposing dead links", () => {
    for (const project of siteConfig.projects) {
      expect(project.demoUrl).toBeUndefined();
      expect(project.status).toContain("即将上线");
    }
  });

  it("ships verifiable resume, architecture, and attribution assets", async () => {
    const resume = await readFile(resolve("public/resume.pdf"));
    expect(resume.subarray(0, 4).toString()).toBe("%PDF");

    for (const asset of [
      "public/images/minicode-architecture.svg",
      "public/images/rag-architecture.svg",
    ]) {
      expect(await readFile(resolve(asset), "utf8")).toMatch(/<svg[\s>]/);
    }

    expect(await readFile(resolve("NOTICE.md"), "utf8")).toContain(
      "RyanFitzgerald/devportfolio",
    );
  });

  it("provides a persistent accessible theme control", async () => {
    const header = await readFile(
      resolve("src/components/Header.astro"),
      "utf8",
    );
    expect(header).toContain('id="theme-toggle"');
    expect(header).toContain("localStorage");
    expect(header).toContain("aria-label");
  });
});
