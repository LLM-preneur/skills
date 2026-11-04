# read-shared-link

An agent skill for the reader. Someone sent the user an artifactsend.com link (`/d/...` or `/r/...`). The skill opens it, answers questions about it under the sender's rules and drafts a reply to the sender. By [ArtifactSend](https://artifactsend.com/?utm_source=skill&utm_medium=github&utm_campaign=read-shared-link).

Instructions: [SKILL.md](SKILL.md).

## Install

```bash
npx skills add llm-preneur/skills                                            # the skills
claude mcp add --transport http artifactsend https://artifactsend.com/mcp     # Claude Code, then /mcp to sign in
npx artifactsend setup                                                       # every agent on this computer
```

In Claude Code you can also run `/plugin marketplace add LLM-preneur/skills`, then `/plugin install artifactsend@llm-preneur`. MCP endpoint: `https://artifactsend.com/mcp` (Streamable HTTP, OAuth).

## Questions

### Can my AI read a document someone shared with me on ArtifactSend?

Yes. With the account server, `open_link`, `read_shared` and `ask_shared` read it as the user. Every shared link also has its own MCP address with no key, the link plus `/mcp`, e.g. `https://artifactsend.com/d/ab12cd34/mcp`. Its tools are `read_document`, `ask_document`, `message_sender` and, for a room, `list_documents`.

### What does the sender see?

That the reader opened it, which parts were used and the questions asked. Never the reader's chat or their AI's answers. [AI rules](https://artifactsend.com/ai-rules?utm_source=skill&utm_medium=github&utm_campaign=read-shared-link).

### Can I reply to the sender?

Yes. `message_shared_sender` emails the sender with the user's email as the reply address. The skill sends only words the user wrote or approved.

### Is it free?

Yes. Reading a shared link costs the reader nothing.

### How do I set it up in ChatGPT?

Settings, Apps, Developer mode on, Create app, URL `https://artifactsend.com/mcp`, OAuth. Or use the link's own `/mcp` address.
