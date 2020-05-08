import {Input} from "./input";
import style from "./text.css";
import template from "./text.html";
import iconError from "./icon-error.html";

export class TextInput extends Input {
  constructor() {
    super(style, template + iconError);
  }

  connectedCallback() {
    this._input.addEventListener("input", this._validate);
  }

  disconnectedCallback() {
    this._input.removeEventListener("input", this._validate);
  }
}

customElements.define("cx-text-input", TextInput);
