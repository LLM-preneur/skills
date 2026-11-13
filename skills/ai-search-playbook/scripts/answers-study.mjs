#!/usr/bin/env node
// Which buyer questions ChatGPT search answers with a page from your site. Runs Apify's ChatGPT search scraper
// (about $0.004 a question) on a fixed question set and writes raw/<date>.json and summary-<date>.md next to it.
//   APIFY_TOKEN=... node answers-study.mjs --domain example.com --questions questions.json [--out dir] [--max-usd 0.2]
//   node answers-study.mjs --domain example.com --questions questions.json --from raw/2026-11-10.json   (no new run)
// questions.json is a JSON array of strings. Keep it the same between runs so the trend means something.
//
// Spend limits, checked before a run starts and while it runs, so a mistake cannot run up a bill:
//   at most LIMITS.questions questions, LIMITS.runUsd a run (Apify's maxTotalChargeUsd), LIMITS.minutes a run,
//   LIMITS.monthUsd a calendar month on this actor (from Apify's own run list), and one run a day.
// Use a token for this product alone, with a monthly limit set in Apify as well.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ACTOR = 'apify~chatgpt-search-scraper';
export const LIMITS = { questions: 60, runUsd: 0.5, monthUsd: 2, minutes: 30, perQuestionUsd: 0.004 };
const opt = (k) => { const i = process.argv.indexOf('--' + k); return i < 0 ? null : process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true; };
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };
const qOf = (it) => String(it.query || it.question || it.prompt || it.searchQuery || '').trim();
function urlsOf(it) {
  const out = [];
  const walk = (v) => { if (!v) return; if (typeof v === 'string') { if (/^https?:\/\//.test(v)) out.push(v); return; } if (Array.isArray(v)) return v.forEach(walk); if (typeof v === 'object') for (const x of Object.values(v)) walk(x); };
  walk(it);
  return [...new Set(out)];
}
const mine = (u, domain) => { const h = host(u); return h === domain || h.endsWith('.' + domain); };

// Pure: what one run says, per question and overall.
export function summarize(questions, items, { domain, date, costUsd = null }) {
  const srcCount = {};
  const rows = questions.map((q) => {
    const it = items.find((i) => qOf(i).toLowerCase() === q.toLowerCase());
    if (!it) return { q, answered: false, cited: false, pos: null, pages: [] };
    const urls = urlsOf(it);
    for (const h of new Set(urls.map(host).filter(Boolean))) srcCount[h] = (srcCount[h] || 0) + 1;
    const pos = urls.findIndex((u) => mine(u, domain));
    const pages = [...new Set(urls.filter((u) => mine(u, domain)).map((u) => new URL(u).pathname))];
    return { q, answered: true, cited: pos >= 0, pos: pos >= 0 ? pos + 1 : null, pages };
  });
  const topSources = Object.entries(srcCount).sort((a, b) => b[1] - a[1]).slice(0, 12);
  return { date, domain, engine: 'chatgpt', total: questions.length, answered: rows.filter((r) => r.answered).length, cited: rows.filter((r) => r.cited).length, costUsd, topSources, rows };
}

export function toMarkdown(s) {
  return `# ChatGPT answers study ${s.date}\n\n${s.domain} cited in ${s.cited} of ${s.total}${s.costUsd != null ? `, cost $${s.costUsd}` : ''}.\n\n| # | Question | ${s.domain} |\n|---|---|---|\n` +
    s.rows.map((r, i) => `| ${i + 1} | ${r.q} | ${r.cited ? `#${r.pos} ${r.pages.join(' ')}` : r.answered ? 'no' : 'no answer'} |`).join('\n') +
    `\n\n## Most cited sources\n\n` + s.topSources.map(([h, n]) => `- ${h}: ${n}`).join('\n') + '\n';
}

// Pure: may this run start? pastRuns are Apify runs of this actor ({ startedAt, usageTotalUsd }).
export function budgetCheck({ questions, pastRuns = [], now = Date.now(), maxUsd = LIMITS.runUsd }) {
  const cap = Math.min(Number(maxUsd) || LIMITS.runUsd, LIMITS.runUsd);
  if (!questions.length) return { ok: false, why: 'No questions.' };
  if (questions.length > LIMITS.questions) return { ok: false, why: `${questions.length} questions, the limit is ${LIMITS.questions}.` };
  const estimate = Math.round(questions.length * LIMITS.perQuestionUsd * 1000) / 1000;
  if (estimate > cap) return { ok: false, why: `Estimated $${estimate}, over the $${cap} cap for one run.` };
  const month = new Date(now).toISOString().slice(0, 7), day = new Date(now).toISOString().slice(0, 10);
  const runs = pastRuns.filter((r) => String(r.startedAt || '').slice(0, 7) === month);
  const spent = Math.round(runs.reduce((a, r) => a + (r.usageTotalUsd || 0), 0) * 1000) / 1000;
  if (runs.some((r) => String(r.startedAt).slice(0, 10) === day)) return { ok: false, why: 'A run already started today. One run a day.' };
  if (spent + cap > LIMITS.monthUsd) return { ok: false, why: `Spent $${spent} this month; one more run could pass the $${LIMITS.monthUsd} monthly limit.` };
  return { ok: true, cap, estimate, spent };
}

async function runApify(questions, token) {
  const api = (p, o = {}) => fetch('https://api.apify.com/v2' + p, { ...o, headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' } }).then((r) => r.json());
  const past = (await api(`/acts/${ACTOR}/runs?desc=1&limit=200`)).data?.items || [];
  const b = budgetCheck({ questions, pastRuns: past, maxUsd: opt('max-usd') });
  if (!b.ok) throw new Error('Not started. ' + b.why);
  console.log(`starting: ${questions.length} questions, about $${b.estimate}, capped at $${b.cap}; $${b.spent} spent this month of $${LIMITS.monthUsd}`);
  const q = `maxTotalChargeUsd=${b.cap}&maxItems=${questions.length}&timeout=${LIMITS.minutes * 60}`;
  let st = (await api(`/acts/${ACTOR}/runs?${q}`, { method: 'POST', body: JSON.stringify({ queries: questions.join('\n') }) })).data;
  if (!st?.id) throw new Error('Apify did not start a run. Check the token.');
  const t0 = Date.now();
  while (!['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(st.status)) {
    await new Promise((r) => setTimeout(r, 15000));
    st = (await api(`/actor-runs/${st.id}`)).data;
    if ((st.usageTotalUsd || 0) > b.cap || Date.now() - t0 > LIMITS.minutes * 60e3) {
      await api(`/actor-runs/${st.id}/abort`, { method: 'POST' });
      throw new Error(`Aborted: $${st.usageTotalUsd} spent after ${Math.round((Date.now() - t0) / 60e3)} minutes, over a limit.`);
    }
  }
  if (st.status !== 'SUCCEEDED') throw new Error('Apify run ' + st.status);
  return { items: await api(`/datasets/${st.defaultDatasetId}/items?format=json&clean=1`), costUsd: Math.round((st.usageTotalUsd || 0) * 1000) / 1000 };
}

const MAIN = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (MAIN) {
  const domain = String(opt('domain') || '').replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
  const qfile = opt('questions');
  if (!domain || !qfile) { console.log('Usage: APIFY_TOKEN=... node answers-study.mjs --domain example.com --questions questions.json'); process.exit(1); }
  const questions = JSON.parse(readFileSync(qfile, 'utf8'));
  const out = resolve(opt('out') || dirname(resolve(qfile)));
  const date = opt('date') || new Date().toISOString().slice(0, 10);
  let items, costUsd = opt('cost') ? Number(opt('cost')) : null;
  if (opt('from')) items = JSON.parse(readFileSync(opt('from'), 'utf8'));
  else {
    if (!process.env.APIFY_TOKEN) { console.log('Set APIFY_TOKEN (a token for this product, read from your secret store).'); process.exit(1); }
    ({ items, costUsd } = await runApify(questions, process.env.APIFY_TOKEN));
    mkdirSync(`${out}/raw`, { recursive: true });
    writeFileSync(`${out}/raw/${date}.json`, JSON.stringify(items));
  }
  const s = summarize(questions, items, { domain, date, costUsd });
  writeFileSync(`${out}/summary-${date}.md`, toMarkdown(s));
  writeFileSync(`${out}/summary-${date}.json`, JSON.stringify(s, null, 2));
  console.log(`${domain} cited in ${s.cited}/${s.total}${costUsd != null ? ` for $${costUsd}` : ''}. Summary: ${out}/summary-${date}.md`);
}
