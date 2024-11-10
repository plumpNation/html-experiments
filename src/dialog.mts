import { Modal } from './components/Modal.mts';

customElements.define('wc-modal', Modal);

const getModal = () => {
  const modal = createModal();

  modal.querySelector('form')?.addEventListener('submit', (event) => {
    console.log('Form submitted', event);
  });

  modal.addEventListener('close', () => {
    console.log('Heard modal close event, removing modal from DOM');
    modal.remove();
  });

  return modal;
};

const showDialogAsModal = () => {
  getModal().open();
};

/**
 * Don't open as a modal i.e. allow interaction with the rest of the page
 * by not rendering a backdrop.
 */
const showDialog = () => {
  getModal().close();
};

const createModal = (): Modal => {
  const markup = `
    <wc-modal
      id="my-modal"
      heading="Jeff sees you"
      type="error"
    >
      <form method="dialog" slot="content">
        <input type="text" />
        <button>Submit</button>
      </form>
    </wc-modal>
  `;

  const range = document.createRange();
  const fragment = range.createContextualFragment(markup);

  const modal = fragment.querySelector("wc-modal") as Modal;

  document.body.appendChild(fragment);

  return modal;
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#show-modal')?.addEventListener('click', showDialogAsModal);
  document.querySelector('#show-dialog')?.addEventListener('click', showDialog);
});