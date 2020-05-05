import "../number-field";

customElements.define(
  "demo-app",
  class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = `
        <p>
          <style>
            number-field {
              --border: 1px solid red;
            }
          </style>
          <number-field></number-field>
        </p>
      `;
    }
  },
);
