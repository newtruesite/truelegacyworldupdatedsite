import fs from 'fs'
import path from 'path'

const ROOT_DIR = path.resolve(process.cwd(), 'src')
const IGNORE_FILES = [path.join(ROOT_DIR, 'lib', 'translations.ts')]

// English phrases that should not appear as raw literals in UI code
const PHRASES = [
  'Home',
  'Join',
  'Login',
  'Sign in',
  'Sign up',
  'Download',
  'Learn more',
  'Learn More',
  'Explore',
  'Start',
  'Scroll',
  'The Leaders',
  'Talk to',
  'Distributor',
  'Subscribe',
  'Newsletter',
  'Search',
  'Submit',
  'Cancel',
  'Continue',
  'Next',
  'Previous',
  'Back',
]

function isTsxFile(file) {
  return file.endsWith('.tsx') || file.endsWith('.ts')
}

function walk(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath, callback)
    } else if (entry.isFile() && isTsxFile(fullPath)) {
      callback(fullPath)
    }
  }
}

function checkFile(filePath) {
  if (IGNORE_FILES.includes(filePath)) return []
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  const findings = []
  lines.forEach((line, index) => {
    // Ignore lines that are already conditioned on locale (Spanish translations are allowed)
    if (/locale\s*===\s*['"]es['"]/.test(line) || /isEs\b/.test(line) || /t\[locale\]/.test(line) || /copy\./.test(line)) {
      return
    }

    PHRASES.forEach((phrase) => {
      const patterns = [
        `'${phrase}'`,
        `"${phrase}"`,
        `\`${phrase}\``,
      ]
      if (patterns.some((p) => line.includes(p))) {
        findings.push({ line: index + 1, phrase, lineText: line.trim() })
      }
    })
  })
  return findings
}

const results = []
walk(ROOT_DIR, (file) => {
  const fileFindings = checkFile(file)
  if (fileFindings.length) {
    results.push({ file, findings: fileFindings })
  }
})

if (results.length === 0) {
  console.log('✅ No unchecked English string literals found in .tsx/.ts files (excluding translations).')
  process.exit(0)
}

console.log('⚠️  Found raw English string literals in the following files:')
results.forEach(({ file, findings }) => {
  console.log(`\n${file}`)
  findings.forEach(({ line, phrase, lineText }) => {
    console.log(`  ${line}: ${phrase} → ${lineText}`)
  })
})

process.exit(1)
