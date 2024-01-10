import { render, html } from 'swtl';

export const globalStyles = () => html`
  <style>
    :root {
      --color-primary: #2d3748;
      --color-secondary: #ffc60d;
    }

    body {
      font-family: system-ui, sans-serif;
      margin: 0;
      color: var(--color-primary);
    }

    a {
      color: var(--color-primary);
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

    header,
    main,
    footer {
      padding: 1rem;
    }

    header,
    footer {
      background-color: var(--color-primary);
      color: white;
    }

    header {
      h1 {
        margin: 0;
        font-size: 1.5rem;
      }
    }

    main {
      flex-grow: 1;
    }

    footer {
      a {
        color: var(--color-secondary);
      }
    }
  </style>
`;

const encoder = new TextEncoder();

export function createReadableStreamFromAsyncGenerator(output) {
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
  let promisesWithIndexes = promises.map((promise, index) => {
    return {
      index,
      promise: promise.then((value) => {
        return { index, value };
      }),
    };
  });

  while (promisesWithIndexes.length > 0) {
    const result = await Promise.race(
      promisesWithIndexes.map((p) => p.promise)
    );
    yield* render(result.value);

    promisesWithIndexes = promisesWithIndexes.filter((promise) => {
      return promise.index !== result.index;
    });
  }
}
