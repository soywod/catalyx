import {TextField} from "./text";

export class EmailField extends TextField {
  constructor() {
    super();
    this._input.setAttribute("type", "email");
  }
}

customElements.define("cx-email-field", EmailField);
