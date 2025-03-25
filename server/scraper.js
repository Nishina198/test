const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function scrapeGoogle(query) {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, {
        waitUntil: "domcontentloaded"
    });

    if (await page.$('input[name="captcha"]')) {
        console.error("Google zablokoval přístup! Otevřete prohlížeč ručně a zadejte CAPTCHA.");
        await browser.close();
        throw new Error("Google CAPTCHA detected. Solve it manually.");
    }

    await page.waitForSelector('div.yuRUbf', { timeout: 30000 }).catch(() => {
        console.warn("Google mohl změnit HTML. Zkontrolujte selektory.");
    });

    const results = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div.yuRUbf')).map(el => ({
            title: el.querySelector('h3')?.innerText || "No title",
            link: el.querySelector('a')?.href || "No link"
        }));
    });

    await browser.close();
    return results;
}

module.exports = scrapeGoogle;
