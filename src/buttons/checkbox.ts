import {parseStyle, parseTpl, findOrFail, transferAttrs} from "../dom-utils";
import {Tooltip} from "../dialogs";
import checkboxStyle from "./checkbox.css";
import checkboxTpl from "./checkbox.html";
import tooltipTpl from "../fields/text-tooltip.html";

export class Checkbox extends HTMLElement {
  public _input: HTMLInputElement;
  private _checkmark: HTMLSpanElement;
  private _tooltip: Tooltip;

  public constructor() {
    super();

    this.attachShadow({mode: "open", delegatesFocus: true}).append(
      parseStyle(checkboxStyle),
      parseTpl(tooltipTpl + checkboxTpl),
    );

    this._input = findOrFail(this.shadowRoot, HTMLInputElement, "input");
    this._input.title = "";
    this.removeAttribute("title");

    this._checkmark = findOrFail(this.shadowRoot, HTMLSpanElement, "checkmark");
    this._tooltip = findOrFail(this.shadowRoot, Tooltip, "validation-tooltip");

    transferAttrs(this, this._input);
  }

  protected connectedCallback() {
    this._input.addEventListener("change", this._handleChange);
  }

  protected disconnectedCallback() {
    this._input.removeEventListener("change", this._handleChange);
  }

  private _handleChange = () => {
    if (this.validate()) {
      this.dispatchEvent(new CustomEvent("change", {detail: {value: this.checked}}));
    }
  };

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

  public get checked() {
    return this._input.checked;
  }

  public set checked(val: boolean) {
    this._input.checked = val;
  }

  public toggle = () => {
    this.checked = !this.checked;
  };

  public get value() {
    return this._input.value;
  }

  public set value(val: string) {
    this._input.value = val;
  }

  public set hideCheckmark(val: boolean) {
    this._checkmark.hidden = val;
  }

  public get hideCheckmark() {
    return this._checkmark.hidden;
  }
}

customElements.define("cx-checkbox", Checkbox);
