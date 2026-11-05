# Viber Integration: Autonomous Agent Operating Protocol

You are an agent operating in this workspace. When a user asks to setup, install, or use Viber, **treat them as a non-technical user who just wants it to work.** Do NOT discuss webhooks, SSL certificates, DNS, or serverless infrastructure unless explicitly asked.

---

## 🎯 The "1-Prompt" Onboarding Protocol

### When a user says:
- *"Set up Viber"*
- *"Connect my Viber"*
- *"I want to post to my Viber Channel"*
- *"Send a message to Viber"*
- Or any variation...

### Follow these exact 3 steps:

#### Step 1: Check if the token is already available
Check if `VIBER_AUTH_TOKEN` is already in `.env` or the environment:
- If **YES**: Proceed directly to **Step 2**.
- If **NO**: Reply with ONLY this friendly, non-technical prompt:

> To connect your Viber Bot or Channel, I just need your API token:
> 1. Open Viber (phone or desktop) and go to your **Channel / Bot**.
> 2. Open the info screen and scroll down to **Developer Tools**.
> 3. Copy your **Token** and paste it here!

#### Step 2: Run the automated setup completely autonomously
As soon as the user provides the token (or if already present), run:

```bash
node scripts/setup.js --token="<TOKEN>" --deploy
```
*(Use `bun run setup --token="<TOKEN>" --deploy` if Bun is available).*

This autonomous setup script will automatically:
1. Validate the token directly with the Viber API.
2. Auto-detect their Channel Name and Superadmin ID (no questions asked).
3. Set up the local `.env` and `.cursor/mcp.json`.
4. Install the plugin into Antigravity (`~/.gemini/config/plugins/viber`).
5. Deploy the webhook endpoint to Vercel production and sync environment variables.
6. Register the webhook with Viber to unlock the channel/bot.
7. Dispatch an automatic confirmation test message to their channel!

> **Note on Vercel Login:** If Vercel requires authentication, tell the user in plain English: *"A browser tab just opened to sign in to Vercel — click Approve to finish connecting your hosting."*

#### Step 3: Confirm with a friendly message
Once the command finishes, tell the user:

> 🎉 **Your Viber Channel is connected and ready!**
> 
> I've sent a test post to your Viber Channel — open your Viber app to check it!
> 
> From now on, you can just tell me:
> - *"Post 'New update coming tomorrow!' to my channel"*
> - *"Send an image to my channel"*
> - *"Check my Viber channel stats"*

---

## 📡 Operational Shortcuts for the Agent

Once connected, when the user asks to send a post or message:

### 1. Posting to the Channel (Broadcasting)
Send a POST request to `https://chatapi.viber.com/pa/post`:
- Header: `X-Viber-Auth-Token: <token>`
- Body:
  ```json
  {
    "from": "<superadmin_id>",
    "type": "text",
    "text": "<message>"
  }
  ```

### 2. Direct 1-on-1 Messages
If interacting with a subscribed user ID:
Use the `viber_viber` MCP tool `send_message` with `receiver: "<user_id>"` and `text: "<message>"`.
