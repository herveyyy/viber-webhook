# Agent Guidelines for Viber Webhook & Bot Integration

These guidelines apply to any AI agent (Antigravity, Cursor, Claude Code, Windsurf, Codex, etc.) operating in this workspace.

## 🚀 Automated Setup Flow for Agents
When a user asks you to "set up Viber", "install Viber plugin", or "configure Viber":

1. Ask the user for their `VIBER_AUTH_TOKEN` (found in their Viber Channel/Bot info screen → Developer Tools) if not already present in the environment.
2. Run the automated setup script:
   ```bash
   bun run setup --token=<TOKEN> --deploy
   # or
   npm run setup -- --token=<TOKEN> --deploy
   ```
   *The setup script automatically:*
   - Validates the token against the Viber API.
   - Auto-detects the account/channel name and Superadmin ID.
   - Configures `.env` and `.cursor/mcp.json`.
   - Installs the plugin into Antigravity (`~/.gemini/config/plugins/viber/`).
   - Checks Vercel CLI login, deploys to Vercel Edge, and configures Vercel env vars.
   - Registers the `/webhook` endpoint with Viber.
   - Optionally dispatches an initial test announcement.

## 📡 Viber API Architecture
- **Viber Channels (`/pa/post`):** Posts are sent to all subscribers using the Channel Superadmin ID (`from`) and Channel token.
- **1-on-1 Chats (`/pa/send_message`):** Target must be a valid Viber User ID (`receiver`) from incoming subscription callbacks. Phone numbers cannot be passed as receiver IDs.
- **Webhook Mandatory:** Outbound messages and channel posts return `Viber API error 10: webhookNotSet` unless an active public HTTPS webhook is registered with Viber.

## 🛠️ Server Architecture
- **Bun & Hono Service:** The service in `src/` and `api/` runs locally on Bun (`bun dev`) or on Vercel Edge (`api/index.ts`).
- **Webhook Ping Handling:** The `/webhook` endpoint immediately responds with `{ "status": 0 }` (HTTP 200) when Viber sends `{"event": "webhook"}`.

## 🔒 Security
- Never log, commit, or print the raw `VIBER_AUTH_TOKEN` in plain text.
- Always use environment variables (`VIBER_AUTH_TOKEN`, `VIBER_SUPERADMIN_ID`).
