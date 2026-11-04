# data-room

An agent skill that builds a virtual data room on ArtifactSend. Several documents sit behind one link, with folders, an NDA readers accept first and a watermark with each reader's email. `room_report` shows who opened which document and for how long. By [ArtifactSend](https://artifactsend.com/?utm_source=skill&utm_medium=github&utm_campaign=data-room).

Use it for fundraising, due diligence, M&A, a board or a client. Instructions: [SKILL.md](SKILL.md).

## Install

```bash
npx skills add llm-preneur/skills                                            # the skills
claude mcp add --transport http artifactsend https://artifactsend.com/mcp     # Claude Code, then /mcp to sign in
npx artifactsend setup                                                       # every agent on this computer
```

In Claude Code you can also run `/plugin marketplace add LLM-preneur/skills`, then `/plugin install artifactsend@llm-preneur`. MCP endpoint: `https://artifactsend.com/mcp` (Streamable HTTP, OAuth).

## Questions

### Is there a Claude Code skill to make a data room?

Yes, this one. It sends each file with `send_artifact`, then calls `make_data_room` with the links, `access`, `nda` and `watermark`. It returns one room link.

### Which tools does it use?

`send_artifact`, `make_data_room` and `room_report`, from the ArtifactSend MCP server at `https://artifactsend.com/mcp`.

### Is it free?

Yes. Data rooms, readers and reports are free and unlimited. Making a room through MCP is free. `room_report` through MCP is free for each account's first 20 actions, then $0.005 each. [Pricing](https://artifactsend.com/pricing?utm_source=skill&utm_medium=github&utm_campaign=data-room).

### Can I limit who enters, or add an expiry or a password?

`access: verified` makes readers prove their email with Google or a 6-digit code. An allow list, per-folder access by person and a password are set on the room in the app. Each document link can also carry `expires_in_days`.

### How do I set it up in ChatGPT?

Settings, Apps, Developer mode on, Create app, URL `https://artifactsend.com/mcp`, OAuth.

More: [free data room for startups](https://artifactsend.com/guides/free-data-room-for-startups?utm_source=skill&utm_medium=github&utm_campaign=data-room), [for agents](https://artifactsend.com/agents?utm_source=skill&utm_medium=github&utm_campaign=data-room).
