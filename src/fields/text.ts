import {parseStyle, parseTpl, findOrFail, Validatable} from "../dom-utils";
import {Tooltip} from "../dialogs";
import defaultStyle from "./text.css";
import prefixTpl from "./text-prefix.html";
import textTpl from "./text.html";
import textAreaTpl from "./text-area.html";
import clearTpl from "./text-clear.html";
import suffixTpl from "./text-suffix.html";
import tooltipTpl from "./text-tooltip.html";

export type TextFieldFormatFn = (val: string) => string;
export type TextFieldParams = {
  style?: string;
  tpl?: string;
};

function defaultTpl(multiple?: boolean) {
  const inputTpl = multiple ? textAreaTpl : textTpl;
  return prefixTpl + inputTpl + clearTpl + suffixTpl + tooltipTpl;
}

export class TextField extends HTMLElement implements Validatable {
  protected _input: HTMLInputElement | HTMLTextAreaElement;
  protected _tooltip: Tooltip;
  protected _clearBtn: HTMLButtonElement;

  private _prevVal = "";

  constructor(params: TextFieldParams = {}) {
    super();

    this.attachShadow({mode: "open", delegatesFocus: true}).append(
      parseStyle(params.style || defaultStyle),
      parseTpl(params.tpl || defaultTpl(this.hasAttribute("multiple"))),
    );

    try {
      this._input = findOrFail(this.shadowRoot, HTMLInputElement, "input");
    } catch (err) {
      this._input = findOrFail(this.shadowRoot, HTMLTextAreaElement, "input");
    }

    this._input.title = "";
    this._tooltip = findOrFail(this.shadowRoot, Tooltip, "validation-tooltip");
    this._clearBtn = findOrFail(this.shadowRoot, HTMLButtonElement, "clear");

    Array.from(this.attributes).forEach(attr => {
      if (!["id", "type", "part"].includes(attr.name)) {
        this._input.setAttribute(attr.name, attr.value);
      }
    });
  }

  connectedCallback() {
    this._input.addEventListener("input", this._handleInput);
    this._input.addEventListener("focus", this._handleFocus);
    this._input.addEventListener("blur", this._handleBlur);
    this._clearBtn.addEventListener("mousedown", this._clear);
    this._clearBtn.addEventListener("touchstart", this._clear);
  }

  disconnectedCallback() {
    this._input.removeEventListener("input", this._handleInput);
    this._input.removeEventListener("focus", this._handleFocus);
    this._input.removeEventListener("blur", this._handleBlur);
    this._clearBtn.removeEventListener("mousedown", this._clear);
    this._clearBtn.removeEventListener("touchstart", this._clear);
  }

  private _handleInput = () => {
    this.dispatchEvent(new CustomEvent("change", {detail: {value: this._input.value}}));
    this.validate();
  };

  private _handleFocus = () => {
    if (this._input.checkValidity()) {
      this._preFocus();
      this._input.value = this._prevVal;
      this._postFocus();
    }
  };

  private _handleBlur = () => {
    if (this._input.checkValidity()) {
      this._preBlur();
      this._prevVal = this._input.value;
      this._input.value = this._format(this._prevVal);
      this._postBlur();
    }
  };

  private _clear = (evt: MouseEvent | TouchEvent) => {
    evt.preventDefault();
    this.removeAttribute("valid");
    this.removeAttribute("invalid");
    this._input.value = "";
  };

  public validate = () => {
    this._input.title = "";

    try {
      if (!this._input.checkValidity()) {
        throw new Error(this._input.validationMessage);
      }

      this._postValidate();
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

  protected _format: TextFieldFormatFn = val => {
    return val;
  };

  set format(fn: TextFieldFormatFn) {
    this._format = fn;
  }

  protected _postConstruct = () => {
    //
  };

  protected _preFocus = () => {
    //
  };

  protected _postFocus = () => {
    //
  };

  protected _preBlur = () => {
    //
  };

  protected _postBlur = () => {
    //
  };

  protected _postValidate = () => {
    //
  };
}

customElements.define("cx-text-field", TextField);
