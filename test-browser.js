import puppeteer from 'puppeteer';
import * as fs from 'fs';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.log('GOTO ERR', e));

    const html = await page.content();
    fs.writeFileSync('test-dump.html', html);
    console.log('HTML written, length:', html.length);

    await browser.close();
})();
