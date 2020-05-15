import {Input} from "./input";
import style from "./checkbox.css";
import template from "./checkbox.html";
import iconError from "./icon-error.html";

export class CheckboxInput extends Input {
  constructor() {
    super(style, template + iconError);
  }

  private _toggle = () => {
    const checked = !!this._input.getAttribute("checked");

    if (!checked) {
      this._input.setAttribute("checked", "true");
    } else {
      this._input.removeAttribute("checked");
    }

    this.dispatchEvent(new CustomEvent("change", {detail: {checked: !checked}}));
  };

  connectedCallback() {
    const checkmark = this.shadowRoot && this.shadowRoot.getElementById("checkmark");

    checkmark && checkmark.addEventListener("click", this._toggle);
  }

  disconnectedCallback() {
    const checkmark = this.shadowRoot && this.shadowRoot.getElementById("checkmark");

    checkmark && checkmark.removeEventListener("click", this._toggle);
  }
}

customElements.define("cx-checkbox-input", CheckboxInput);
