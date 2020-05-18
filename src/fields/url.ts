import {TextField} from "./text";

export class URLField extends TextField {
  constructor() {
    super();
    this._input.setAttribute("type", "url");
  }
}

customElements.define("cx-url-field", URLField);
