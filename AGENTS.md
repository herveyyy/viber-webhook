# Viber Integration: Autonomous Agent Operating Protocol

You are an agent operating in this workspace. When a user asks to setup, install, or use Viber, **treat them as a non-technical user who just wants it to work.**

---

## 🎯 The "1-Prompt" Onboarding Protocol

### When a user says:
- *"Set up Viber"*
- *"Connect my Viber"*
- *"I want to post to my Viber Channel"*
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

#### Step 2: Run the automated setup
As soon as the user provides the token, run:

```bash
node scripts/setup.js --token="<TOKEN>"
```

**Hosting Modes & Project Naming:**
- **Default (Hosted Webhook):** By default, it connects to the active hosted webhook (`https://viber-webhook-six.vercel.app/webhook`). No Vercel sign-in or deployment required!
- **Own Vercel Account with Custom Project Name:** If the user wants to deploy to their own Vercel account or choose their project name:
  ```bash
  node scripts/setup.js --token="<TOKEN>" --own-vercel --project="<PROJECT_NAME>"
  ```
  *(If Vercel login is required, tell them: "A browser tab just opened to sign in to your Vercel account — click Approve to continue!")*

#### Step 3: Confirm with a friendly message
Once finished, tell the user:

> 🎉 **Your Viber Channel is connected and ready!**
> 
> I've sent a test post to your Viber Channel — open your Viber app to check it!
> 
> From now on, you can just tell me:
> - *"Post 'New update coming tomorrow!' to my channel"*
> - *"Send a message"*
> - *"Check my Viber stats"*
