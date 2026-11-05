# Viber Webhook & Channel Post Service (Bun & Vercel)

A lightweight Viber service built with **Bun** and **Hono**, ready to run locally or deploy to **Vercel** with automatic HTTPS and Let's Encrypt / DigiCert SSL certificates.

---

## Features
- **Webhook Handshake**: Responds with `200 OK` to Viber's verification callback (`event: "webhook"`).
- **Viber Channel Post API**: Easily publish posts directly to your Viber Channel subscribers.
- **Dual Runtime Support**:
  - Run locally with **Bun** (`bun dev`) or VPS / Coolify / Docker.
  - Deploy seamlessly to **Vercel Serverless Functions** (`api/index.ts`).

---

## Quick Start (Local with Bun)

```bash
# 1. Install dependencies
bun install

# 2. Run the development server
bun dev
```

The server starts at `http://localhost:3000`.

---

## Deploy to Vercel

Vercel provides a free public HTTPS domain (`https://your-project.vercel.app`) with trusted SSL, which fulfills Viber's webhook requirements immediately.

### Option A: Using Vercel CLI
```bash
# Install and login
bunx vercel login

# Deploy to preview
bunx vercel

# Deploy to production
bunx vercel --prod
```

### Option B: Using GitHub
1. Push this folder to a GitHub repository.
2. In [Vercel Dashboard](https://vercel.com/new), import the repository.
3. In **Settings -> Environment Variables**, add:
   - `VIBER_AUTH_TOKEN`: your Viber channel authentication token
   - `VIBER_SUPERADMIN_ID`: `A6PFKxy+/v9xvsugeT+S3w==`
4. Click **Deploy**.

---

## Register Webhook with Viber

Once deployed to Vercel (e.g. `https://your-app.vercel.app`):

### Using the helper endpoint:
```bash
curl -X POST https://your-app.vercel.app/api/set-webhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-app.vercel.app/webhook"}'
```

Viber will send a verification ping to `https://your-app.vercel.app/webhook`. Your service will reply with `200 OK`, unlocking your channel for messaging.

---

## Post to Your Viber Channel

To send a text announcement to all subscribers:

```bash
curl -X POST https://your-app.vercel.app/api/post-channel \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, welcome to our Viber channel!"}'
```
