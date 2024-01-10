import { html } from 'swtl';
import {
  renderInResolvedOrder,
  delayed,
  globalStyles,
  appStyles,
} from '../utils.js';

export const template = () => html` <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>OOO</title>
      ${globalStyles()}
    </head>
    <body>
      <div>
        <template shadowrootmode="open">
          ${appStyles()}
          <header><h1>Out of order streaming without JavaScript</h1></header>
          <main>
            <slot name="list">Loading...</slot>
          </main>
          <footer>
            <div style="margin-bottom: 1rem;">
              Made by <a href="https://lamplightdev.com">lamplightdev</a> |
              <a href="https://mastodon.social/@lamplightdev">Mastodon</a> |
              <a href="https://twitter.com/lamplightdev">Twitter</a>
            </div>
            <div>
              Read the
              <a
                href="https://lamplightdev.com/blog/2024/01/10/streaming-html-out-of-order-without-javascript/"
                >blog post</a
              >
            </div>
          </footer>
        </template>

        ${delayed(
          1000,
          html` <div slot="list">
            <template shadowrootmode="open">
              <ul>
                ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                  return html`<li>
                    <slot name="item-${num}">Loading...</slot>
                  </li>`;
                })}
              </ul>
            </template>
            ${renderInResolvedOrder(
              [5, 9, 2, 1, 4, 3, 8, 6, 7, 0].map((num, index) => {
                return delayed(
                  1000 * (index + 2),
                  html` <span slot="item-${num}">Item number ${num}</span> `
                );
              })
            )}
          </div>`
        )}
      </div>
    </body>
  </html>`;
