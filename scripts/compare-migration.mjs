// Optional visual parity audit against the pre-migration site served at :4174.
// Keep original checkout outside the build output when auditing future migrations.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const browser = await chromium.launch();
const failures = [];
fs.mkdirSync("test-results/parity", { recursive: true });
for (const width of [1440, 768, 375]) {
  for (const route of ["index.html", "studio.html"]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const pages = await Promise.all(
      [4174, 5173].map(async (port) => {
        const page = await context.newPage();
        page.on("pageerror", (error) => failures.push(error.message));
        await page.goto(`http://127.0.0.1:${port}/${route}`);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            [...document.images].map((img) => img.decode().catch(() => {})),
          );
        });
        await page.addStyleTag({
          content:
            "* { scroll-behavior: auto !important; caret-color: transparent !important; }",
        });
        await page.evaluate(() => document.activeElement?.blur());
        // Let the browser's original autofocus scroll complete before resetting it.
        await page.waitForTimeout(1000);
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: "instant" }),
        );
        return page;
      }),
    );
    const selectors =
      route === "index.html"
        ? [".wrap"]
        : [
            "#intro",
            "#frontend",
            "#projects",
            "#credentials",
            "#delivery",
            "#connect",
          ];
    for (const selector of selectors) {
      const screenshots = [];
      const geometry = [];
      for (const [index, page] of pages.entries()) {
        if (route === "studio.html") {
          await page.locator(selector).evaluate((el) => {
            const scroller = document.querySelector("#studioScroll");
            scroller.scrollTo({ top: el.offsetTop, behavior: "instant" });
          });
        }
        await page.evaluate(
          () =>
            new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve)),
            ),
        );
        geometry.push(
          await page.locator(selector).evaluate((el) =>
            [...el.querySelectorAll("*")].map((node) => {
              const r = node.getBoundingClientRect();
              return [
                node.tagName,
                node.id,
                ...[r.x, r.y, r.width, r.height].map(
                  (n) => Math.round(n * 100) / 100,
                ),
              ];
            }),
          ),
        );
        const options = {
          animations: "disabled",
          path: `test-results/parity/${width}-${selector.slice(1)}-${index}.png`,
        };
        screenshots.push(
          await page.screenshot({ ...options, fullPage: route === "index.html" }),
        );
      }
      const sameGeometry =
        JSON.stringify(geometry[0]) === JSON.stringify(geometry[1]);
      const samePixels = screenshots[0].equals(screenshots[1]);
      console.log(
        `${width} ${selector}: geometry ${sameGeometry ? "identical" : "DIFF"}, pixels ${samePixels ? "identical" : "DIFF"}`,
      );
      if (!sameGeometry) {
        const diffs = geometry[0].flatMap((row, i) =>
          JSON.stringify(row) === JSON.stringify(geometry[1][i])
            ? []
            : [[row, geometry[1][i]]],
        );
        console.log(JSON.stringify(diffs.slice(0, 4)));
      }
      if (!samePixels || !sameGeometry) failures.push(`${width} ${selector}`);
    }
    await context.close();
  }
}
await browser.close();
if (failures.length) {
  console.error(failures);
  process.exitCode = 1;
}
