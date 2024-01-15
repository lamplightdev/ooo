import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { render } from 'swtl';

import { template as listTemplate } from './templates/list.js';
import { createReadableStreamFromAsyncGenerator } from './utils.js';

const app = new Hono();
const port = 3000;

app.get('/', (ctx) => {
  return stream(ctx, async (stream) => {
    ctx.res.headers.set('Content-Type', 'text/html');
    await stream.pipe(
      createReadableStreamFromAsyncGenerator(render(listTemplate()))
    );
  });
});

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
