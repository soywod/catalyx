import template from "./demo.html";

import "../layouts";
import "../buttons";
import "../dialogs";
import {TextField} from "../fields";
import {DatePicker} from "../pickers";

customElements.define(
  "cx-demo",
  class extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = template;

      const date = this.querySelector("#date");
      if (date instanceof DatePicker) {
        date.addEventListener("change", console.log);
      }

      const textFieldFormat = this.querySelector("#text-field-format");
      if (textFieldFormat instanceof TextField) {
        textFieldFormat.format = val => val.split("").reverse().join("");
      }

      const form = this.querySelector("#form");
      if (form instanceof HTMLFormElement) {
        /* form.addEventListener("submit", evt => { */
        /*   evt.preventDefault(); */
        /*   console.log( */
        /*     Array.from(form.querySelectorAll("* /deep/ *")) */
        /*       .filter(elem => customElements.get(elem.tagName.toLowerCase())) */
        /*       .filter(elem => elem instanceof HTMLElement) */
        /*       .filter(elem => elem instanceof HTMLElement && elem.value), */
        /*   ); */
        /* }); */
      }
    }
  },
);
