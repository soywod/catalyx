import style from "./text.css";
import textTemplate from "./text.html";
import signTemplate from "./sign.html";

import {Input} from "./input";

export class InputText extends Input {
  constructor() {
    super(style, textTemplate + signTemplate);
  }

  connectedCallback() {
    this._input.addEventListener("input", this._validate);
  }

  disconnectedCallback() {
    this._input.removeEventListener("input", this._validate);
  }
}

customElements.define("cx-input-text", InputText);
