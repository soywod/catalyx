import "../heading";
import "../input/number";

customElements.define(
  "cx-demo",
  class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = `
        <cx-heading>
          <h1>Catalyx</h1>
        </cx-heading>

        <cx-heading>
          <h2>Inputs</h2>
        </cx-heading>

        <cx-input-number type="percent" currency="USD"></cx-input-number>
      `;
    }
  },
);
