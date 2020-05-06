import {parseStyle, parseTemplate} from "../dom-utils";
import style from "./number.css";
import template from "./number.html";

export default class InputNumber extends HTMLElement {
  private _intl: Intl.NumberFormat;
  private _input: HTMLInputElement;
  private _inc: HTMLButtonElement;
  private _dec: HTMLButtonElement;

  private _min: number;
  private _max: number;
  private _step: number;
  private _precision: number;

  private _rawVal = "";
  private _val = 0;

  public constructor() {
    super();

    const shadow = this.attachShadow({mode: "open", delegatesFocus: true});
    shadow.append(parseStyle(style), parseTemplate(template));

    this._min = Number(this.getAttribute("min") || -Infinity);
    this._max = Number(this.getAttribute("max") || Infinity);
    this._step = Number(this.getAttribute("step") || 1);

    // https://stackoverflow.com/questions/31001901/how-to-count-the-number-of-zero-decimals-in-javascript#answer-31002148
    // Count the number of decimals
    // n >= 0 => 0
    // n >= 0.1 => 1
    // n >= 0.01 => 2
    // ...
    this._precision = Math.abs(Math.floor(Math.log(Math.min(this._step, 1)) / Math.log(10)));

    const locale = this.getAttribute("locale") || navigator.language;
    const type = this.getAttribute("type") || "decimal";
    const currency = this.getAttribute("currency") || "USD";
    this._intl = new Intl.NumberFormat(locale, {
      style: type,
      currency,
      minimumFractionDigits: this._precision,
      maximumFractionDigits: this._precision,
    });

    const input = shadow.getElementById("input");
    if (!(input instanceof HTMLInputElement)) throw new Error("Input not found.");
    this._input = input;

    const inc = shadow.getElementById("inc");
    if (!(inc instanceof HTMLButtonElement)) throw new Error("Increment button not found.");
    this._inc = inc;

    const dec = shadow.getElementById("dec");
    if (!(dec instanceof HTMLButtonElement)) throw new Error("Decrement button not found.");
    this._dec = dec;
  }

  public connectedCallback() {
    this.addEventListener("wheel", this._handleWheel);
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
    this._input.addEventListener("input", this._handleInput);
    this._input.addEventListener("keydown", this._handleKeyDown);
    this._inc.addEventListener("mousedown", this._handleInc);
    this._dec.addEventListener("mousedown", this._handleDec);
  }

  public disconnectedCallback() {
    this.removeEventListener("wheel", this._handleWheel);
    this.removeEventListener("focus", this._handleFocus);
    this.removeEventListener("blur", this._handleBlur);
    this._input.removeEventListener("input", this._handleInput);
    this._input.removeEventListener("keydown", this._handleKeyDown);
    this._inc.removeEventListener("mousedown", this._handleInc);
    this._dec.removeEventListener("mousedown", this._handleDec);
  }

  public get intl() {
    return this._intl;
  }

  public set intl(intl: Intl.NumberFormat) {
    this._intl = intl;
  }

  private _handleWheel = (evt: WheelEvent) => {
    if (!(document.activeElement instanceof HTMLElement)) return;
    if (!(evt.target instanceof HTMLElement)) return;
    if (!document.activeElement.isEqualNode(evt.target)) return;

    evt.preventDefault();

    if (evt.deltaY < 0) {
      this._handleInc();
    } else {
      this._handleDec();
    }
  };

  private _handleFocus = () => {
    this._input.value = this._rawVal;
  };

  private _handleBlur = () => {
    this._rawVal = this._input.value;
    this._val = parseFloat(this._rawVal) || 0;
    this._input.value = this._rawVal === "" ? "" : this.intl.format(this._val);
  };

  private _handleInput = (evt: Event) => {
    if (evt instanceof InputEvent) {
      if (evt.inputType === "deleteContentBackward") {
        this._rawVal = this._input.value;
        return;
      }

      const val = parseFloat(this._input.value) || 0;
      const minusSignPattern = this._min < 0 ? "-?" : "";
      const fractionPattern = this._precision === 0 ? "" : `\\.?\\d{0,${this._precision}}`;
      const numPattern = `^${minusSignPattern}\\d*?${fractionPattern}$`;
      const matchDecimal = new RegExp(numPattern, "g").test(this._input.value);

      if (matchDecimal && val >= this._min && val <= this._max) {
        this._rawVal = this._input.value;
      } else {
        // Revert value and caret pos
        const caretPos = this._input.selectionStart || 0;
        this._input.value = this._rawVal;
        this._input.setSelectionRange(caretPos, caretPos - 1);
      }
    }
  };

  private _handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === "ArrowUp") {
      this._handleInc();
    } else if (evt.key === "ArrowDown") {
      evt.preventDefault();
      this._handleDec();
    }
  };

  private _handleDec = (evt?: Event) => {
    evt && evt.preventDefault();
    const val = parseFloat(this._input.value) || 0;
    this._input.value = Number(Math.max(this._min, val - this._step)).toFixed(this._precision);
  };

  private _handleInc = (evt?: Event) => {
    evt && evt.preventDefault();
    const val = parseFloat(this._input.value) || 0;
    this._input.value = Number(Math.min(val + this._step, this._max)).toFixed(this._precision);
  };
}

customElements.define("cx-input-number", InputNumber);
