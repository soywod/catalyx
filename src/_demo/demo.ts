import template from "./demo.html";

import "../layouts";
import {Button} from "../buttons";
import {Toast} from "../dialogs";
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

      const toast = this.querySelector("#toast");
      if (toast instanceof Button) {
        toast.addEventListener("click", () => Toast.show("Default toast."));
      }

      const toastPrimary = this.querySelector("#toast-primary");
      if (toastPrimary instanceof Button) {
        toastPrimary.addEventListener("click", () =>
          Toast.show("Primary toast.", {type: "primary"}),
        );
      }

      const toastError = this.querySelector("#toast-error");
      if (toastError instanceof Button) {
        toastError.addEventListener("click", () => Toast.show("Error toast.", {type: "error"}));
      }
    }
  },
);
