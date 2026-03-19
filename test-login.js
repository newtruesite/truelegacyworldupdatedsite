import puppeteer from 'puppeteer';

const BASE = 'http://localhost:5177';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));

  try {
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0', timeout: 15000 });
    console.log('Login page title:', await page.title());

    const emailInput    = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitBtn     = await page.$('button[type="submit"]');

    console.log('Email input present:   ', !!emailInput);
    console.log('Password input present:', !!passwordInput);
    console.log('Submit button present: ', !!submitBtn);

    if (emailInput && passwordInput && submitBtn) {
      await emailInput.type('test@truelegacy.com');
      await passwordInput.type('testpassword123!');
      console.log('Credentials typed');

      await submitBtn.click();
      await new Promise(r => setTimeout(r, 3000));

      console.log('URL after submit:', page.url());

      // Surface any inline auth error text
      const msgEl = await page.$('[class*="text-red"], [class*="error"], [role="alert"]');
      if (msgEl) {
        const txt = await msgEl.evaluate(el => el.textContent?.trim());
        console.log('Auth response:', txt);
      }
    }

    if (jsErrors.length) {
      console.log('JS errors:\n', jsErrors.join('\n'));
    } else {
      console.log('No JS errors on login page');
    }
  } catch (e) {
    console.log('TEST ERROR:', e.message);
  }

  await browser.close();
})();
