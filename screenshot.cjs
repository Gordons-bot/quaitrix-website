const puppeteer = require('puppeteer');

(async () => {
  const url = process.argv[2];
  const width = parseInt(process.argv[3]);
  const outputPath = process.argv[4];
  
  if (!url || !width || !outputPath) {
    console.error('Usage: node screenshot.js <url> <width> <output-path>');
    process.exit(1);
  }
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width, height: 800, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  
  await page.screenshot({ path: outputPath, fullPage: true });
  
  await browser.close();
  console.log(`Screenshot saved to ${outputPath}`);
})();
