# Agent Guidelines for Viber Webhook & Bot Integration

These guidelines apply to any AI agent (Antigravity, Cursor, Claude Code, Windsurf, Codex, etc.) operating in this workspace.

## 1. Viber API Architecture
- **Viber Channels (`/pa/post`):** Posts are sent to all subscribers using the Channel Superadmin ID (`from`) and Channel token.
- **1-on-1 Chats (`/pa/send_message`):** Target must be a valid Viber User ID (`receiver`) from incoming subscription callbacks. Phone numbers cannot be passed as receiver IDs.
- **Webhook Mandatory:** Outbound messages and channel posts return `Viber API error 10: webhookNotSet` unless an active public HTTPS webhook is registered with Viber.

## 2. Server Architecture
- **Bun & Hono Service:** The service in `src/` and `api/` is designed to run locally on Bun (`bun dev`) or on Vercel Edge (`api/index.ts`).
- **Webhook Ping Handling:** The `/webhook` endpoint must immediately respond with `{ "status": 0 }` (HTTP 200) when Viber sends `{"event": "webhook"}`.

## 3. Security
- Never log, commit, or print the raw `VIBER_AUTH_TOKEN` in plain text.
- Always use environment variables (`VIBER_AUTH_TOKEN`, `VIBER_SUPERADMIN_ID`).
