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

  it("uses www.wjhdev.cloud as the public website URL", async () => {
    const page = await readFile(resolve("src/pages/index.astro"), "utf8");
    const readme = await readFile(resolve("README.md"), "utf8");
    const footer = await readFile(
      resolve("src/components/Footer.astro"),
      "utf8",
    );

    expect(page).toContain(
      'const canonicalUrl = "https://www.wjhdev.cloud"',
    );
    expect(readme).toContain(
      "[www.wjhdev.cloud](https://www.wjhdev.cloud)",
    );
    expect(footer).toContain("www.wjhdev.cloud");
  });

  it("serves only the portfolio without retired API proxies", async () => {
    const nginx = await readFile(
      resolve("deploy/nginx-wjhdev.cloud.conf"),
      "utf8",
    );

    expect(nginx).toContain(
      "return 301 https://www.wjhdev.cloud$request_uri;",
    );
    expect(nginx).toContain("try_files $uri $uri/ =404;");
    expect(nginx).not.toContain("/api/wechat/");
    expect(nginx).not.toContain("/ordering-api/");
    expect(nginx).not.toContain("127.0.0.1:18081");
    expect(nginx).not.toContain("127.0.0.1:18083");
  });

  it("uses portfolio-specific Nginx log names", async () => {
    const nginx = await readFile(
      resolve("deploy/nginx-wjhdev.cloud.conf"),
      "utf8",
    );

    expect(nginx).toContain(
      "access_log /var/log/nginx/wjh_portfolio_access.log;",
    );
    expect(nginx).toContain(
      "error_log /var/log/nginx/wjh_portfolio_error.log;",
    );
    expect(nginx).not.toContain("/www/server");
    expect(nginx).not.toContain("/www/wwwlogs");
    expect(nginx).not.toContain("sub2api");
  });

  it("documents system Nginx and Certbot reload templates", async () => {
    const mainNginx = await readFile(resolve("deploy/nginx.conf"), "utf8");
    const reloadHook = await readFile(
      resolve("deploy/reload-nginx.sh"),
      "utf8",
    );
    const readme = await readFile(resolve("README.md"), "utf8");

    expect(mainNginx).toContain("user nginx;");
    expect(mainNginx).toContain("include /etc/nginx/conf.d/*.conf;");
    expect(mainNginx).not.toContain("/www/server");
    expect(reloadHook).toContain("/usr/sbin/nginx -t");
    expect(reloadHook).toContain("systemctl reload nginx");
    expect(readme).toContain("deploy/nginx.conf");
    expect(readme).toContain("deploy/reload-nginx.sh");
    expect(readme).toContain("sudo nginx -t");
  });
});
