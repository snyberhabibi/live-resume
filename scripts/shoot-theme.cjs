const { chromium } = require("playwright");
const URL = process.argv[2] || "http://localhost:3000";

(async () => {
  const logs = [];
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--ignore-gpu-blocklist", "--enable-gpu", "--enable-unsafe-swiftshader", "--use-angle=default"],
  });
  const page = await browser.newPage({ viewport: { width: 1512, height: 900 } });
  page.on("console", (m) => logs.push(`[${m.type()}] ${m.text()}`));
  page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));

  await page.goto(URL, { waitUntil: "load", timeout: 40000 });
  await page.waitForTimeout(6500);
  await page.mouse.move(756, 450);
  await page.screenshot({ path: "/tmp/th_dark_hero.png" });

  // scroll to corporate (dark) to confirm solid forms
  await page.mouse.wheel(0, 2850);
  await page.waitForTimeout(2600);
  await page.screenshot({ path: "/tmp/th_dark_corp.png" });

  // back to top, flip to light
  await page.mouse.wheel(0, -3000);
  await page.waitForTimeout(2000);
  const toggle = await page.$('button[aria-label="Switch to light theme"]');
  if (toggle) await toggle.click();
  else logs.push("[warn] light toggle not found");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "/tmp/th_light_hero.png" });

  // light theme: origin + builder
  await page.mouse.wheel(0, 950);
  await page.waitForTimeout(2400);
  await page.screenshot({ path: "/tmp/th_light_origin.png" });
  await page.mouse.wheel(0, 950);
  await page.waitForTimeout(2400);
  await page.screenshot({ path: "/tmp/th_light_builder.png" });

  console.log("CONSOLE:", logs.length ? logs.join(" | ") : "(none)");
  await browser.close();
})().catch((e) => {
  console.error("ERR:", e.message);
  process.exit(1);
});
