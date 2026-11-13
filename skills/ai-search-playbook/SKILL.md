---
name: ai-search-playbook
description: "Get a new website cited and recommended by ChatGPT search (GEO, AI search, LLM SEO) in days: get into Bing's index and ping IndexNow, write one answer page per buyer question with a dated comparison table, measure citations on a fixed question set, and track signups from chatgpt.com. Use when the user launches a product or site, asks how to show up in ChatGPT, Perplexity or Claude answers, wants SEO or GEO for a startup, or asks why AI assistants don't mention them. By LLM-preneur."
---

# AI search playbook

ChatGPT search reads Bing's index, crawls a site within hours of it being indexed, and quotes the first lines and the tables of a page. A new site that answers buyer questions plainly can be cited in days, long before Google ranks it. This skill runs that loop.

Work in three phases. Do phase 1 and 2 once, at launch. Repeat phase 3 every 2 to 7 days.

## Phase 1: readable and indexed (day 0 to 1)

1. **Crawlers allowed.** robots.txt allows `OAI-SearchBot`, `ChatGPT-User`, `Claude-User`, `PerplexityBot`, `bingbot` and `Googlebot`. Check with `curl -s https://<site>/robots.txt`.
2. **Every page answers GET and HEAD with 200.** Some crawlers and link checkers send HEAD first; a 404 there makes the whole site look missing. Check: `curl -sI https://<site>/ | head -1`.
3. **Sitemap with true dates.** `lastmod` is the page's real last change, not the build time.
4. **Facts for machines.** `/llms.txt`: what the product is, who it is for, prices and limits, and links to the key pages. A Markdown twin of each guide (`/guides/x.md`) helps agents that fetch text.
5. **Bing first.** Verify the site in Bing Webmaster Tools (bing.com/webmasters), submit the sitemap, and add an IndexNow key: a file `https://<site>/<key>.txt` whose body is the key. Then run `node scripts/indexnow.mjs --host <site> --key <key>` after every deploy that adds or changes pages. Do Google Search Console too, but expect less from it early.
6. **Attribution.** Store each new account's first landing: page, referrer and `utm_*`. ChatGPT adds `utm_source=chatgpt.com` to the links it cites, so that one field tells you which signups it sent. Tag every link you control with your own `utm_source`.

The user does the Bing and Search Console sign-ins in their own browser. Everything else you can build.

## Phase 2: answer pages (day 1 to 3)

1. **Write the question set.** 30 to 40 questions a buyer types into ChatGPT. Use their modifiers: free, cheapest, no per seat, with AI, for startups, for a named use, "X vs Y", "alternative to <rival>", "is <rival> free". Save it as `questions.json` (a JSON array of strings). Do not change it between runs.
2. **Pick one claim you can prove** that matches the strongest modifier, and put it in the home page title, the first sentence and the pricing page. A vague claim is not quoted; a specific one is ("free, no limits, no card").
3. **One page per question cluster**, in the shape in [references/answer-page.md](references/answer-page.md): the title is the question, the first two sentences are the answer, then a comparison table with a "checked on" date and links to each rival's pricing page.
4. **One source of facts.** Keep prices, limits and feature rows in one file that renders the pages, llms.txt and the Markdown twins, so they never disagree.
5. **The home page closes the sale.** A visitor from ChatGPT has already been persuaded. Show the answer, the price and one sign-in button above the fold. Do not make them tour the site.

## Phase 3: measure and fill gaps (every 2 to 7 days)

1. **Run the study.** `APIFY_TOKEN=... node scripts/answers-study.mjs --domain <site> --questions questions.json` runs Apify's ChatGPT search scraper (about $0.004 a question) and writes `summary-<date>.md`: which questions cite the site, at what position, which pages, and the sources ChatGPT used instead. It refuses to start over its spend caps. Use a dedicated Apify token for the product, with a monthly limit set in Apify.
2. **Fill each gap.** For a question that does not cite you, open the page ChatGPT did cite and copy its shape (a table, a list, a FAQ) with your own facts and a date. ChatGPT often lifts a dated table nearly word for word.
3. **Ship, ping IndexNow, re-run** the same questions 2 to 7 days later. Answers vary run to run, so trust the trend over the fixed set, never one answer.
4. **Third-party mentions next.** Once your own pages are cited, ask the list posts and comparison sites ChatGPT cites to add you. Draft those notes for the user; never send or post without their approval.

## Check that it is working

- **Crawled?** Count hits by user agent in the server's request logs. On Cloud Run:
  `gcloud logging read 'resource.type="cloud_run_revision" AND resource.labels.service_name="<service>" AND (httpRequest.userAgent:"OAI-SearchBot" OR httpRequest.userAgent:"ChatGPT-User" OR httpRequest.userAgent:"bingbot")' --project <project> --freshness=14d --format='value(timestamp,httpRequest.userAgent,httpRequest.requestUrl)'`
  Elsewhere, grep the access log for the same names. A full OAI-SearchBot crawl of the site is the first milestone. `ChatGPT-User` fetches are live reads while someone is asking.
- **Cited?** The study's cited count out of the fixed set.
- **Sending buyers?** Signups whose first landing has `utm_source=chatgpt.com`, and how many of them reach the product's first real action.

Traps: team-invite signups often look like Direct or Search traffic (the Gmail app sends its own referrer), so credit them to the inviter's source. Most raw traffic on a new site is scanners; count humans on content pages.

## What did not move it early

Directories (queues of weeks to months, many paid), launch sites, company-page articles (often noindex), videos and Google rankings all reacted in months, not days. They can still help later as third-party mentions. Do them, but do not wait on them.
