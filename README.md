# Viber Webhook & Universal Agent Plugin

A complete Viber integration providing:
1. **Webhook & Channel Post API Service**: Built with Bun and Hono, deployable to Vercel (Edge Functions) with trusted SSL.
2. **Universal AI Agent Plugin**: Bundled MCP server, skills, rules, and subagent definition compatible with **Antigravity**, **Cursor**, **Claude Code / Desktop**, **Windsurf**, and any MCP client.
3. **One-Command Setup Wizard**: Guided interactive setup for humans and automated flags for AI agents.

---

## ⚡ Quick Start: Interactive Setup Wizard

Run the all-in-one setup wizard:

```bash
bun run setup
# or
npm run setup
```

The wizard handles everything end-to-end:
1. 🔑 **Prompt for Token**: Prompts you for `VIBER_AUTH_TOKEN` (or reads it from your environment).
2. 🔍 **Validation & Auto-Discovery**: Validates the token with Viber API and auto-extracts your Bot/Channel Name and Superadmin ID.
3. 📦 **Plugin Installation**: Configures and installs the Antigravity plugin (`~/.gemini/config/plugins/viber/`) and updates `.cursor/mcp.json`.
4. 🚀 **Vercel Deployment**: Checks if you are logged in (`vercel whoami`), deploys to Vercel, and syncs your environment variables to production.
5. 📡 **Webhook Registration**: Automatically calls Viber's `set_webhook` to activate your bot/channel.
6. 💬 **Verification Post**: Sends an initial confirmation announcement to your channel.

---

## 🤖 Telling Your Agent to Set It Up

If you're chatting with **Antigravity**, **Cursor**, or **Claude Code**, simply say:

> *"Set up Viber with token: `<your_viber_auth_token>`"*

Your agent reads [`AGENTS.md`](AGENTS.md) and executes:
```bash
bun run setup --token=<YOUR_TOKEN> --deploy
```
No manual configuration required.

---

## 🤖 Supported Agents & IDEs

| Agent / IDE | Integration Provided | Config Location |
| :--- | :--- | :--- |
| **Google Antigravity** | Full Plugin Bundle (`plugin.json`, skills, agents, rules, MCP) | `~/.gemini/config/plugins/viber/` |
| **Cursor** | Pre-configured [`.cursor/mcp.json`](.cursor/mcp.json) + [`AGENTS.md`](AGENTS.md) | Workspace root |
| **Claude Code & Desktop** | Dedicated [`CLAUDE.md`](CLAUDE.md) guide + MCP schema | `claude_desktop_config.json` |
| **Windsurf, Cline & Roo Code** | Universal [`AGENTS.md`](AGENTS.md) + MCP config | Settings / Workspace |

---

## 💻 Manual Commands

| Command | Action |
| :--- | :--- |
| `bun run setup` | Run the full setup wizard (token, Vercel, webhook, plugins) |
| `bun run install:plugin` | Only install/reinstall the Antigravity plugin |
| `bun dev` | Run the webhook service locally on `http://localhost:3000` |
| `bunx vercel --prod` | Deploy serverless webhook to Vercel production |

---

## 📡 Webhook & Channel API Usage

Once deployed (e.g. `https://your-app.vercel.app`):

### Post to Your Viber Channel
```bash
curl -X POST https://your-app.vercel.app/api/post-channel \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello subscribers, this is a test post!"}'
```

### Manually Re-register Webhook
```bash
curl -X POST https://your-app.vercel.app/api/set-webhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-app.vercel.app/webhook"}'
```
