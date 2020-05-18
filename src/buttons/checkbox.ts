import {TextField} from "../fields";
import tooltipTpl from "../fields/text-tooltip.html";
import clearTpl from "../fields/text-clear.html";
import style from "./checkbox.css";
import checkboxTpl from "./checkbox.html";

export class CheckboxInput extends TextField {
  constructor() {
    super({style, tpl: checkboxTpl + clearTpl + tooltipTpl});
  }

  private _toggle = () => {
    const checked = this._input.hasAttribute("checked");

    if (!checked) {
      this._input.setAttribute("checked", "");
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
