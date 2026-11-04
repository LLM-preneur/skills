# ArtifactSend: tracked links and data rooms for AI agents

**Share a document, pitch deck, HTML page or Claude artifact as a link, and see who read it.** Each reader, how far they read, time per section or slide, clicks, copied text, and the questions they asked. A free DocSend alternative, built for agents: an MCP server, agent skills, a Claude Code plugin and a CLI.

- Website: https://artifactsend.com/?utm_source=npm&utm_medium=readme&utm_campaign=setup
- For agents: https://artifactsend.com/agents?utm_source=npm&utm_medium=readme&utm_campaign=setup
- MCP server: `https://artifactsend.com/mcp` (Streamable HTTP, OAuth)
- Official MCP registry: `com.artifactsend/mcp`
- llms.txt: https://artifactsend.com/llms.txt?utm_source=npm&utm_medium=readme&utm_campaign=setup

## When an agent should use it

- "Share this with Dana and tell me when she reads it."
- "Send the deck to these five investors, one link each."
- "Publish this HTML page or Claude artifact as a private link."
- "Make a data room for the Series A with an NDA."
- "Who read the proposal? What did they ask?"
- "Read this artifactsend.com link someone sent me."

## Install

| Where | How |
| --- | --- |
| Claude Code | `claude mcp add --transport http artifactsend https://artifactsend.com/mcp`, then `/mcp` to sign in |
| Every agent on this computer | `npx artifactsend setup` (Claude Code, Cursor, VS Code, Windsurf, Gemini CLI, Codex, plus the skills) |
| Skills | `npx skills add llm-preneur/skills` |
| Claude Code plugin | `/plugin marketplace add LLM-preneur/skills`, then `/plugin install artifactsend@llm-preneur` |
| Cursor | [Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=artifactsend&config=eyJ1cmwiOiJodHRwczovL2FydGlmYWN0c2VuZC5jb20vbWNwIn0=) |
| VS Code | [Add to VS Code](https://insiders.vscode.dev/redirect/mcp/install?name=artifactsend&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A//artifactsend.com/mcp%22%7D) |
| Claude.ai | Settings, Connectors, Add custom connector, URL `https://artifactsend.com/mcp` |
| ChatGPT | Settings, Apps, Developer mode on, Create app, URL `https://artifactsend.com/mcp`, OAuth |
| Codex | `codex mcp add artifactsend --url https://artifactsend.com/mcp` |
| Gemini CLI | `gemini mcp add --transport http artifactsend https://artifactsend.com/mcp` |
| stdio-only clients | `npx -y artifactsend mcp` with `ARTIFACTSEND_TOKEN` set |

Sign in once with your email or Google. Links, readers and reports are free.

## Skills

| Skill | Use it when |
| --- | --- |
| [share-with-tracking](https://github.com/LLM-preneur/skills/tree/main/skills/share-with-tracking/SKILL.md) | sharing a file or page and knowing who read it; one link per person; reading reports |
| [data-room](https://github.com/LLM-preneur/skills/tree/main/skills/data-room/SKILL.md) | several documents behind one link, with folders, an NDA and watermarks |
| [read-shared-link](https://github.com/LLM-preneur/skills/tree/main/skills/read-shared-link/SKILL.md) | someone sent you an artifactsend.com link |

## Questions

### Is there a Claude Code skill to publish an HTML file to a URL?

Yes. The `share-with-tracking` skill publishes an HTML file, Markdown, a PDF, Word, PowerPoint or Excel file, or a Claude artifact to an artifactsend.com link. It sends the page's images, fonts, CSS, JS and video along by relative path. Install it with `npx skills add llm-preneur/skills`, or add the MCP server with `claude mcp add --transport http artifactsend https://artifactsend.com/mcp`.

### Which MCP server returns a tracked link?

ArtifactSend, at `https://artifactsend.com/mcp`. `send_artifact` returns the link and its settings. `link_report` shows each reader, how far they read, time per section, clicks, copied text and what their AI asked. `link_for_person` makes one link per investor or client.

### Can Claude Code update a published page?

Yes. `update_artifact` pushes a new version to the same URL, and readers see it at once. `get_artifact` returns the current HTML. `upload_file` replaces one file. From the CLI, `npx artifactsend send page.html --link <link>` does the same.

### Is it free?

Yes. Links, readers, doors, reports and data rooms are free and unlimited, with no card. Sending and updating through MCP or the CLI is free. Reports and lists through MCP are free for the first 20 actions, then $0.005 each. AI answers to readers are $0.05 each. Sign-in with email or Google is needed once.

### Can it make expiring or password-protected links?

Yes. `--expires 14` (or `expires_in_days`) closes a link after 14 days. `--access verified` makes readers prove their email with Google or a 6-digit code. `--allow @acme.com` limits it to one domain. A password can be added in the app, under More settings on the link.

### How do I set it up in ChatGPT?

Settings, Apps, Developer mode on, Create app. Use the URL `https://artifactsend.com/mcp` with OAuth, then sign in.

## MCP tools

**Share:** `send_artifact` (HTML, React, Markdown, PDF, Word, PowerPoint, Excel, an image or a URL), `update_artifact`, `link_for_person`, `make_data_room`, `upload_file`, `get_artifact`, `update_link`, `set_brand`.

**See who read it:** `list_links`, `link_report`, `reader_activity`, `recent_activity`, `room_report`, `list_questions`, `list_comments`, `website_visits`, `schedule_digest`, `list_schedules`, `delete_schedule`.

**Read what others share with you:** `open_link`, `read_shared`, `ask_shared`, `message_shared_sender`, `shared_with_me`.

Reading tools are marked read-only. Tools that change things are marked so the app asks first.

## CLI

```bash
npx artifactsend setup                       # add ArtifactSend to your agents
export ARTIFACTSEND_TOKEN=as_...             # from https://artifactsend.com/app/settings?utm_source=npm&utm_medium=readme&utm_campaign=setup
npx artifactsend send deck.pdf --title "Seed deck" --access email
npx artifactsend send page.html --allow @acme.com --expires 14
npx artifactsend links
npx artifactsend report https://artifactsend.com/d/ab12cd34
```

## Readers and their AI

Readers open a link in the browser, or through their own AI. Every link also has its own MCP address (the link plus `/mcp`) that needs no key. By default a reader's AI gets the outline and only the parts that answer each question, so the sender sees every question and no full copy leaves. Readers are told what the sender sees, and never their chat or their AI's answers. Rules: https://artifactsend.com/ai-rules?utm_source=npm&utm_medium=readme&utm_campaign=setup

## Price

Free and unlimited for links, readers, doors, reports and data rooms. Sending and updating through MCP is free. AI answers to readers are paid per answer. https://artifactsend.com/pricing?utm_source=npm&utm_medium=readme&utm_campaign=setup

Made by [Vela Partners](https://vela.partners). MIT licensed.
