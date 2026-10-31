# ArtifactSend: tracked links and data rooms for AI agents

**Share a document, pitch deck, HTML page or Claude artifact as a link, and see who read it.** Each reader, how far they read, time per section or slide, clicks, copied text, and the questions they asked. A free DocSend alternative, built for agents: an MCP server, agent skills, a Claude Code plugin and a CLI.

- Website: https://artifactsend.com
- MCP server: `https://artifactsend.com/mcp` (Streamable HTTP, OAuth)
- Official MCP registry: `com.artifactsend/mcp`
- For agents: https://artifactsend.com/llms.txt

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
| Skills | `npx skills add LLM-preneur/skills` |
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

## MCP tools

**Share:** `send_artifact` (HTML, React, Markdown, PDF, Word, PowerPoint, Excel or a URL), `update_artifact`, `link_for_person`, `make_data_room`, `upload_file`, `get_artifact`, `update_link`.

**See who read it:** `list_links`, `link_report`, `reader_activity`, `recent_activity`, `room_report`, `list_questions`, `list_comments`, `website_visits`, `schedule_digest`.

**Read what others share with you:** `open_link`, `read_shared`, `ask_shared`, `message_shared_sender`, `shared_with_me`.

Reading tools are marked read-only. Tools that change things are marked so the app asks first.

## CLI

```bash
npx artifactsend setup                       # add ArtifactSend to your agents
export ARTIFACTSEND_TOKEN=as_...             # from https://artifactsend.com/app/settings
npx artifactsend send deck.pdf --title "Seed deck" --access email
npx artifactsend send page.html --allow @acme.com --expires 14
npx artifactsend links
npx artifactsend report https://artifactsend.com/d/ab12cd34
```

## Readers and their AI

Readers open a link in the browser, or through their own AI. Every link also has its own MCP address (the link plus `/mcp`) that needs no key. By default a reader's AI gets the outline and only the parts that answer each question, so the sender sees every question and no full copy leaves. Readers are told what the sender sees, and never their chat or their AI's answers. Rules: https://artifactsend.com/ai-rules

## Price

Free and unlimited for links, readers, doors, reports and data rooms. Sending and updating through MCP is free. AI answers to readers are paid per answer. https://artifactsend.com/pricing

Made by [Vela Partners](https://vela.partners). MIT licensed.
