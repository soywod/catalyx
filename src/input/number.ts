import {parseStyle, parseTemplate} from "../dom-utils";
import {getKeyFromKeyboardEvent} from "../kb-utils";
import style from "./number.css";
import template from "./number.html";

const IGNORED_KEYS = [
  "Alt",
  "ArrowLeft",
  "ArrowRight",
  "Backspace",
  "Control",
  "Delete",
  "Enter",
  "Meta",
  "Shift",
  "Tab",
];

/* type NumberFieldChangeEvent = Event & { */
/*   value: number | undefined; */
/* }; */

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
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleFocus = this._handleFocus.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleInc = this._handleInc.bind(this);
    this._handleDec = this._handleDec.bind(this);
  }

  public connectedCallback() {
    this.addEventListener("wheel", this._handleWheel);
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
    this.addEventListener("keydown", this._handleKeyDown);
    this._inc.addEventListener("mousedown", this._handleInc);
    this._dec.addEventListener("mousedown", this._handleDec);
  }

  public disconnectedCallback() {
    this.removeEventListener("wheel", this._handleWheel);
    this.removeEventListener("focus", this._handleFocus);
    this.removeEventListener("blur", this._handleBlur);
    this.removeEventListener("keydown", this._handleKeyDown);
    this._inc.removeEventListener("mousedown", this._handleInc);
    this._dec.removeEventListener("mousedown", this._handleDec);
  }

  public get intl() {
    return this._intl;
  }

  public set intl(intl: Intl.NumberFormat) {
    this._intl = intl;
  }

  private _handleKeyDown(evt: KeyboardEvent) {
    const key = getKeyFromKeyboardEvent(evt).replace(/,/g, ".");

    if (IGNORED_KEYS.includes(key) || evt.ctrlKey || evt.altKey || evt.metaKey) {
      return;
    }

    if (key === "ArrowDown") {
      evt.preventDefault();
      return this._handleDec();
    }

    if (key === "ArrowUp") {
      evt.preventDefault();
      return this._handleInc();
    }

    if (!/[0-9.]+/.test(key)) {
      return evt.preventDefault();
    }

    if (key === ".") {
      evt.preventDefault();

      if (!this._input.value.includes(".")) {
        this._input.value += ".";
      }
    }
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
