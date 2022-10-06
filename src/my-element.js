import { css, html, LitElement } from 'lit';
import { assign, createMachine, interpret } from 'xstate';
import litLogo from './assets/lit.svg';

const onClick = negative => context =>
  negative ? context.count - 1 : context.count + 1;

const counterMachine = createMachine({
  id: 'counter',
  context: {
    count: 0,
  },
  initial: 'active',
  states: {
    active: {
      on: {
        INC: { actions: assign({ count: onClick(false) }) },
        DEC: { actions: assign({ count: onClick(true) }) },
      },
    },
  },
});

const counterService = interpret(counterMachine)
  .onTransition(state => console.log(state.context))
  .start();

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class MyElement extends LitElement {
  static get properties() {
    return {
      /**
       * Copy for the read the docs hint.
       */
      docsHint: { type: String },

      /**
       * The number of times the button has been clicked.
       */
      count: { type: Number },
    };
  }

  static get styles() {
    return css`
      :host {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
      }

      .logo {
        height: 6em;
        padding: 1.5em;
        will-change: filter;
      }
      .logo:hover {
        filter: drop-shadow(0 0 2em #646cffaa);
      }
      .logo.lit:hover {
        filter: drop-shadow(0 0 2em #325cffaa);
      }

      .card {
        padding: 2em;
      }

      .read-the-docs {
        color: #888;
      }

      a {
        font-weight: 500;
        color: #646cff;
        text-decoration: inherit;
      }
      a:hover {
        color: #535bf2;
      }

      h1 {
        font-size: 3.2em;
        line-height: 1.1;
      }

      button {
        border-radius: 8px;
        border: 1px solid transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #1a1a1a;
        cursor: pointer;
        transition: border-color 0.25s;
      }
      button:hover {
        border-color: #646cff;
      }
      button:focus,
      button:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
      }

      @media (prefers-color-scheme: light) {
        a:hover {
          color: #747bff;
        }
        button {
          background-color: #f9f9f9;
        }
      }
    `;
  }

  constructor() {
    super();
    this.docsHint = 'Click on the Vite and Lit logos to learn more';
    this.count = 0;
  }

  _onClick({
    target: {
      dataset: { service },
    },
  }) {
    const {
      context: { count },
    } = counterService.send(service);
    this.count = count;
  }

  render() {
    return html`
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://lit.dev" target="_blank">
          <img src=${litLogo} class="logo lit" alt="Lit logo" />
        </a>
      </div>
      <slot></slot>
      <div class="card">
        <button @click=${this._onClick} part="button" data-service="INC">
          Increment
        </button>
        <button @click=${this._onClick} part="button" data-service="DEC">
          Decrement
        </button>
      </div>
      <h2>count is ${this.count}</h2>
      <p class="read-the-docs">${this.docsHint}</p>
    `;
  }
}

window.customElements.define('my-element', MyElement);
