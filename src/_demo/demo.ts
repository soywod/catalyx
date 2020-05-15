import template from "./demo.html";

import "../tooltip";
import "../heading";
import {NumberInput, DatePicker, CheckboxInput} from "../input";
import "../code";

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

      const date = this.querySelector("#date");
      if (date instanceof DatePicker) {
        date.addEventListener("change", console.log);
      }

      const checkbox = this.querySelector("#checkbox");
      if (checkbox instanceof CheckboxInput) {
        checkbox.addEventListener("change", console.log);
      }
    }
  },
);
