import template from "./demo.html";

import "../heading";
import {NumberInput} from "../input";
import "../code";
import "../tooltip";

customElements.define(
  "cx-demo",
  class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = template;

      const currency = this.querySelector("#currency");
      if (currency instanceof NumberInput) {
        currency.intl = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        });
      }

      const percent = this.querySelector("#percent");
      if (percent instanceof NumberInput) {
        percent.intl = new Intl.NumberFormat("fr-FR", {
          style: "percent",
        });
      }
    }
  },
);
