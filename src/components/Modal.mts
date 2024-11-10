const template = document.createElement('template');

template.innerHTML = `
  <style>
    ::backdrop {
      background-image: linear-gradient(
        45deg,
        #F96167,
        #F9E795
      );

      opacity: 0.75;
    }

    :host {
      border-radius: 5px;
    }

    h1 {
      margin-top: 0;
      font-size: 2em;
      color: var(--primary-color, black);
    }
  </style>

  <dialog>
    <button id="close-button" aria-label="Close dialog" autofocus>&times;</button>
    <h1></h1>
    <slot name="content"></slot>
  </dialog>`;

export class Modal extends HTMLElement {
    #_shadowRoot: ShadowRoot;

    #_dialogElement?: HTMLDialogElement | null;

    #_headingElement?: HTMLHeadingElement | null;
    #_headingAttr: string = '';

    #_closeButton?: HTMLButtonElement | null;

    constructor() {
      console.log('constructor');
      super();

      this.#_shadowRoot = this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
      return ['heading'];
    }

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
      console.log('attributeChangedCallback', name, _oldValue, newValue);

      switch (name) {
        case 'heading':
          this.#_updateHeading(newValue)
          break;
      }
    }

    #_handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
      }
    };

    #_handleOnClose = () => {
      this.dispatchEvent(new CustomEvent('close'));
    };

    connectedCallback() {
      console.log('connectedCallback: Element added to the DOM');

      this.render();

      this.addEventListener('keydown', this.#_handleKeyDown);
      this.#_closeButton?.addEventListener('click', this.close);
      this.#_dialogElement?.addEventListener('close', this.#_handleOnClose);
    }

    disconnectedCallback() {
      console.log('disconnectedCallback: Element removed from the DOM');

      this.removeEventListener('keydown', this.#_handleKeyDown);
      this.#_closeButton?.removeEventListener('click', this.close);
      this.#_dialogElement?.removeEventListener('close', this.#_handleOnClose);
    }

    open = () => {
      return this.#_dialogElement!.showModal();
    }

    close = () => {
      this.#_dialogElement?.close();
    }

    get heading() {
      return this.#_headingAttr;
    }

    set heading(value: string | null | undefined) {
      if (value === this.#_headingAttr) {
        return;
      }

      if (value === null || value === undefined) {
        this.removeAttribute('heading');
        return;
      }

      this.#_headingAttr = value;
      this.setAttribute('heading', value);
    }

    #_updateHeading = (value: string) => {
      if (!this.#_headingElement) {
        return;
      }

      console.log('Updating heading element', value);
      this.#_headingElement.textContent = value;
    }

    render() {
      console.log('Rendering');
      // CSS Parts (::part) allow you to expose certain parts of the component’s Shadow DOM for styling without compromising encapsulation.

      this.#_shadowRoot.appendChild(template.content.cloneNode(true));

      this.#_headingElement = this.#_shadowRoot.querySelector('h1');
      this.#_dialogElement = this.#_shadowRoot.querySelector('dialog');
      this.#_closeButton = this.#_shadowRoot.querySelector('#close-button');

      this.#_updateHeading(this.#_headingAttr);
    }
}
