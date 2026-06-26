const { chromium } = require("playwright");
const URL = process.argv[2] || "https://live-resume-iota.vercel.app";

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
  await page.waitForTimeout(7000);
  const info = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    const ctx = c && (c.getContext("webgl2") || c.getContext("webgl"));
    return { hasCanvas: !!c, gl: ctx ? ctx.constructor.name : "none", title: document.title };
  });
  console.log("LIVE:", URL);
  console.log("INFO:", JSON.stringify(info));
  await page.mouse.move(756, 450);
  await page.screenshot({ path: "/tmp/lr_live_hero.png" });
  await page.mouse.wheel(0, 2850);
  await page.waitForTimeout(2800);
  await page.screenshot({ path: "/tmp/lr_live_mid.png" });
  console.log("CONSOLE:", logs.length ? logs.join(" | ") : "(none)");
  await browser.close();
})().catch((e) => { console.error("ERR:", e.message); process.exit(1); });
