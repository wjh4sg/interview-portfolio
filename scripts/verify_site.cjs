const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = "http://127.0.0.1:4321";
const screenshotDir = path.resolve("screenshots");
fs.mkdirSync(screenshotDir, { recursive: true });

async function verifyPage(page, viewportName) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 15_000 });
  await page.waitForSelector(".project-card", { timeout: 15_000 });

  const heading = await page.locator("h1").innerText();
  if (heading !== "把 AI 能力做成\n可验证的工程系统。") {
    throw new Error(`Unexpected heading: ${heading}`);
  }
  if ((await page.locator(".project-card").count()) !== 2) {
    throw new Error("Expected exactly two project cards.");
  }
  if ((await page.locator(".coming-soon").count()) !== 2) {
    throw new Error("Expected two upcoming demo labels.");
  }
  if ((await page.locator('a[href="/resume.pdf"]').count()) < 2) {
    throw new Error("Resume link is missing.");
  }

  const imageCount = await page.locator("img").count();
  for (let index = 0; index < imageCount; index += 1) {
    if (!(await page.locator("img").nth(index).getAttribute("alt"))) {
      throw new Error(`Image ${index} has no alt text.`);
    }
  }

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  if (hasHorizontalOverflow) {
    throw new Error(`${viewportName} has horizontal overflow.`);
  }
  if (errors.length) {
    throw new Error(`Browser errors: ${errors.join(" | ")}`);
  }

  await page.screenshot({
    path: path.join(screenshotDir, `${viewportName}.png`),
    fullPage: true,
  });
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await verifyPage(desktop, "desktop");

  await desktop.locator("#theme-toggle").click();
  if (
    (await desktop.locator("html").getAttribute("data-theme")) !== "light"
  ) {
    throw new Error("Theme toggle did not activate light mode.");
  }
  await desktop.reload({ waitUntil: "domcontentloaded" });
  if (
    (await desktop.locator("html").getAttribute("data-theme")) !== "light"
  ) {
    throw new Error("Theme preference did not persist.");
  }
  await desktop.locator("#theme-toggle").click();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await verifyPage(mobile, "mobile");

  for (const asset of [
    "/resume.pdf",
    "/images/minicode-architecture.svg",
    "/images/rag-architecture.svg",
  ]) {
    const response = await desktop.request.get(`${baseUrl}${asset}`);
    if (!response.ok()) {
      throw new Error(`${asset} returned ${response.status()}`);
    }
  }

  await browser.close();
  console.log("Browser verification passed for desktop and mobile.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
