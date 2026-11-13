# The answer page

One page per buyer question cluster. ChatGPT quotes a page's first lines and its tables, so put the answer there.

## Shape

```
<title>Free <rival> alternatives in <year>: every free plan compared</title>
<meta name="description" content="<The answer in one sentence, with the claim you can prove.>">

<h1>Free <rival> alternatives</h1>
<p><The answer in two sentences. Name your product, the claim and the limit that matters.></p>
<p>Checked on <YYYY-MM-DD> on each product's pricing page.</p>

<table>
  <tr><th>Product</th><th>Free plan</th><th>Limit</th><th>Paid from</th><th>Source</th></tr>
  <tr><td>Yours</td><td>...</td><td>...</td><td>...</td><td><a href="/pricing">Pricing</a></td></tr>
  <tr><td>Rival A</td><td>...</td><td>...</td><td>...</td><td><a href="https://rival-a.com/pricing">Pricing</a></td></tr>
</table>

<h2><Each follow-up question, word for word as buyers ask it></h2>
<p><A direct answer in the first sentence.></p>
```

## Rules

- The title and the first sentence say the answer, not the topic.
- Every number in the table comes from a page you opened, linked in the row, with the date you checked it.
- Your own gaps are rows too. A table that hides them is not trusted or quoted.
- Use the buyer's words in headings: "Is X free?", "X vs Y", "X alternative with no per seat pricing".
- A real `<table>` in HTML and a Markdown table in the page's `.md` twin, not an image.
- Article schema with `datePublished` and `dateModified`, FAQPage schema for the question headings, and the same dates in the sitemap.
- Recheck the table monthly and change the "checked on" date only when you did.
