/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CJS script, run outside the app bundle */
// Static extraction of the English strings that flow through tx(), with their Thai twin and
// source files. Feeds scripts/export_translations.py (reviewer CSV).
//
//   node scripts/i18n_extract_strings.cjs src/i18n/drafts/_sources.json <files...>
//   (scripts/export_translations.py runs it for you over src/app/(frontend), src/components, src/content)
//
// Collected:
//   - every string literal in the en-branch (3rd arg) of tx(locale, th, en) / useTx's tx(...)
//   - every string in exported *En objects under src/content/ (paired with the matching *Th object)
// Thai twin: when the th-branch has the same shape (literal <-> literal, object/array <-> object/array)
// the Thai string at the same position is recorded.
const ts = require('typescript')
const fs = require('fs')
const path = require('path')

const out = process.argv[2]
const files = process.argv.slice(3)
const found = {} // en -> { th: Set, files: Set }

function isNonText(s) {
  const t = s.trim()
  if (!t || !/[a-z]/.test(t)) return true
  if (/^(\/|#|https?:|mailto:|tel:|data:)/.test(t)) return true
  if (/^[a-z0-9_\-.:/#?=&@]+$/.test(t)) return true
  if (/^[a-z]+[A-Z][A-Za-z0-9]*$/.test(t)) return true
  if (/\.(jpe?g|png|webp|svg|pdf)$/i.test(t)) return true
  return false
}
const SKIP_PROPS = new Set(['href', 'icon', 'image', 'src', 'key', 'id', 'slug', 'tone', 'variant', 'media', 'value', 'code', 'lang', 'className'])

function add(en, th, file) {
  if (isNonText(en)) return
  const e = (found[en] ??= { th: new Set(), files: new Set() })
  if (th && th !== en) e.th.add(th)
  e.files.add(file)
}
const strip = (n) => {
  while (n && (ts.isParenthesizedExpression(n) || ts.isAsExpression(n) || (ts.isSatisfiesExpression && ts.isSatisfiesExpression(n)))) n = n.expression
  return n
}
const lit = (n) => (n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) ? n.text : null)

// Walk en (and th in parallel when shapes match).
function pair(en, th, file, sf) {
  en = strip(en)
  th = strip(th)
  const s = lit(en)
  if (s !== null) return add(s, lit(th), file)
  if (ts.isObjectLiteralExpression(en)) {
    const thProps = new Map()
    if (th && ts.isObjectLiteralExpression(th))
      for (const p of th.properties) if (ts.isPropertyAssignment(p)) thProps.set(p.name.getText(sf), p.initializer)
    for (const p of en.properties) {
      if (!ts.isPropertyAssignment(p)) continue
      const name = p.name.getText(sf)
      if (SKIP_PROPS.has(name)) continue
      pair(p.initializer, thProps.get(name), file, sf)
    }
    return
  }
  if (ts.isArrayLiteralExpression(en)) {
    const thEls = th && ts.isArrayLiteralExpression(th) ? th.elements : []
    en.elements.forEach((el, i) => pair(el, thEls[i], file, sf))
    return
  }
  collectLoose(en, file, sf)
}
// Anything else (JSX, conditionals, nested calls): collect literals without a Thai twin.
function collectLoose(n, file, sf) {
  if (ts.isJsxAttribute(n) && n.name.getText(sf) === 'className') return
  if (ts.isPropertyAssignment(n) && SKIP_PROPS.has(n.name.getText(sf))) return
  if (ts.isCallExpression(n) && n.expression.getText(sf) === 'tx' && n.arguments.length === 3) {
    return pair(n.arguments[2], n.arguments[1], file, sf)
  }
  const s = lit(n)
  if (s !== null) {
    const p = n.parent
    if (p && ts.isPropertyAssignment(p) && p.name === n) return
    if (p && ts.isJsxAttribute(p)) return
    return add(s, null, file)
  }
  ts.forEachChild(n, (c) => collectLoose(c, file, sf))
}

for (const file of files) {
  if (!/\.(tsx?|cts|mts)$/.test(file)) continue
  const src = fs.readFileSync(file, 'utf8')
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const rel = path.relative(process.cwd(), file)
  const decls = new Map()
  const visitDecl = (n) => {
    if (ts.isVariableDeclaration(n) && n.initializer) decls.set(n.name.getText(sf), n.initializer)
    ts.forEachChild(n, visitDecl)
  }
  visitDecl(sf)
  const visit = (n) => {
    if (ts.isCallExpression(n) && n.expression.getText(sf) === 'tx' && n.arguments.length === 3) {
      pair(n.arguments[2], n.arguments[1], rel, sf)
      return
    }
    if (rel.includes('content/') && ts.isVariableDeclaration(n) && /En$/.test(n.name.getText(sf)) && n.initializer) {
      pair(n.initializer, decls.get(n.name.getText(sf).replace(/En$/, 'Th')), rel, sf)
      return
    }
    ts.forEachChild(n, visit)
  }
  visit(sf)
}
const res = {}
for (const k of Object.keys(found).sort()) res[k] = { th: [...found[k].th][0] ?? '', files: [...found[k].files].sort() }
fs.writeFileSync(out, JSON.stringify(res, null, 1) + '\n')
console.log('strings:', Object.keys(res).length, 'with Thai twin:', Object.values(res).filter((v) => v.th).length)
