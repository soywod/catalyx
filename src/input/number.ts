import style from "./number.css";
import numberTemplate from "./number.html";
import signTemplate from "./sign.html";

import {Input} from "./input";

export class InputNumber extends Input {
  private _intl?: Intl.NumberFormat;
  private _inc: HTMLButtonElement;
  private _dec: HTMLButtonElement;

  private _min = -Infinity;
  private _max = Infinity;
  private _step = 1;
  private _precision = 0;
  private _prevVal = "";

  constructor() {
    super(style, numberTemplate + signTemplate);

    if (!this.shadowRoot) {
      throw new Error("Shadow root not initialized");
    }

    const inc = this.shadowRoot.getElementById("inc");
    if (!(inc instanceof HTMLButtonElement)) throw new Error("Increment button not found.");
    this._inc = inc;

    const dec = this.shadowRoot.getElementById("dec");
    if (!(dec instanceof HTMLButtonElement)) throw new Error("Decrement button not found.");
    this._dec = dec;

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
  }

  connectedCallback() {
    this._input.addEventListener("input", this._validate);
    this._input.addEventListener("keydown", this._handleKeyDown);
    this._input.addEventListener("focus", this._handleFocus);
    this._input.addEventListener("blur", this._handleBlur);
    this._inc.addEventListener("mousedown", this._handleInc);
    this._dec.addEventListener("mousedown", this._handleDec);
    this.addEventListener("wheel", this._handleWheel);
  }

  disconnectedCallback() {
    this._input.removeEventListener("input", this._validate);
    this._input.removeEventListener("keydown", this._handleKeyDown);
    this._input.removeEventListener("focus", this._handleFocus);
    this._input.removeEventListener("blur", this._handleBlur);
    this._inc.removeEventListener("mousedown", this._handleInc);
    this._dec.removeEventListener("mousedown", this._handleDec);
    this.removeEventListener("wheel", this._handleWheel);
  }

  protected _postValidate = () => {
    const num = parseFloat(this._input.value);
    if (this._input.value && isNaN(num)) {
      throw new Error(this._input.validationMessage);
    }
  };

  private _handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === "ArrowUp") {
      evt.preventDefault();
      this._handleInc();
    } else if (evt.key === "ArrowDown") {
      evt.preventDefault();
      this._handleDec();
    }
  };

  private _handleFocus = () => {
    if (this._intl && this._input.checkValidity()) {
      this._input.value = this._prevVal;
      this._input.type = "number";
    }
  };

  private _handleBlur = () => {
    if (this._intl && this._input.checkValidity()) {
      this._prevVal = this._input.value;
      this._input.type = "text";
      const val = parseFloat(this._prevVal);
      this._input.value = isNaN(val) ? "" : this._intl.format(val);
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

  get intl() {
    return this._intl;
  }

  set intl(intl: Intl.NumberFormat | undefined) {
    this._intl = intl;
  }
}

customElements.define("cx-input-number", InputNumber);
