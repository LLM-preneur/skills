#!/usr/bin/env node
// ArtifactSend from the command line: add the MCP server to your agents, send a file as a tracked link,
// read who opened it, or bridge stdio-only MCP clients to https://artifactsend.com/mcp. No dependencies.
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import { join, dirname, basename, extname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';

const ORIGIN = (process.env.ARTIFACTSEND_URL || 'https://artifactsend.com').replace(/\/$/, '');
const MCP = ORIGIN + '/mcp';
const SKILLS = 'LLM-preneur/skills';
const VERSION = '1.0.0';
const [cmd, ...rest] = process.argv.slice(2);

const HELP = `ArtifactSend: the link that tells you who read it.

  npx artifactsend setup            Add ArtifactSend to Claude Code, Cursor, VS Code, Windsurf, Gemini CLI and Codex
  npx artifactsend send <file>      Share a file as a tracked link (HTML, Markdown, PDF, Word, PowerPoint, Excel, JSX)
      --title "Seed deck"  --access public|email|verified  --allow @acme.com,dana@x.com
      --expires 14  --folder Investors  --ai questions|full|off  --link <existing link to update>
  npx artifactsend links            Your links with views and last open
  npx artifactsend report <link>    Who read it, how far, time per section, what they asked
  npx artifactsend mcp              Run as a stdio MCP server (bridges to ${MCP})

send, links, report and mcp need ARTIFACTSEND_TOKEN (make one at ${ORIGIN}/app/settings).
In Claude Code you can skip the token: claude mcp add --transport http artifactsend ${MCP}, then /mcp to sign in.
Claude.ai and ChatGPT: add a custom connector with the URL ${MCP}.`;

const flags = (args) => {
  const o = { _: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) { const k = a.slice(2); const n = args[i + 1]; if (n === undefined || n.startsWith('--')) o[k] = true; else { o[k] = n; i++; } } else o._.push(a);
  }
  return o;
};

// ---------- setup ----------
const readJson = (f) => { if (!existsSync(f)) return {}; const t = readFileSync(f, 'utf8').trim(); return t ? JSON.parse(t) : {}; };
const writeJson = (f, o) => { mkdirSync(dirname(f), { recursive: true }); if (existsSync(f)) copyFileSync(f, f + '.bak'); writeFileSync(f, JSON.stringify(o, null, 2) + '\n'); };
const has = (bin) => spawnSync(platform() === 'win32' ? 'where' : 'which', [bin], { stdio: 'ignore' }).status === 0;

function addJson(label, file, key, entry, dirMustExist) {
  if (!existsSync(dirMustExist)) return null;
  let o;
  try { o = readJson(file); } catch { return `${label}: skipped, ${file} is not plain JSON. Add ${JSON.stringify({ artifactsend: entry })} under "${key}" yourself.`; }
  o[key] = o[key] || {};
  if (o[key].artifactsend) return `${label}: already added`;
  o[key].artifactsend = entry;
  writeJson(file, o);
  return `${label}: added to ${file}`;
}

function setup(opts) {
  const h = homedir();
  const out = [];
  if (has('claude')) {
    const r = spawnSync('claude', ['mcp', 'add', '--transport', 'http', '--scope', 'user', 'artifactsend', MCP], { encoding: 'utf8' });
    const said = (r.stdout + r.stderr).toLowerCase();
    out.push(r.status === 0 ? 'Claude Code: added. Run /mcp in Claude Code and choose artifactsend to sign in.' : said.includes('already exists') ? 'Claude Code: already added' : 'Claude Code: could not add (' + said.trim().split('\n')[0] + ')');
  }
  out.push(addJson('Cursor', join(h, '.cursor', 'mcp.json'), 'mcpServers', { url: MCP }, join(h, '.cursor')));
  out.push(addJson('Windsurf', join(h, '.codeium', 'windsurf', 'mcp_config.json'), 'mcpServers', { serverUrl: MCP }, join(h, '.codeium', 'windsurf')));
  out.push(addJson('Gemini CLI', join(h, '.gemini', 'settings.json'), 'mcpServers', { httpUrl: MCP }, join(h, '.gemini')));
  const code = platform() === 'darwin' ? join(h, 'Library', 'Application Support', 'Code', 'User') : platform() === 'win32' ? join(process.env.APPDATA || '', 'Code', 'User') : join(h, '.config', 'Code', 'User');
  out.push(addJson('VS Code', join(code, 'mcp.json'), 'servers', { type: 'http', url: MCP }, code));
  const codex = join(h, '.codex');
  if (existsSync(codex)) {
    const f = join(codex, 'config.toml');
    const t = existsSync(f) ? readFileSync(f, 'utf8') : '';
    if (/^\[mcp_servers\.artifactsend\]/m.test(t)) out.push('Codex: already added');
    else { if (t) copyFileSync(f, f + '.bak'); writeFileSync(f, t + (t && !t.endsWith('\n') ? '\n' : '') + `\n[mcp_servers.artifactsend]\nurl = "${MCP}"\n`); out.push(`Codex: added to ${f}`); }
  }
  const done = out.filter(Boolean);
  if (!opts['no-skills']) {
    const r = spawnSync('npx', ['-y', 'skills', 'add', SKILLS, '-g', '-y'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], shell: platform() === 'win32' });
    done.push(r.status === 0 ? `Skills: installed ${SKILLS} (share-with-tracking, data-room, read-shared-link)` : `Skills: run npx skills add ${SKILLS} to install them`);
  }
  console.log(done.length ? done.join('\n') : 'No agents found on this computer.');
  console.log(`\nClaude.ai and ChatGPT: add a custom connector with the URL ${MCP}\nThen ask your agent: "Share this as a tracked link and tell me who reads it."`);
}

// ---------- MCP over HTTP ----------
const token = () => {
  const t = process.env.ARTIFACTSEND_TOKEN;
  if (!t) { console.error(`Set ARTIFACTSEND_TOKEN first. Make one at ${ORIGIN}/app/settings`); process.exit(2); }
  return t;
};
let rpcId = 0;
async function rpc(method, params, tk = token()) {
  const r = await fetch(MCP, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', Authorization: 'Bearer ' + tk, 'User-Agent': 'artifactsend-cli/' + VERSION }, body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method, params }) });
  const text = await r.text();
  let body;
  try { body = JSON.parse(text.startsWith('event:') || text.startsWith('data:') ? text.split('\n').filter((l) => l.startsWith('data:')).pop().slice(5) : text); } catch { throw new Error(`HTTP ${r.status}: ${text.slice(0, 200)}`); }
  if (body.error) throw new Error(body.error.message);
  return body.result;
}
async function call(name, args) {
  const res = await rpc('tools/call', { name, arguments: args });
  const text = (res.content || []).map((c) => c.text || '').join('\n');
  if (res.isError) throw new Error(text);
  try { return JSON.parse(text); } catch { return text; }
}
const print = (v) => console.log(typeof v === 'string' ? v : JSON.stringify(v, null, 2));

const DOCS = new Set(['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.key', '.odt', '.odp', '.ods']);
async function send(o) {
  const file = o._[0];
  if (!file) { console.error('Usage: npx artifactsend send <file> [--title ...]'); process.exit(2); }
  const ext = extname(file).toLowerCase();
  const a = {};
  if (/^https?:\/\//.test(file)) a.url = file;
  else if (DOCS.has(ext)) a.document = { name: basename(file), base64: readFileSync(file).toString('base64') };
  else if (ext === '.md' || ext === '.markdown') a.markdown = readFileSync(file, 'utf8');
  else if (ext === '.jsx' || ext === '.tsx') a.react = readFileSync(file, 'utf8');
  else a.html = readFileSync(file, 'utf8');
  if (o.title) a.title = o.title;
  if (o.access) a.access = o.access;
  if (o.allow) a.allow = String(o.allow).split(',').map((s) => s.trim()).filter(Boolean);
  if (o.expires) a.expires_in_days = Number(o.expires);
  if (o.folder) a.folder = o.folder;
  if (o.ai) a.ai_reading = o.ai;
  if (o.link) a.link = o.link;
  if (o['no-notify']) a.notify = false;
  const r = await call('send_artifact', a);
  if (r && r.url) { console.log(r.url); if (r.settings) for (const [k, v] of Object.entries(r.settings)) if (v !== null && typeof v !== 'object') console.log(`  ${k.replace(/_/g, ' ')}: ${v}`); }
  else print(r);
}

// stdio <-> HTTP bridge, one JSON-RPC message per line.
async function bridge() {
  const tk = token();
  const rl = createInterface({ input: process.stdin });
  let sid = null;
  for await (const line of rl) {
    if (!line.trim()) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    try {
      const r = await fetch(MCP, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', Authorization: 'Bearer ' + tk, 'User-Agent': 'artifactsend-cli/' + VERSION, ...(sid ? { 'Mcp-Session-Id': sid } : {}) }, body: line });
      sid = r.headers.get('mcp-session-id') || sid;
      const text = await r.text();
      if (!text.trim()) continue;
      const parts = text.startsWith('event:') || text.startsWith('data:') ? text.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()) : [text];
      for (const p of parts) process.stdout.write(JSON.stringify(JSON.parse(p)) + '\n');
    } catch (e) {
      if (msg.id !== undefined) process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, error: { code: -32603, message: String(e.message || e) } }) + '\n');
    }
  }
}

const o = flags(rest);
try {
  if (cmd === 'setup' || cmd === 'init' || cmd === 'install') setup(o);
  else if (cmd === 'send') await send(o);
  else if (cmd === 'links') print(await call('list_links', o._[0] ? { query: o._.join(' ') } : {}));
  else if (cmd === 'report') { if (!o._[0]) { console.error('Usage: npx artifactsend report <link>'); process.exit(2); } print(await call('link_report', { link: o._[0] })); }
  else if (cmd === 'mcp') await bridge();
  else if (cmd === '--version' || cmd === '-v') console.log(VERSION);
  else console.log(HELP);
} catch (e) {
  console.error(String(e.message || e));
  process.exit(1);
}
