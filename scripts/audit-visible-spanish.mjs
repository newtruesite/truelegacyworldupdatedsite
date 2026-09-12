import puppeteer from 'puppeteer'
import fs from 'node:fs'

const routes = [
  '/', '/products', '/training', '/distributors', '/events',
  '/d/mehdi-cohen', '/d/mehdi-cohen/kangen', '/d/mehdi-cohen/emguarde',
  '/d/mehdi-cohen/duo', '/d/mehdi-cohen/anespa', '/d/mehdi-cohen/ukon',
  '/d/mehdi-cohen/beaute', '/d/mehdi-cohen/wagyu', '/d/mehdi-cohen/jr4',
  '/d/mehdi-cohen/business', '/d/mehdi-cohen/training', '/d/mehdi-cohen/products',
]

const base = process.env.TRUE_LEGACY_AUDIT_BASE || 'http://127.0.0.1:5173'

const commonEnglish = /\b(home|training|events|distributors|products|countries|community|login|join the team|buy now|learn more|watch|back|ask about|explore|contact|submit|full name|email address|phone number|country|privacy|frequently asked|how it works|what is|why|next|previous|download|open presentation)\b/i
const browser = await puppeteer.launch({ headless: true })
const report = {}
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1000 })
  for (const route of routes) {
    await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.evaluate(() => {
      localStorage.setItem('tl_lang', 'es')
      sessionStorage.setItem('tl_user_chose_lang', 'true')
    })
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 })
    await new Promise(resolve => setTimeout(resolve, 250))
    const result = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      title: document.title,
      lines: document.body.innerText.split('\n').map(value => value.trim()).filter(Boolean),
    }))
    const english = [...new Set(result.lines.filter(line => commonEnglish.test(line)))].slice(0, 80)
    report[route] = result
    console.log(`\n### ${route} [lang=${result.lang}] ${result.title}`)
    english.forEach(line => console.log(line))
  }
  fs.writeFileSync('/private/tmp/truelegacy-spanish-visible.json', JSON.stringify(report, null, 2))
} finally {
  await browser.close()
}
