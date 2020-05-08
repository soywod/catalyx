import {TextInput} from "./text";

export class EmailInput extends TextInput {
  constructor() {
    super();
    this._input.type = "email";
  }
}

customElements.define("cx-email-input", EmailInput);
