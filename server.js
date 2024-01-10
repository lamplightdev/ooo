import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { html, render } from 'swtl';
import {
  createReadableStream,
  renderInResolvedOrder,
  delayed,
  globalStyles,
  appStyles,
} from './utils.js';

const app = new Hono();

app.use('/public/*', serveStatic({ root: './' }));

app.get('/', (ctx) => {
  const template = html`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>OOO</title>
      ${globalStyles()}
    </head>
    <body>
      <my-app>
        <template shadowrootmode="open">
          ${appStyles()}
          <header>Header</header>
          <main>
            <slot name="a">Loading A...</slot>
            <slot name="b">Loading B...</slot>
          </main>
          <footer>Footer</footer>
        </template>
        ${renderInResolvedOrder([
          delayed(
            2000,
            html`
              <h2 slot="a">
                Delayed A
                <div>
                  <template shadowrootmode="open">
                    <slot name="a">Loading...</slot>
                  </template>
                  ${delayed(3000, '<span slot="a">Boo!</span>')}
                </div>
              </h2>`
          ),
          delayed(
            1000,
            html`
            <h2 slot="b">Delayed B</h2>
          `
          ),
        ])}
      </my-app>
    </body>
  </html>`;

  return stream(ctx, async (stream) => {
    ctx.res.headers.set('Content-Type', 'text/html');
    await stream.pipe(createReadableStream(render(template)));
  });
});

serve(app);
