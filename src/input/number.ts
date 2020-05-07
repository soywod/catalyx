import {parseStyle, parseTemplate} from "../dom-utils";
import style from "./number.css";
import template from "./number.html";

export default class InputNumber extends HTMLElement {
  protected _input: HTMLInputElement;
  protected _warning: HTMLSpanElement;
  protected _inc: HTMLButtonElement;
  protected _dec: HTMLButtonElement;

  protected _min = -Infinity;
  protected _max = Infinity;
  protected _step = 1;
  protected _precision = 0;

  constructor() {
    super();

    const shadow = this.attachShadow({mode: "open", delegatesFocus: true});
    shadow.append(parseStyle(style), parseTemplate(template));

    const input = shadow.getElementById("input");
    if (!(input instanceof HTMLInputElement)) throw new Error("Input not found.");
    this._input = input;

    const warning = shadow.getElementById("warning");
    if (!(warning instanceof HTMLSpanElement)) throw new Error("Warning icon not found.");
    this._warning = warning;

    const inc = shadow.getElementById("inc");
    if (!(inc instanceof HTMLButtonElement)) throw new Error("Increment button not found.");
    this._inc = inc;

    const dec = shadow.getElementById("dec");
    if (!(dec instanceof HTMLButtonElement)) throw new Error("Decrement button not found.");
    this._dec = dec;

    if (this.hasAttribute("required")) {
      this._input.setAttribute("required", "");
    }

    if (this.hasAttribute("placeholder")) {
      this._input.setAttribute("placeholder", this.getAttribute("placeholder") || "");
    }

    if (this.hasAttribute("min")) {
      const min = this.getAttribute("min");
      this._input.setAttribute("min", min || "");
      this._min = Number(min || -Infinity);
    }

    if (this.hasAttribute("max")) {
      const max = this.getAttribute("max");
      this._input.setAttribute("max", max || "");
      this._max = Number(max || Infinity);
    }

    if (this.hasAttribute("step")) {
      const step = this.getAttribute("step");
      this._input.setAttribute("step", step || "");
      this._step = Number(step || 1);
    }

    // https://stackoverflow.com/questions/31001901/how-to-count-the-number-of-zero-decimals-in-javascript#answer-31002148
    // Count the number of decimals
    // n >= 0 => 0
    // n >= 0.1 => 1
    // n >= 0.01 => 2
    // ...
    this._precision = Math.abs(Math.floor(Math.log(Math.min(this._step, 1)) / Math.log(10)));
  }

  connectedCallback() {
    this.addEventListener("wheel", this._handleWheel);
    this._input.addEventListener("input", this._handleInput);
    this._input.addEventListener("keydown", this._handleKeyDown);
    this._inc.addEventListener("mousedown", this._handleInc);
    this._dec.addEventListener("mousedown", this._handleDec);
  }

  disconnectedCallback() {
    this.removeEventListener("wheel", this._handleWheel);
    this._input.removeEventListener("input", this._handleInput);
    this._input.removeEventListener("keydown", this._handleKeyDown);
    this._inc.removeEventListener("mousedown", this._handleInc);
    this._dec.removeEventListener("mousedown", this._handleDec);
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

  private _handleInput = (evt: Event) => {
    try {
      if (!(evt.target instanceof HTMLInputElement)) {
        throw new Error("Target is not a HTMLInputElement.");
      }

      if (!evt.target.checkValidity()) {
        throw new Error(this._input.validationMessage);
      }

      const num = parseFloat(this._input.value);
      if (isNaN(num)) {
        throw new Error(this._input.validationMessage);
      }

      this.removeAttribute("invalid");
      this.setAttribute("valid", "");
      this._warning.removeAttribute("title");
    } catch (err) {
      this.removeAttribute("valid");
      this.setAttribute("invalid", "");
      this._warning.setAttribute("title", err.message);
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
