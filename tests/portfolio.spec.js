import { test, expect } from "@playwright/test";

test("standard terminal, history, completion, Markdown and mode switch", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  const input = page.locator("#terminalInput");
  const output = page.locator("#terminalOutput");
  await expect(output).not.toContainText('\\n');
  const command = async (value) => {
    await input.fill(value);
    await input.press("Enter");
  };
  await command("pwd");
  await expect(output).toContainText("/home/aayush");
  await command("cd projects");
  await expect(page.locator("#terminalPath")).toHaveText("~/projects");
  await command("cat obsidian.md");
  await expect(output.locator("h3")).toHaveText("Obsidian");
  await input.press("ArrowUp");
  await expect(input).toHaveValue("cat obsidian.md");
  await input.fill("he");
  await input.press("Tab");
  await expect(input).toHaveValue("help");
  await command("clear");
  await expect(output).toBeEmpty();
  await command("tree");
  await expect(output).toContainText("web-application-firewall.md");
  await page.locator("#studioToggle").click();
  await expect(page).toHaveURL(/studio.html$/);
  await expect(page.locator("#chapterCounter")).toHaveText("01 / 06");
  expect(errors).toEqual([]);
});

test("project walkthroughs and credential filters preserve state", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/studio.html");
  await page.locator("#obsNext").click();
  await expect(page.locator("#obsResultTitle")).toHaveText(
    "6 reports → 3 issues",
  );
  await page.locator("#obsNext").click();
  await expect(page.locator("#obsTitle")).toHaveText(
    "Close the exposure. Check again.",
  );
  await page.locator("#obsNext").click();
  await expect(page.locator("#obsBack")).toBeDisabled();
  await page.locator(".project-tab").nth(1).click();
  await page.locator("#fileLocation").fill("60");
  await expect(page.locator("#fileState")).toHaveText("Locked");
  await page.locator("#fileLocation").fill("0");
  await expect(page.locator("#fileState")).toHaveText("Unlocked");
  await page.locator("#correctKey").uncheck();
  await expect(page.locator("#fileState")).toHaveText("Locked");
  await page.locator(".project-tab").nth(2).click();
  await page.locator("#sendSafe").click();
  await expect(page.locator("#websiteNode")).toHaveText("Received");
  await page.locator("#sendSqli").click();
  await expect(page.locator("#websiteNode")).toHaveText("Protected");
  await page.locator("#sendXss").click();
  await expect(page.locator("#requestPacket")).toHaveText(
    "Blocked · script injection",
  );
  await page.locator('[data-credential-filter="credential"]').click();
  await expect(page.locator("#credentialCounter")).toHaveText("1 / 14");
  await page.locator("#previousCredential").click();
  await expect(page.locator("#credentialCounter")).toHaveText("14 / 14");
  await page.locator('[data-credential-filter="challenge"]').click();
  await expect(page.locator("#credentialCounter")).toHaveText("1 / 4");
  await page.locator('[data-credential-filter="practice"]').click();
  await expect(page.locator("#credentialCounter")).toHaveText("1 / 1");
  expect(errors).toEqual([]);
});

test("native snapping settles without fighting interrupted scrolling", async ({
  page,
}) => {
  await page.goto("/studio.html");
  await page.locator("#nextChapter").click();
  await expect(page.locator("#chapterCounter")).toHaveText("02 / 06");
  await expect
    .poll(() =>
      page
        .locator("#frontend")
        .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
    )
    .toBe(0);
  await page.locator("#studioScroll").focus();
  await page.keyboard.press("End");
  await expect(page.locator("#chapterCounter")).toHaveText("06 / 06");
  await expect(page.locator("#nextChapter")).toBeDisabled();
  await page.keyboard.press("Home");
  await expect(page.locator("#chapterCounter")).toHaveText("01 / 06");
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, 650);
  await page.mouse.wheel(0, -100);
  await expect
    .poll(() =>
      page.locator("#studioScroll").evaluate((el) => {
        return Math.min(
          ...Array.from(el.querySelectorAll(".scene"), (s) =>
            Math.abs(s.getBoundingClientRect().top),
          ),
        );
      }),
    )
    .toBeLessThan(2);
});

for (const width of [375, 768]) {
  test(`controls fit without horizontal scrolling at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/studio.html");
    for (const selector of [".project-tabs", ".credential-filter"]) {
      expect(
        await page
          .locator(selector)
          .evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
    }
    await expect(page.locator("#credentialIndex")).toHaveCount(0);
    await page.locator(".project-tab").nth(1).click();
    await expect(page.locator("#projectCounter")).toHaveText("2 / 3");
    await page.locator('[data-credential-filter="challenge"]').click();
    await expect(page.locator("#credentialCounter")).toHaveText("1 / 4");
  });
}
