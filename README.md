# Viber Webhook & Universal Agent Plugin

A complete, zero-friction Viber integration providing:
1. **Webhook & Channel Post API Service**: Built with Bun and Hono, deployable to Vercel (Edge Functions) with trusted SSL.
2. **Universal AI Agent Plugin**: Bundled MCP server, skills, rules, and subagent definition compatible with **Antigravity**, **Cursor**, **Claude Code / Desktop**, **Windsurf**, and any MCP client.
3. **One-Prompt Setup**: Copy and paste one prompt into your agent and it handles everything automatically.

---

## ⚡ The 1-Click Copy-Paste Prompt (For Users)

Copy and paste this exact prompt into your AI coding assistant (**Antigravity**, **Cursor**, **Claude Code**, or **Windsurf**):

```text
Please set up and connect my Viber bot/channel integration using https://github.com/herveyyy/viber-webhook.git

Here is my Viber Auth Token:
<PASTE_YOUR_VIBER_AUTH_TOKEN_HERE>

Please clone the repo if needed, run the automated setup with my token, deploy the webhook to Vercel, install the plugin into my agent environment, and send a test message to my Viber channel to confirm it's working!
```

> 💡 **Where do I find my Viber Auth Token?**
> 1. Open Viber (phone or desktop) and click on your **Channel / Bot**.
> 2. Open the info screen and scroll down to **Developer Tools**.
> 3. Copy the **Token** and paste it into the prompt above.

---

## 🤖 What Your Agent Does Automatically

When you send that prompt, your agent autonomously:
1. 🔍 Validates your token with the Viber API and extracts your channel details.
2. 📦 Installs the Antigravity plugin (`~/.gemini/config/plugins/viber/`) and Cursor MCP configs.
3. 🚀 Deploys the webhook to Vercel production and syncs environment variables.
4. 📡 Registers the webhook with Viber to unlock posting capabilities.
5. 💬 Sends a confirmation announcement to your Viber Channel.

---

## 🤖 Supported Agents & IDEs

| Agent / IDE | Integration Provided | Config Location |
| :--- | :--- | :--- |
| **Google Antigravity** | Full Plugin Bundle (`plugin.json`, skills, agents, rules, MCP) | `~/.gemini/config/plugins/viber/` |
| **Cursor** | Pre-configured [`.cursor/mcp.json`](.cursor/mcp.json) + [`AGENTS.md`](AGENTS.md) | Workspace root |
| **Claude Code & Desktop** | Dedicated [`CLAUDE.md`](CLAUDE.md) guide + MCP schema | `claude_desktop_config.json` |
| **Windsurf, Cline & Roo Code** | Universal [`AGENTS.md`](AGENTS.md) + MCP config | Settings / Workspace |

---

## 💻 Manual Commands (Optional)

If you prefer running commands manually in your terminal:

```bash
# Full interactive setup wizard
bun run setup
# or
npm run setup

# Run dev server locally
bun dev

# Deploy to Vercel manually
bunx vercel --prod
```

---

## 📡 Webhook & Channel API Endpoints

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
