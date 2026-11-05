import { Hono } from 'hono';

const app = new Hono();

// Helper to get environment variables across Bun, Node, and Vercel Edge
const getEnv = (c?: any) => ({
  authToken: process.env.VIBER_AUTH_TOKEN || c?.env?.VIBER_AUTH_TOKEN || '',
  superadminId: process.env.VIBER_SUPERADMIN_ID || c?.env?.VIBER_SUPERADMIN_ID || 'A6PFKxy+/v9xvsugeT+S3w==',
});

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    message: 'Viber Bun Webhook Service is running!',
    runtime: typeof Bun !== 'undefined' ? 'Bun' : 'Vercel Edge',
  });
});

/**
 * 1. Webhook Endpoint
 * Viber sends a POST request here to verify the webhook ("event": "webhook")
 * and for all incoming channel / bot events.
 */
app.post('/webhook', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    console.log('[Viber Event Received]:', JSON.stringify(body, null, 2));

    // Handle initial webhook verification ping from Viber
    if (body.event === 'webhook') {
      console.log('Successfully validated Viber webhook handshake!');
      return c.json({ status: 0, status_message: 'ok' }, 200);
    }

    // Acknowledge all other events (messages, subscribed, etc.)
    return c.json({ status: 0, status_message: 'ok' }, 200);
  } catch (err) {
    console.error('Error handling webhook payload:', err);
    // Still return 200 to prevent Viber from retrying broken deliveries
    return c.json({ status: 0 }, 200);
  }
});

/**
 * 2. Channel Post API Endpoint
 * Posts a message to your Viber Channel.
 * Usage: POST /api/post-channel with JSON: { "text": "Your message" }
 */
app.post('/api/post-channel', async (c) => {
  const { authToken, superadminId } = getEnv(c);

  if (!authToken) {
    return c.json({ error: 'VIBER_AUTH_TOKEN is not configured.' }, 500);
  }

  const { text } = await c.req.json().catch(() => ({ text: '' }));
  if (!text) {
    return c.json({ error: 'Field "text" is required.' }, 400);
  }

  try {
    const response = await fetch('https://chatapi.viber.com/pa/post', {
      method: 'POST',
      headers: {
        'X-Viber-Auth-Token': authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: superadminId,
        type: 'text',
        text: text,
      }),
    });

    const result = await response.json();
    return c.json(result, response.status as any);
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to post message to Viber Channel' }, 500);
  }
});

/**
 * 3. Register Webhook Helper
 * Registers your public HTTPS webhook URL with Viber.
 * Usage: POST /api/set-webhook with JSON: { "url": "https://your-domain.vercel.app/webhook" }
 */
app.post('/api/set-webhook', async (c) => {
  const { authToken } = getEnv(c);

  if (!authToken) {
    return c.json({ error: 'VIBER_AUTH_TOKEN is not configured.' }, 500);
  }

  const { url } = await c.req.json().catch(() => ({ url: '' }));
  if (!url || !url.startsWith('https://')) {
    return c.json({ error: 'A valid public HTTPS "url" is required.' }, 400);
  }

  const targetUrl = url.endsWith('/webhook') ? url : `${url.replace(/\/$/, '')}/webhook`;

  try {
    const response = await fetch('https://chatapi.viber.com/pa/set_webhook', {
      method: 'POST',
      headers: {
        'X-Viber-Auth-Token': authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: targetUrl,
      }),
    });

    const result = await response.json();
    return c.json(result, response.status as any);
  } catch (error: any) {
    return c.json({ error: error.message || 'Failed to set webhook' }, 500);
  }
});

export default app;
