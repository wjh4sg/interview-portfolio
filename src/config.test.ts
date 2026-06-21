import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { siteConfig } from "./config";

describe("portfolio content contract", () => {
  it("presents WJH portfolio basics", () => {
    expect(siteConfig.name).toBe("WJH");
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

  it("links each project to its public demo video", () => {
    expect(
      siteConfig.projects.map(({ name, videoUrl }) => ({ name, videoUrl })),
    ).toEqual([
      {
        name: "MiniCode",
        videoUrl: "https://www.bilibili.com/video/BV1gijt6gErr",
      },
      {
        name: "Personal RAG",
        videoUrl: "https://www.bilibili.com/video/BV18Ejb6rESu",
      },
    ]);
  });

  it("renders demo video actions without outdated upcoming statuses", async () => {
    const projects = await readFile(
      resolve("src/components/Projects.astro"),
      "utf8",
    );

    expect(projects).toContain("project.videoUrl");
    expect(projects).toContain("演示视频");
    expect(projects).not.toContain("coming-soon");
  });

  it("ships verifiable resume and attribution assets", async () => {
    const resume = await readFile(resolve("public/resume.pdf"));
    expect(resume.subarray(0, 4).toString()).toBe("%PDF");

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

  it("provides a domain-safe Cloudflare Pages deploy command", async () => {
    const packageJson = JSON.parse(
      await readFile(resolve("package.json"), "utf8"),
    );
    const deployCommand = packageJson.scripts["deploy:pages"];

    expect(packageJson.devDependencies.wrangler).toBe("4.103.0");
    expect(deployCommand).toBe(
      "npm run build && wrangler pages deploy dist --project-name interview-portfolio-pages --branch main",
    );
    expect(deployCommand).not.toMatch(/--domain|--route|wjhdev\.cloud/);
  });
});
