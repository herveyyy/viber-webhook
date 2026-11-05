# Viber Webhook & Universal Agent Plugin

A complete, zero-friction Viber integration providing:
1. **Webhook & Channel Post API Service**: Built with Bun and Hono, deployable to Vercel (Edge Functions) with trusted SSL.
2. **Universal AI Agent Plugin**: Bundled MCP server, skills, rules, and subagent definition compatible with **Antigravity**, **Cursor**, **Claude Code / Desktop**, **Windsurf**, and any MCP client.
3. **Flexible Hosting**: Use the pre-hosted webhook out-of-the-box (no Vercel account required), or deploy your own private instance to your own Vercel account!

---

## ⚡ The 1-Click Copy-Paste Prompt (For Users)

Copy and paste this prompt into your AI coding assistant (**Antigravity**, **Cursor**, **Claude Code**, or **Windsurf**):

```text
Please set up and connect my Viber bot/channel integration using https://github.com/herveyyy/viber-webhook.git

Here is my Viber Auth Token:
<PASTE_YOUR_VIBER_AUTH_TOKEN_HERE>

Please clone the repo if needed, run the automated setup with my token, install the plugin into my agent environment, and send a test message to my Viber channel to confirm it's working!
```

> 💡 **Where do I find my Viber Auth Token?**
> 1. Open Viber (phone or desktop) and click on your **Channel / Bot**.
> 2. Open the info screen and scroll down to **Developer Tools**.
> 3. Copy the **Token** and paste it into the prompt above.

---

## 🚀 Two Hosting Options (In Setup)

When running `bun run setup` (or `npm run setup`), you can choose how your webhook is hosted:

### Option 1: Use Hosted Webhook (Default & Recommended)
- Connects to `https://viber-webhook-six.vercel.app/webhook`.
- **Zero Vercel login or deployment required**.
- Instant setup in ~3 seconds.

### Option 2: Deploy to Your Own Vercel Account (`--own-vercel`)
- For users who want 100% private, self-hosted infrastructure.
- Automatically asks you to sign in to your Vercel account (`vercel login`).
- Deploys your own private instance (`https://your-name.vercel.app`) and syncs your environment variables.

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

```bash
# Setup wizard (interactive choice: hosted vs own Vercel)
bun run setup
# or
npm run setup

# Setup with your own Vercel account directly
node scripts/setup.js --token="<TOKEN>" --own-vercel

# Setup with hosted webhook directly (fastest)
node scripts/setup.js --token="<TOKEN>" --shared

# Run webhook server locally
bun dev
```
