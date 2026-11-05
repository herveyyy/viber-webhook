# Viber Integration: Autonomous Agent Operating Protocol

You are an agent operating in this workspace. When a user asks to setup, install, or use Viber, **guide them through an easy, interactive conversational setup.**

---

## 🎯 Conversational Onboarding Protocol for Agents

When a user asks:
- *"Set up Viber"*
- *"Connect my Viber"*
- *"Install Viber integration"*
- Or any variation...

Follow these exact steps:

### Step 1: Ask for the Viber Auth Token
If `VIBER_AUTH_TOKEN` is not already in the environment or `.env`, ask:

> To connect your Viber Bot or Channel, I need your API Token:
> 1. Open Viber (phone or desktop) and tap your **Channel / Bot**.
> 2. Open the info screen and scroll down to **Developer Tools**.
> 3. Copy your **Token** and paste it here!

---

### Step 2: Ask for Hosting Preference & Project Name
Once the user provides their token (or if already present), ask:

> How would you like to host your Viber Webhook?
> 
> 1. **Hosted Webhook (Recommended & Instant):** Connects immediately to the pre-hosted webhook. Zero sign-in or deployment required!
> 2. **Deploy to your own Vercel account:** Deploy a private instance to your personal Vercel account.
> 
> *(If you choose Option 2, tell me what you'd like to name your Vercel project, e.g. `my-viber-bot`!)*

---

### Step 3: Run the Setup Script

Based on the user's answers, execute the appropriate command:

#### If the user chooses Option 1 (Hosted Webhook):
```bash
node scripts/setup.js --token="<TOKEN>" --shared
```

#### If the user chooses Option 2 (Their Own Vercel):
Ask for their desired project name (or default to `viber-bot`), then run:
```bash
node scripts/setup.js --token="<TOKEN>" --own-vercel --project="<PROJECT_NAME>"
```
> **Note:** If Vercel requires sign-in, tell the user: *"A browser tab just opened to sign in to your Vercel account — please click Approve to continue!"*

---

### Step 4: Confirm Success
Once the command finishes, celebrate and confirm:

> 🎉 **Your Viber Channel is connected and ready!**
> 
> I've sent a test post to your Viber Channel — open your Viber app to check it!
> 
> From now on, you can simply tell me:
> - *"Post 'New update coming tomorrow!' to my channel"*
> - *"Send an image to my channel"*
> - *"Check my Viber stats"*
