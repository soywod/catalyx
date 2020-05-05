import "../number-field";

customElements.define(
  "demo-app",
  class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = `
        <p>
          <number-field></number-field>
        </p>
      `;
    }
  },
);
