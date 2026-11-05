import { handle } from 'hono/vercel';
import app from '../src/app';

export const config = {
  runtime: 'edge',
};

export const runtime = 'edge';

export const GET = handle(app);
export const POST = handle(app);
export default handle(app);
