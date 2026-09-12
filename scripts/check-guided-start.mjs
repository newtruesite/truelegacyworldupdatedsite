// Local UI regression check. Supabase responses are fixtures; no member data is changed.
import assert from 'node:assert/strict'
import puppeteer from 'puppeteer'
import { followUpQueue, leadNextStep } from '../src/lib/todayGuidance.ts'

const base = 'http://127.0.0.1:5187'
const now = new Date()
const yesterday = new Date(now.getTime() - 86400000).toISOString()
const lead = { id: 'fixture-lead', assigned_distributor_id: 'fixture-distributor', full_name: 'Sample Contact', email: 'sample@example.test', interest: 'product', status: 'new', next_follow_up_at: yesterday, submitted_at: yesterday }
assert.deepEqual(followUpQueue([lead, { ...lead, id: 'closed', status: 'closed' }, { ...lead, id: 'converted', status: 'converted' }], now).map(x => x.id), [lead.id])
assert.match(leadNextStep({ status: 'qualified' }), /mentor/)

const browser = await puppeteer.launch({ headless: true })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1100 })
  let user = { id: 'fixture-user', email: 'sample@example.test', aud: 'authenticated', role: 'authenticated', user_metadata: {}, app_metadata: {} }
  let failSave = false
  let inactive = false
  let partial = false
  let failLeads = false
  let saveCount = 0
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.setRequestInterception(true)
  page.on('request', async request => {
    const url = new URL(request.url())
    if (url.hostname === '127.0.0.1') return request.continue()
    if (!url.hostname.endsWith('.supabase.co')) return request.abort()
    if (request.method() === 'OPTIONS') return request.respond({ status: 200, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET, POST, PUT, OPTIONS' } })
    let body = []
    let status = 200
    if (url.pathname.includes('/auth/v1/user')) {
      if (request.method() === 'PUT') {
        saveCount++
        if (failSave) { status = 400; body = { message: 'Fixture save failure' } }
        else { user = { ...user, user_metadata: { ...user.user_metadata, ...JSON.parse(request.postData()).data } }; body = user }
      } else body = user
    } else if (url.pathname.endsWith('/crm_memberships')) body = { user_id: user.id, active: !inactive, role: 'distributor', distributor_id: 'fixture-distributor' }
    else if (url.pathname.endsWith('/crm_distributors')) body = [{ id: 'fixture-distributor', auth_user_id: user.id, display_name: 'Sample Member', slug: 'sample-member', active: true }]
    else if (url.pathname.endsWith('/crm_leads')) { body = [lead]; if (failLeads) { status = 400; body = { message: 'Fixture load failure' } } }
    else if (partial && url.pathname.endsWith('/crm_training_modules')) { status = 400; body = { message: 'Fixture module failure' } }
    await request.respond({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET, POST, PUT, OPTIONS' }, body: JSON.stringify(body) })
  })
  await page.goto(base + '/app/today')
  await page.waitForFunction(() => document.body.innerText.includes('Distributor login required'))
  await page.evaluate(user => localStorage.setItem('true-legacy-world-crm-auth', JSON.stringify({ access_token: 'fixture-access-token', refresh_token: 'fixture-refresh-token', token_type: 'bearer', expires_at: Math.floor(Date.now() / 1000) + 3600, user })), user)
  await page.reload()
  await page.waitForSelector('#starting-plan-title')
  const clickText = async text => page.evaluate(text => { const button = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === text); if (!button) throw new Error('Missing button: ' + text); button.click() }, text)
  await clickText('Get started')
  await page.select('select', 'business')
  await clickText('Save my plan')
  await page.waitForFunction(() => document.body.innerText.includes('Your starting plan is saved'), { timeout: 10000 }).catch(async error => { console.log({ saveCount, user, page: await page.$eval('body', element => element.innerText) }); throw error })
  assert.equal(saveCount, 1)
  assert.equal(user.user_metadata.tl_starting_plan.focus, 'business')
  await page.reload()
  await page.waitForFunction(() => document.querySelector('#starting-plan-title')?.textContent === 'Build my business')
  assert.equal(await page.$$eval('a[href="/crm?contact=fixture-lead"]', links => links.length), 1)
  assert.equal(await page.$eval('body', element => element.innerText.includes('Introduce yourself and ask')), true)
  await page.screenshot({ path: '/private/tmp/truelegacy-guided-start-desktop.png', fullPage: true })
  await clickText('Change my plan')
  failSave = true
  await page.select('select', 'leadership')
  await clickText('Save my plan')
  await page.waitForSelector('[role="alert"]')
  assert.equal(await page.$eval('select', select => select.value), 'leadership')
  await page.setViewport({ width: 390, height: 844 })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  await page.screenshot({ path: '/private/tmp/truelegacy-guided-start-mobile.png', fullPage: true })
  partial = true
  await page.reload()
  await page.waitForFunction(() => document.body.innerText.includes('Some call or learning progress could not load'))
  assert.equal(await page.$$eval('a[href="/crm?contact=fixture-lead"]', links => links.length), 1)
  failLeads = true
  await page.reload()
  await page.waitForFunction(() => document.body.innerText.includes('Your daily plan could not load'))
  failLeads = false
  await clickText('Try again')
  await page.waitForSelector('#starting-plan-title')
  inactive = true
  await page.reload()
  await page.waitForFunction(() => document.body.innerText.includes('Account not authorized'))
  assert.equal(await page.$('#starting-plan-title'), null)
  assert.deepEqual(errors, [])
  console.log('PASS: queue rules, signed-out gate, saved preference/reload, failed-save retention, mobile layout, partial-data fallback, retry, inactive-member gate, no browser exceptions. Supabase is mocked; real account persistence is not verified.')
} finally { await browser.close() }
