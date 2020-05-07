import {heading} from "../heading/_demo";
import {input} from "../input/_demo";

import "../table";
import "../code";

customElements.define(
  "cx-demo",
  class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = `
        <cx-heading separator>
          <h1>Catalyx</h1>
        </cx-heading>

        ${heading}
        ${input}
      `;
    }
  },
);
