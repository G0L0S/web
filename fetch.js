import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://pravanagolos.yonote.ru/share/c83e26b4-7930-4a86-90ed-f0e6f256e7f7', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 5000));
  const content = await page.content();
  console.log(content);
  await browser.close();
})();
