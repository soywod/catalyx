import {parseStyle, parseTpl, findOrFail, transferAttrs} from "../dom-utils";
import {Tooltip} from "../dialogs";
import checkboxStyle from "./checkbox.css";
import checkboxTpl from "./checkbox.html";
import tooltipTpl from "../fields/text-tooltip.html";

export class Checkbox extends HTMLElement {
  private _input: HTMLInputElement;
  private _tooltip: Tooltip;

  public constructor() {
    super();

    this.attachShadow({mode: "open", delegatesFocus: true}).append(
      parseStyle(checkboxStyle),
      parseTpl(tooltipTpl + checkboxTpl),
    );

    this._input = findOrFail(this.shadowRoot, HTMLInputElement, "input");
    this._input.title = "";
    this._tooltip = findOrFail(this.shadowRoot, Tooltip, "validation-tooltip");

    transferAttrs(this, this._input);
  }

  protected connectedCallback() {
    this._input.addEventListener("change", this.validate);
  }

  protected disconnectedCallback() {
    this._input.removeEventListener("change", this.validate);
  }

  public validate = () => {
    this._input.title = "";

    try {
      if (!this._input.checkValidity()) {
        throw new Error(this._input.validationMessage);
      }

      this.removeAttribute("invalid");
      this.setAttribute("valid", "");
      return true;
    } catch (err) {
      this.removeAttribute("valid");
      this.setAttribute("invalid", "");
      this._tooltip.title = err.message;
      return false;
    }
  };
}

customElements.define("cx-checkbox", Checkbox);
