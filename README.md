# LLM-preneur skills

Agent skills, Claude Code plugins and MCP servers for the apps [Vela Partners](https://vela.partners) builds. Each app has its own MCP server on its own domain; this repo is where agents install them.

```bash
npx skills add LLM-preneur/skills              # every skill, for any agent that reads skills
/plugin marketplace add LLM-preneur/skills     # in Claude Code, then /plugin install <app>@llm-preneur
```

## Apps

### [ArtifactSend](artifactsend/README.md): tracked links and data rooms

Share a document, pitch deck, HTML page or Claude artifact as a link, and see who read it, how far, time per section and what they asked. A free DocSend alternative.

- MCP server: `https://artifactsend.com/mcp` (official registry: `com.artifactsend/mcp`)
- Install everywhere: `npx artifactsend setup`
- Claude Code plugin: `/plugin install artifactsend@llm-preneur`

| Skill | Use it when |
| --- | --- |
| [share-with-tracking](skills/share-with-tracking/SKILL.md) | sharing a file or page and knowing who read it; one link per person; reading reports |
| [data-room](skills/data-room/SKILL.md) | several documents behind one link, with folders, an NDA and watermarks |
| [read-shared-link](skills/read-shared-link/SKILL.md) | someone sent you an artifactsend.com link |

## Layout

- `skills/`: every skill, one folder each (the `npx skills` format).
- `plugins/<app>/`: a Claude Code plugin per app: its skills and its MCP server.
- `<app>/`: the app's npm package and its `server.json` for the official MCP registry.

MIT licensed.
