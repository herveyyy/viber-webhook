# Viber Webhook & Universal Agent Plugin

A complete Viber integration providing:
1. **Webhook & Channel Post API Service**: Built with Bun and Hono, deployable to Vercel (Edge Functions) with trusted SSL.
2. **Universal AI Agent Plugin**: Bundled MCP server, skills, rules, and subagent definition compatible with **Antigravity**, **Cursor**, **Claude Code / Desktop**, **Windsurf**, and any MCP client.

---

## 🤖 Supported Agents & IDEs

| Agent / IDE | Support Type | Config Location |
| :--- | :--- | :--- |
| **Google Antigravity** | Native Plugin (`plugin.json`, skills, agents, rules) | `~/.gemini/config/plugins/viber/` |
| **Cursor** | Native MCP (`.cursor/mcp.json`) + `.cursorrules` / `AGENTS.md` | Workspace root |
| **Claude Code & Desktop** | MCP Server (`claude_desktop_config.json`) + `CLAUDE.md` | MCP config file |
| **Windsurf & Cline** | MCP Server (`mcp_config.json`) + `AGENTS.md` | Workspace / settings |

---

## 📦 Installation for AI Agents

### 1. Antigravity Installation
Run the one-line installer from the repository root:
```bash
bun run install:plugin
# or
npm run install:plugin
```
*Alternatively, copy the `plugin/` folder into `~/.gemini/config/plugins/viber/`.*

Once installed, Antigravity gets:
- **`viber` MCP Server**: 13 tools for messages, pictures, videos, files, broadcasts, etc.
- **`@viber-bot` Agent**: Autonomous subagent for channel and bot management.
- **`/viber-bot` Skill**: Slash command and operational workflow.
- **Rules**: Guardrails for Viber media constraints, broadcast limits, and webhook requirements.

### 2. Cursor Installation
The repository already includes [`.cursor/mcp.json`](.cursor/mcp.json).
Simply set your environment variable:
```bash
export VIBER_AUTH_TOKEN="your-viber-auth-token"
```
Or paste your token into `.cursor/mcp.json` under `env.VIBER_AUTH_TOKEN`. Cursor will automatically detect the Viber MCP tools and `AGENTS.md` rules.

### 3. Claude Desktop / Claude Code Installation
Add the following to your `claude_desktop_config.json` (or Claude Code settings):
```json
{
  "mcpServers": {
    "viber": {
      "command": "npx",
      "args": ["-y", "@serhii.zghama/viber-mcp"],
      "env": {
        "VIBER_AUTH_TOKEN": "your-viber-auth-token",
        "VIBER_SENDER_NAME": "MyBot"
      }
    }
  }
}
```

### 4. Windsurf / Cline / Roo Code Installation
Import the `mcpServers.viber` block above into your client's MCP configuration settings. The included [`AGENTS.md`](AGENTS.md) will be recognized automatically by the agent.

---

## ⚡ Webhook & Channel Post API Service (Bun & Vercel)

Viber requires an active, public HTTPS webhook with trusted CA SSL before allowing outbound posts and messages.

### Deploy to Vercel

```bash
bunx vercel --prod
```

Or import this repository directly in your [Vercel Dashboard](https://vercel.com/new).

### Environment Variables on Vercel

Set these in **Project Settings → Environment Variables**:
- `VIBER_AUTH_TOKEN`: Your Viber Channel authentication token.
- `VIBER_SUPERADMIN_ID`: Your Viber Superadmin ID (e.g., `A6PFKxy+/v9xvsugeT+S3w==`).

### Register Your Webhook

Once deployed to Vercel (e.g., `https://your-app.vercel.app`):

```bash
curl -X POST https://your-app.vercel.app/api/set-webhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-app.vercel.app/webhook"}'
```

Viber will send a verification ping to `/webhook`, which returns `200 OK`, officially activating your bot/channel.

### Post to Your Viber Channel

To publish an announcement to all subscribers:

```bash
curl -X POST https://your-app.vercel.app/api/post-channel \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello subscribers, this is a test post!"}'
```

---

## 💻 Local Development (Bun)

```bash
# Install dependencies
bun install

# Start local dev server
bun dev
```

Local server runs on `http://localhost:3000`.
