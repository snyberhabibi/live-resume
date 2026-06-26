const { chromium, devices } = require("playwright");
const URL = process.argv[2] || "http://localhost:3000";

(async () => {
  const logs = [];
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--ignore-gpu-blocklist", "--enable-gpu", "--enable-unsafe-swiftshader", "--use-angle=default"],
  });
  const ctx = await browser.newContext({
    ...devices["iPhone 13"], // 390x844, dpr 3, mobile UA, hasTouch
  });
  const page = await ctx.newPage();
  page.on("console", (m) => logs.push(`[${m.type()}] ${m.text()}`));
  page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));

  await page.goto(URL, { waitUntil: "load", timeout: 40000 });
  await page.waitForTimeout(7000);

  const dims = await page.evaluate(() => ({
    vw: window.innerWidth,
    vh: window.innerHeight,
    sh: document.body.scrollHeight,
    canvas: !!document.querySelector("canvas"),
  }));
  console.log("MOBILE", URL, JSON.stringify(dims));

  await page.screenshot({ path: "/tmp/m_0_hero.png" });

  const steps = [
    ["1_origin", 0.2],
    ["2_builder", 0.4],
    ["3_corporate", 0.6],
    ["4_convergence", 0.8],
    ["5_contact", 1.0],
  ];
  for (const [name, frac] of steps) {
    await page.evaluate((f) => {
      const y = f * (document.body.scrollHeight - window.innerHeight);
      window.scrollTo(0, y);
    }, frac);
    await page.waitForTimeout(2800);
    await page.screenshot({ path: `/tmp/m_${name}.png` });
  }

  console.log("CONSOLE:", logs.length ? logs.join(" | ") : "(none)");
  await browser.close();
})().catch((e) => { console.error("ERR:", e.message); process.exit(1); });
