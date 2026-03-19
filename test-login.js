import puppeteer from 'puppeteer';

const BASE = 'http://localhost:5177';

function randomEmail() {
  return `test_${Date.now()}@truelegacy-test.com`;
}

async function testSignup(page) {
  console.log('\n=== SIGNUP TEST ===');
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0', timeout: 15000 });

  // Switch to signup mode
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await btn.evaluate(el => el.textContent?.trim());
    if (text === 'Create account' || text === 'Crear cuenta' || text === 'Créer un compte') {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 300));

  const email = randomEmail();
  const password = 'TestPass123!';

  await page.$eval('input[type="email"]', (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, email);
  await page.$eval('input[type="email"]', el => el.blur());

  const pwInputs = await page.$$('input[type="password"]');
  if (pwInputs.length >= 2) {
    await pwInputs[0].type(password);
    await pwInputs[1].type(password);
  } else if (pwInputs.length === 1) {
    await pwInputs[0].type(password);
  }
  console.log('Signup form filled with:', email);

  const submitBtn = await page.$('button[type="submit"]');
  await submitBtn.click();
  await new Promise(r => setTimeout(r, 4000));

  const finalUrl = page.url();
  console.log('URL after signup:', finalUrl);

  if (finalUrl.includes('/training') || finalUrl.includes('/login') === false) {
    console.log('SUCCESS: Redirected after signup (instant auth working)');
  } else {
    const successEl = await page.$('[class*="green"]');
    const errorEl   = await page.$('[class*="red-4"]');
    if (successEl) {
      const txt = await successEl.evaluate(el => el.textContent?.trim());
      console.log('Signup success message:', txt);
      if (txt && txt.toLowerCase().includes('logged in')) {
        console.log('SUCCESS: Instant auth message confirmed');
      }
    }
    if (errorEl) {
      const txt = await errorEl.evaluate(el => el.textContent?.trim());
      console.log('FAILURE - Error shown:', txt);
    }
  }
  return email;
}

async function testLogin(page, email, password) {
  console.log('\n=== LOGIN TEST ===');
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0', timeout: 15000 });
  console.log('Login page title:', await page.title());

  const emailInput    = await page.$('input[type="email"]');
  const passwordInput = await page.$('input[type="password"]');
  const submitBtn     = await page.$('button[type="submit"]');

  console.log('Email input present:   ', !!emailInput);
  console.log('Password input present:', !!passwordInput);
  console.log('Submit button present: ', !!submitBtn);

  if (emailInput && passwordInput && submitBtn) {
    await emailInput.type(email);
    await passwordInput.type(password);
    console.log('Credentials typed for:', email);

    await submitBtn.click();
    await new Promise(r => setTimeout(r, 3000));

    const finalUrl = page.url();
    console.log('URL after login:', finalUrl);

    if (finalUrl.includes('/training')) {
      console.log('SUCCESS: Logged in and redirected to /training');
    } else {
      const msgEl = await page.$('[class*="text-red"], [class*="red-4"], [role="alert"]');
      if (msgEl) {
        const txt = await msgEl.evaluate(el => el.textContent?.trim());
        console.log('Auth response:', txt);
        if (txt && txt.toLowerCase().includes('confirm')) {
          console.log('FAILURE: Confirmation message shown (should not appear)');
        }
      }
    }
  }
}

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));

  try {
    const signupEmail = await testSignup(page);
    await testLogin(page, signupEmail, 'TestPass123!');

    // Also test with dummy credentials to confirm no confirmation prompt
    console.log('\n=== INVALID CREDENTIALS TEST ===');
    await testLogin(page, 'nonexistent@test.com', 'wrongpassword');
  } catch (e) {
    console.log('TEST ERROR:', e.message);
  }

  if (jsErrors.length) {
    console.log('\nJS errors:\n', jsErrors.join('\n'));
  } else {
    console.log('\nNo JS errors detected');
  }

  await browser.close();
})();
