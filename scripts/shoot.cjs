const { chromium } = require("playwright");

(async () => {
  const logs = [];
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: [
      "--ignore-gpu-blocklist",
      "--enable-gpu",
      "--enable-unsafe-swiftshader",
      "--use-angle=default",
    ],
  });
  const page = await browser.newPage({
    viewport: { width: 1512, height: 900 },
    deviceScaleFactor: 1,
  });
  page.on("console", (m) => logs.push(`[${m.type()}] ${m.text()}`));
  page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));

  await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(6500); // preloader (1.7s) + ready + intro morph (1.7s) + buffer

  const info = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    let gl = "no-canvas";
    if (c) {
      const ctx = c.getContext("webgl2") || c.getContext("webgl");
      gl = ctx ? ctx.constructor.name : "no-context";
    }
    return { hasCanvas: !!c, w: c && c.width, h: c && c.height, gl, bodyH: document.body.scrollHeight };
  });
  console.log("PAGE INFO:", JSON.stringify(info));

  await page.mouse.move(756, 450);
  await page.screenshot({ path: "/tmp/lr_0_hero.png" });

  const labels = ["1_origin", "2_builder", "3_corporate", "4_convergence", "5_contact"];
  for (let i = 0; i < labels.length; i++) {
    await page.mouse.wheel(0, 950);
    await page.waitForTimeout(2600); // lenis settle + morph
    await page.screenshot({ path: `/tmp/lr_${labels[i]}.png` });
  }

  console.log("\n=== CONSOLE / ERRORS ===");
  console.log(logs.length ? logs.join("\n") : "(none)");

  await browser.close();
})().catch((e) => {
  console.error("SCRIPT ERROR:", e);
  process.exit(1);
});
