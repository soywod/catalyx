import template from "./demo.html";

import "../heading";
import {InputNumber} from "../input";
import "../code";

customElements.define(
  "cx-demo",
  class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = template;

      const currency = this.querySelector("#currency");
      if (currency instanceof InputNumber) {
        currency.intl = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        });
      }

      const percent = this.querySelector("#percent");
      if (percent instanceof InputNumber) {
        percent.intl = new Intl.NumberFormat("fr-FR", {
          style: "percent",
        });
      }
    }
  },
);
