import {parseStyle, parseTemplate} from "../dom-utils";
import {getKeyFromInputEvent} from "../kb-utils";
import style from "./number.css";
import template from "./number.html";

function getPrecisionFromStep(step: number) {
  const log = Math.min(step, 1);
  return Math.abs(Math.floor(Math.log(log) / Math.log(10)));
}

export default class InputNumber extends HTMLElement {
  private _intl: Intl.NumberFormat;
  private _input: HTMLInputElement;
  private _inc: HTMLButtonElement;
  private _dec: HTMLButtonElement;

  private _rawVal = "";
  private _val = 0;

  public constructor() {
    super();

    const shadow = this.attachShadow({mode: "open", delegatesFocus: true});
    shadow.append(parseStyle(style), parseTemplate(template));

    const locale = this.getAttribute("locale") || navigator.language;
    const type = this.getAttribute("type") || "decimal";
    const currency = this.getAttribute("currency") || "USD";
    const precision = getPrecisionFromStep(Number(this.getAttribute("step") || 1));
    this._intl = new Intl.NumberFormat(locale, {
      style: type,
      currency,
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
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

    this._handleWheel = this._handleWheel.bind(this);
    this._handleFocus = this._handleFocus.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleInput = this._handleInput.bind(this);
    this._handleInc = this._handleInc.bind(this);
    this._handleDec = this._handleDec.bind(this);
  }

  public connectedCallback() {
    this.addEventListener("wheel", this._handleWheel);
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
    this._input.addEventListener("input", this._handleInput);
    this._inc.addEventListener("mousedown", this._handleInc);
    this._dec.addEventListener("mousedown", this._handleDec);
  }

  public disconnectedCallback() {
    this.removeEventListener("wheel", this._handleWheel);
    this.removeEventListener("focus", this._handleFocus);
    this.removeEventListener("blur", this._handleBlur);
    this._input.removeEventListener("input", this._handleInput);
    this._inc.removeEventListener("mousedown", this._handleInc);
    this._dec.removeEventListener("mousedown", this._handleDec);
  }

  public get intl() {
    return this._intl;
  }

  public set intl(intl: Intl.NumberFormat) {
    this._intl = intl;
  }

  private _handleWheel(evt: WheelEvent) {
    if (!(document.activeElement instanceof HTMLElement)) return;
    if (!(evt.target instanceof HTMLElement)) return;
    if (!document.activeElement.isEqualNode(evt.target)) return;

    evt.preventDefault();

    if (evt.deltaY < 0) {
      this._handleInc();
    } else {
      this._handleDec();
    }
  }

  private _handleFocus() {
    this._input.value = this._rawVal;
  }

  private _handleBlur() {
    this._rawVal = this._input.value;
    this._val = parseFloat(this._rawVal) || 0;
    this._input.value = this._rawVal === "" ? "" : this.intl.format(this._val);
  }

  private _handleInput(evt: Event) {
    if (evt instanceof InputEvent) {
      const key = getKeyFromInputEvent(evt);

      if (evt.inputType === "deleteContentBackward") {
        const caretPos = this._input.selectionStart || 0;
        this._rawVal = this._input.value;
        this._input.setSelectionRange(caretPos, caretPos);
        return;
      }

      if (!/[0-9.]+/.test(key)) {
        const caretPos = this._input.selectionStart || 0;
        this._input.value = this._rawVal;
        this._input.setSelectionRange(caretPos, caretPos - 1);
        return;
      }

      if (key === "." && this._rawVal.includes(".")) {
        const caretPos = this._input.selectionStart || 0;
        this._input.value = this._rawVal;
        this._input.setSelectionRange(caretPos, caretPos - 1);
        return;
      }

      this._rawVal = this._input.value;
    }
  }

  private _handleDec(evt?: Event) {
    evt && evt.preventDefault();
    const min = Number(this.getAttribute("min") || -Infinity);
    const step = Number(this.getAttribute("step") || 1);
    const val = parseFloat(this._input.value) || 0;
    const precision = getPrecisionFromStep(step);
    this._input.value = Number(Math.max(min, val - step)).toFixed(precision);
  }

  private _handleInc(evt?: Event) {
    evt && evt.preventDefault();
    const max = Number(this.getAttribute("max") || Infinity);
    const step = Number(this.getAttribute("step") || 1);
    const val = parseFloat(this._input.value) || 0;
    const precision = getPrecisionFromStep(step);
    this._input.value = Number(Math.min(val + step, max)).toFixed(precision);
  }
}

customElements.define("cx-input-number", InputNumber);
