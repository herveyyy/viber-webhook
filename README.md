# Viber Webhook & Antigravity Plugin

A full-stack Viber integration providing:
1. **Webhook & Channel Post API Service**: Built with Bun and Hono, deployable to Vercel (Edge Functions) with trusted SSL.
2. **Antigravity Plugin**: Bundled MCP server, skills, and operational rules for interacting with Viber bots and channels directly from Antigravity.

---

## 📦 Part 1: Antigravity Plugin Installation

The `plugin/` directory contains an installable Antigravity plugin with:
- **MCP Server**: Powered by `@serhii.zghama/viber-mcp` (13 tools for messages, pictures, videos, files, broadcasts, etc.)
- **Skill**: `/viber-bot` operational skill
- **Rules**: Guardrails for Viber media constraints, broadcast limits, and webhook requirements

### Quick Install

Run the install script from the repository root:

```bash
bun run install:plugin
# or
npm run install:plugin
```

### Manual Install

Copy the `plugin` folder to your Antigravity plugins directory:

- **Windows (PowerShell):**
  ```powershell
  Copy-Item -Recurse -Force plugin "$HOME\.gemini\config\plugins\viber"
  ```
- **macOS / Linux:**
  ```bash
  mkdir -p ~/.gemini/config/plugins/viber
  cp -r plugin/* ~/.gemini/config/plugins/viber/
  ```

### Configure the Plugin

Edit `~/.gemini/config/plugins/viber/mcp_config.json`:
```json
{
  "mcpServers": {
    "viber": {
      "command": "npx",
      "args": [
        "-y",
        "@serhii.zghama/viber-mcp"
      ],
      "env": {
        "VIBER_AUTH_TOKEN": "your-viber-auth-token",
        "VIBER_SENDER_NAME": "MyBot"
      }
    }
  }
}
```

Once installed, restart or reopen Antigravity. You can test your bot at any time by asking:
> *"@viber-bot check account info"* or *"/viber-bot please send message test"*

---

## ⚡ Part 2: Webhook & Channel Post API Service

Viber requires an active, public HTTPS webhook with trusted CA SSL before allowing outbound posts and messages.

### Deploy to Vercel

```bash
# Deploy with Vercel CLI
bunx vercel --prod
```

Or connect this repository in your [Vercel Dashboard](https://vercel.com/new).

### Environment Variables on Vercel

Set these in **Project Settings → Environment Variables**:
- `VIBER_AUTH_TOKEN`: Your Viber Channel authentication token.
- `VIBER_SUPERADMIN_ID`: Your Viber Superadmin ID (e.g., `A6PFKxy+/v9xvsugeT+S3w==`).

### Register Your Webhook

Once deployed to Vercel (e.g. `https://your-app.vercel.app`):

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
