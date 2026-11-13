#!/usr/bin/env node
// Ask search engines that use IndexNow (Bing, which ChatGPT search reads, plus Yandex, Seznam and Naver) to recrawl a site.
//   node indexnow.mjs --host example.com --key <key> [url ...]
// With no URLs it sends every <loc> in https://<host>/sitemap.xml. The key is public by design: the site serves it at
// https://<host>/<key>.txt to prove ownership. Make one with: node -e "console.log(crypto.randomUUID().replace(/-/g,''))"
const arg = (k) => { const i = process.argv.indexOf('--' + k); return i < 0 ? null : process.argv[i + 1]; };
const HOST = arg('host'), KEY = arg('key');
if (!HOST || !KEY) { console.log('Usage: node indexnow.mjs --host example.com --key <key> [url ...]'); process.exit(1); }
const given = process.argv.slice(2).filter((a, i, all) => !a.startsWith('--') && !['--host', '--key'].includes(all[i - 1]));
const urls = given.length ? given : [...(await (await fetch(`https://${HOST}/sitemap.xml`)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const own = urls.filter((u) => { try { return new URL(u).host === HOST; } catch { return false; } });
if (!own.length) { console.log('No URLs on ' + HOST + ' to send.'); process.exit(1); }
const check = await fetch(`https://${HOST}/${KEY}.txt`);
if (!check.ok || (await check.text()).trim() !== KEY) { console.log(`https://${HOST}/${KEY}.txt must return the key. Deploy it first.`); process.exit(1); }
const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: own.slice(0, 10000) }),
});
console.log(`IndexNow: ${r.status} ${r.statusText} for ${own.length} URLs`);
process.exit(r.status === 200 || r.status === 202 ? 0 : 1);
