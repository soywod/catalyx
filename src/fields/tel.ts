import {TextField} from "./text";

export class TelField extends TextField {
  constructor() {
    super();

    this._input.setAttribute("type", "tel");

    if (!this._input.hasAttribute("pattern")) {
      this._input.setAttribute("pattern", "[0-9]+");
    }
  }
}

customElements.define("cx-tel-field", TelField);
