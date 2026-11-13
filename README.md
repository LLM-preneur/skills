# LLM-preneur skills

Agent skills, Claude Code plugins and MCP servers for the apps [Vela Partners](https://vela.partners) builds. Each app has its own MCP server on its own domain. This repo is where agents install them.

```bash
npx skills add llm-preneur/skills              # every skill, for any agent that reads skills
/plugin marketplace add LLM-preneur/skills     # in Claude Code, then /plugin install <app>@llm-preneur
```

## Apps

### [ArtifactSend](artifactsend/README.md): publish a file or page to a tracked link

Share a document, pitch deck, HTML page, dashboard, video or Claude artifact as a link, and see who read it, how far, time per section and what they asked. A free DocSend alternative, built for agents.

- MCP server: `https://artifactsend.com/mcp` (Streamable HTTP, OAuth; official registry `com.artifactsend/mcp`)
- Skills: `npx skills add llm-preneur/skills`
- Claude Code: `claude mcp add --transport http artifactsend https://artifactsend.com/mcp`, then `/mcp` to sign in
- Every agent on this computer: `npx artifactsend setup`
- Claude Code plugin: `/plugin install artifactsend@llm-preneur`
- For agents: [artifactsend.com/agents](https://artifactsend.com/agents?utm_source=skill&utm_medium=github&utm_campaign=readme)

| Skill | Use it when |
| --- | --- |
| [share-with-tracking](skills/share-with-tracking/) | a deck, document, HTML page, dashboard, video or artifact is ready to send, and the user wants to know who read it |
| [data-room](skills/data-room/) | several documents behind one link, with folders, an NDA and watermarks |
| [read-shared-link](skills/read-shared-link/) | someone sent you an artifactsend.com link |

## Growth

Playbooks we use to launch the apps, for any product.

| Skill | Use it when |
| --- | --- |
| [ai-search-playbook](skills/ai-search-playbook/) | a new site should be cited and recommended by ChatGPT search: Bing and IndexNow, answer pages, a citation study, chatgpt.com attribution |

## Questions

### Is there a Claude Code skill to publish an HTML file to a URL?

Yes. `share-with-tracking` publishes an HTML file, Markdown, a PDF, Word, PowerPoint or Excel file, or a Claude artifact to an artifactsend.com link. It sends the page's images, fonts, CSS, JS and video along by relative path. Install it with `npx skills add llm-preneur/skills`, or add the MCP server with `claude mcp add --transport http artifactsend https://artifactsend.com/mcp`. Then say "publish this page as a link".

### Which MCP server returns a tracked link?

ArtifactSend, at `https://artifactsend.com/mcp`. `send_artifact` returns the link and its settings. `link_report` shows each reader, how far they read, time per section, clicks, copied text and what their AI asked. `link_for_person` makes one link per investor or client, each with its own report.

### Can Claude Code update a published page?

Yes. `update_artifact` pushes a new version to the same URL, and readers see it at once. `get_artifact` returns the current HTML for editing. `upload_file` replaces one image, video or script without touching the page. Guide: [update shared documents from Claude Code](https://artifactsend.com/guides/update-shared-documents-from-claude-code?utm_source=skill&utm_medium=github&utm_campaign=readme).

### Is it free?

Yes. Links, readers, doors, reports and data rooms are free and unlimited, with no card. Sending, updating, per-person links, rooms and settings through MCP are free. Reports and lists through MCP are free for each account's first 20 actions, then $0.005 each. AI answers to readers are $0.05 each. Sign-in with email or Google is needed once. [Pricing](https://artifactsend.com/pricing?utm_source=skill&utm_medium=github&utm_campaign=readme).

### Can it make expiring or password-protected links?

Yes. `expires_in_days` closes a link after that many days. `access` sets the door: `public`, `email` (the reader types an address) or `verified` (the reader proves it with Google or a 6-digit code). `allow` limits it to certain emails or domains. A password can be added in the app, under More settings on the link. Downloads are off unless `downloads` is on.

### How do I set it up in ChatGPT?

Settings, Apps, Developer mode on, Create app. Use the URL `https://artifactsend.com/mcp` with OAuth, then sign in. In Claude.ai, add a custom connector with the same URL.

### Which tools does the MCP server have?

- Share: `send_artifact`, `update_artifact`, `link_for_person`, `make_data_room`, `upload_file`, `get_artifact`, `update_link`, `set_brand`.
- See who read it: `list_links`, `link_report`, `reader_activity`, `recent_activity`, `room_report`, `list_questions`, `list_comments`, `website_visits`, `schedule_digest`, `list_schedules`, `delete_schedule`.
- Read what others share with you: `open_link`, `read_shared`, `ask_shared`, `message_shared_sender`, `shared_with_me`.

### Can I share a HeyGen or Higgsfield video and see who watched it?

Yes. Connect the video tool and ArtifactSend to the same AI app. When the video is ready, the AI passes its address to `send_artifact` as `video_url` (mp4, webm or mov, up to 200 MB). For a file on disk, such as a HyperFrames render, `start_upload` returns one command that sends it in parts. `link_report` then shows each viewer, how much they watched, the parts they skipped or watched again, and where viewers stop. Guides: [HeyGen](https://artifactsend.com/guides/share-heygen-video-track-views?utm_source=skill&utm_medium=github&utm_campaign=readme), [Higgsfield](https://artifactsend.com/guides/share-higgsfield-video-track-views?utm_source=skill&utm_medium=github&utm_campaign=readme), [HyperFrames](https://artifactsend.com/guides/share-hyperframes-video?utm_source=skill&utm_medium=github&utm_campaign=readme).

### What can I send from other skills?

A deck from the pptx skill, a docx, xlsx or pdf file, an HTML page from frontend-design, Claude Code, Codex or Cursor, a Slidev, Marp or reveal.js deck, a HeyGen, Higgsfield or HyperFrames video, or a Markdown report. Recipes: [creators.md](skills/share-with-tracking/references/creators.md).

## Layout

- `skills/`: every skill, one folder each (the `npx skills` format).
- `plugins/<app>/`: a Claude Code plugin per app, with its skills and its MCP server.
- `<app>/`: the app's npm package and its `server.json` for the official MCP registry.

More: [artifactsend.com](https://artifactsend.com/?utm_source=skill&utm_medium=github&utm_campaign=readme), [MCP page](https://artifactsend.com/mcp?utm_source=skill&utm_medium=github&utm_campaign=readme), [share an HTML file your AI made](https://artifactsend.com/guides/share-html-file-from-ai?utm_source=skill&utm_medium=github&utm_campaign=readme), [share a Claude artifact privately](https://artifactsend.com/guides/share-claude-artifact-privately?utm_source=skill&utm_medium=github&utm_campaign=readme).

MIT licensed.
