import app from './app';

const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Viber Bun server is running on http://localhost:${port}`);
console.log(`📡 Webhook endpoint: http://localhost:${port}/webhook`);

export default {
  port,
  fetch: app.fetch,
};
