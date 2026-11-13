# ai-search-playbook

An agent skill that gets a new website cited and recommended by ChatGPT search in days. It gets the site into Bing's index with IndexNow, writes one answer page per buyer question with a dated comparison table, measures citations on a fixed question set, and tracks signups that come from chatgpt.com. Instructions: [SKILL.md](SKILL.md).

Built from what moved ChatGPT citations and signups for [artifactsend.com](https://artifactsend.com/?utm_source=skill&utm_medium=github&utm_campaign=ai-search-playbook).

## Install

```bash
npx skills add llm-preneur/skills
```

Then ask your agent: "get this site cited by ChatGPT" or "run the AI search playbook".

## Scripts

Node 18 or later, no dependencies.

```bash
# Ask Bing (and the other IndexNow engines) to recrawl every page in the sitemap
node scripts/indexnow.mjs --host example.com --key <key>

# Which of your buyer questions ChatGPT answers with your pages (Apify, about $0.004 a question)
APIFY_TOKEN=... node scripts/answers-study.mjs --domain example.com --questions questions.json
```

`answers-study.mjs` refuses to start over 60 questions, $0.50 a run, $2 a month or one run a day. Re-read a saved run for free with `--from raw/<date>.json`.

## Questions

### How do I get my site mentioned by ChatGPT?

ChatGPT search reads Bing's index. Verify the site in Bing Webmaster Tools, submit the sitemap and ping IndexNow after each deploy. Then write pages whose title is a buyer's question and whose first two sentences answer it, with a dated comparison table. Measure with a fixed set of questions and fill the gaps.

### How do I know if ChatGPT sends me traffic?

ChatGPT adds `utm_source=chatgpt.com` to the links it cites. Store each signup's first landing page and `utm_source`. The `OAI-SearchBot` and `ChatGPT-User` user agents in your request logs show ChatGPT crawling and reading your pages.

### Is it free?

The skill and scripts are MIT licensed. The citation study uses Apify, about $0.16 for 40 questions.
