const puppeteer = require('puppeteer');
const path = require('path');

async function capture() {
  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  const targets = [
    { url: 'https://voxora-ruddy.vercel.app/', name: '01-landing-hero.png', wait: 2000 },
    { url: 'https://voxora-ruddy.vercel.app/app', name: '02-user-dashboard.png', wait: 2000 },
    { url: 'https://voxora-ruddy.vercel.app/conversation', name: '03-conversation-arena.png', wait: 2500 },
    { url: 'https://voxora-ruddy.vercel.app/modes', name: '04-modes-scenarios.png', wait: 2000 },
    { url: 'https://voxora-ruddy.vercel.app/shadow', name: '05-shadow-studio.png', wait: 2000 },
    { url: 'https://voxora-ruddy.vercel.app/vocabulary', name: '06-vocabulary-vault.png', wait: 2000 },
    { url: 'https://voxora-ruddy.vercel.app/journal', name: '07-voice-journal.png', wait: 2000 },
    { url: 'https://voxora-ruddy.vercel.app/analytics', name: '08-analytics-diagnostics.png', wait: 2000 },
  ];

  for (const item of targets) {
    try {
      console.log(`Navigating to ${item.url}...`);
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, item.wait));
      const dest = path.join(__dirname, '..', 'public', 'screenshots', item.name);
      await page.screenshot({ path: dest, fullPage: false });
      console.log(`Saved screenshot: ${item.name}`);
    } catch (err) {
      console.error(`Failed to capture ${item.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture();
