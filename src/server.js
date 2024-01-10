import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { render } from 'swtl';

import { createReadableStreamFromAsyncGenerator } from './utils.js';
import { template as listTemplate } from './templates/list.js';

const app = new Hono();

app.get('/', (ctx) => {
  return stream(ctx, async (stream) => {
    ctx.res.headers.set('Content-Type', 'text/html');
    await stream.pipe(
      createReadableStreamFromAsyncGenerator(render(listTemplate()))
    );
  });
});

export default app;
