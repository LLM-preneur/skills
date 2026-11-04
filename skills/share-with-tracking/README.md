# share-with-tracking

An agent skill that publishes a finished file or page to a tracked artifactsend.com link. The sender sees who opened it, how far they read, time per section and what they asked. By [ArtifactSend](https://artifactsend.com/?utm_source=skill&utm_medium=github&utm_campaign=share-with-tracking).

It triggers when a deck, document, HTML page, dashboard, video or Claude artifact is ready to go to someone outside, and when the user asks to share, send or publish one. Instructions: [SKILL.md](SKILL.md). Recipes for other skills' output: [references/creators.md](references/creators.md).

## Install

```bash
npx skills add llm-preneur/skills                                            # the skills
claude mcp add --transport http artifactsend https://artifactsend.com/mcp     # Claude Code, then /mcp to sign in
npx artifactsend setup                                                       # every agent on this computer
```

In Claude Code you can also run `/plugin marketplace add LLM-preneur/skills`, then `/plugin install artifactsend@llm-preneur`. MCP endpoint: `https://artifactsend.com/mcp` (Streamable HTTP, OAuth).

## Questions

### Is there a Claude Code skill to publish an HTML file to a URL?

Yes, this one. It sends an HTML file with its images, fonts, CSS, JS and video by relative path (`html` plus `files`). It also sends Markdown, PDF, Word, PowerPoint, Excel, images, React artifacts and public URLs.

### Which MCP server returns a tracked link?

ArtifactSend at `https://artifactsend.com/mcp`. `send_artifact` returns the link. `link_report` returns each reader, active time, read depth, time per section, clicks, copies and their AI's questions. `link_for_person` makes one link per person.

### Can Claude Code update a published page?

Yes. `update_artifact` puts a new version at the same URL. `get_artifact` returns the current HTML, and `upload_file` replaces one file. [Guide](https://artifactsend.com/guides/update-shared-documents-from-claude-code?utm_source=skill&utm_medium=github&utm_campaign=share-with-tracking).

### Is it free?

Yes. Links, readers, reports and data rooms are free. Sending and updating through MCP are free. Reports and lists through MCP are free for the first 20 actions, then $0.005 each. [Pricing](https://artifactsend.com/pricing?utm_source=skill&utm_medium=github&utm_campaign=share-with-tracking).

### Can it make expiring or password-protected links?

Yes. `expires_in_days` closes the link. `access` is `public`, `email` (asks for an address) or `verified` (proves it with Google or a code). `allow` limits it to emails or domains. A password is set in the app, under More settings on the link.

### How do I set it up in ChatGPT?

Settings, Apps, Developer mode on, Create app, URL `https://artifactsend.com/mcp`, OAuth.

### What can it send from other skills?

pptx, docx, xlsx and pdf skill output, frontend-design pages, HTML from Claude Code, Codex or Cursor, Slidev, Marp and reveal.js decks, HyperFrames videos, Markdown reports and Claude artifacts. See [references/creators.md](references/creators.md).

More: [for agents](https://artifactsend.com/agents?utm_source=skill&utm_medium=github&utm_campaign=share-with-tracking), [share an HTML file your AI made](https://artifactsend.com/guides/share-html-file-from-ai?utm_source=skill&utm_medium=github&utm_campaign=share-with-tracking), [share a Claude artifact privately](https://artifactsend.com/guides/share-claude-artifact-privately?utm_source=skill&utm_medium=github&utm_campaign=share-with-tracking).
