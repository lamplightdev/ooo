import { render, html } from 'swtl';

export const globalStyles = () => html`
  <style>
    body {
      font-family: sans-serif;
      margin: 0;
    }
  </style>
`;

export const appStyles = () => html`
<style>
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    header, main, footer {
      padding: 1rem;
    }

    header, footer {
      background-color: #666;
      color: white;
    }

    main {
      flex-grow: 1;
    }
</style>
`;

const encoder = new TextEncoder();

export function createReadableStream(output) {
  return new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await output.next();

        if (done) {
          controller.close();
          break;
        }

        controller.enqueue(encoder.encode(value));
      }
    },
  });
}

export const delayed = (ms, data) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, ms);
  });

export async function* renderInResolvedOrder(promises) {
  promises = promises.map((promise) => {
    let p = promise.then((val) => {
      promises.splice(promises.indexOf(p), 1);
      return val;
    });
    return p;
  });

  while (promises.length > 0) {
    const result = await Promise.race(promises);
    yield* render(result);
  }
}
