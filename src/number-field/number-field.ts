import style from "./number-field.css";

const template = `
  <input id="input" part="input" type="number" inputmode="decimal">
  <button id="inc" part="increment" tabindex="-1">&#9650;</button>
  <button id="dec" part="decrement" tabindex="-1">&#9660;</button>
`;

type NumberFieldChangeEvent = Event & {
  value: number | undefined;
};

export default class NumberField extends HTMLElement {
  private _intl: Intl.NumberFormat;
  private _input: HTMLInputElement;
  private _inc: HTMLButtonElement;
  private _dec: HTMLButtonElement;
  private _val?: number;

  public constructor() {
    super();

    const shadow = this.attachShadow({mode: "open", delegatesFocus: true});
    shadow.innerHTML = `<style>${style}</style>` + template;

    const locale = this.getAttribute("locale") || "en-US";
    const type = this.getAttribute("type") || "decimal";
    const currency = this.getAttribute("currency") || "USD";
    this._intl = new Intl.NumberFormat(locale, {style: type, currency});

    const input = shadow.getElementById("input");
    if (!(input instanceof HTMLInputElement)) throw new Error("Input not found.");
    this._input = input;

    const inc = shadow.getElementById("inc");
    if (!(inc instanceof HTMLButtonElement)) throw new Error("Inc button not found.");
    this._inc = inc;

    const dec = shadow.getElementById("dec");
    if (!(dec instanceof HTMLButtonElement)) throw new Error("Dec button not found.");
    this._dec = dec;

    this._handleWheel = this._handleWheel.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleFocus = this._handleFocus.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleInc = this._handleInc.bind(this);
    this._handleDec = this._handleDec.bind(this);
  }

  public connectedCallback() {
    this.addEventListener("wheel", this._handleWheel);
    this.addEventListener("keydown", this._handleKeyDown);
    this._input.addEventListener("focus", this._handleFocus);
    this._input.addEventListener("blur", this._handleBlur);
    this._input.addEventListener("change", this._handleChange);
    this._inc.addEventListener("mousedown", this._handleInc);
    this._dec.addEventListener("mousedown", this._handleDec);
  }

  public disconnectedCallback() {
    this.removeEventListener("wheel", this._handleWheel);
    this.removeEventListener("keydown", this._handleKeyDown);
    this._input.removeEventListener("focus", this._handleFocus);
    this._input.removeEventListener("blur", this._handleBlur);
    this._input.removeEventListener("change", this._handleChange);
    this._inc.removeEventListener("mousedown", this._handleInc);
    this._dec.removeEventListener("mousedown", this._handleDec);
  }

  public get value() {
    return this._val;
  }

  public set value(val: number | undefined) {
    this._val = val;
    switch (this._input.getAttribute("type")) {
      case "number":
        this._input.value = val === undefined ? "" : String(val);
        break;

      case "text":
      default:
        this._input.value = val === undefined ? "" : this._intl.format(val);
        break;
    }
  }

  public get intl() {
    return this._intl;
  }

  public set intl(intl: Intl.NumberFormat) {
    this._intl = intl;
  }

  private _handleKeyDown(evt: KeyboardEvent) {
    if (evt.key === "ArrowUp" || evt.which === 38) {
      evt.preventDefault();
      this._handleInc();
    } else if (evt.key === "ArrowDown" || evt.which === 40) {
      evt.preventDefault();
      this._handleDec();
    }
  }

  private _handleWheel(evt: WheelEvent) {
    evt.preventDefault();

    if (evt.deltaY < 0) {
      this._handleInc();
    } else {
      this._handleDec();
    }
  }

  private _handleFocus() {
    this._input.value = this._val ? String(this._val) : "";
    this._input.setAttribute("type", "number");
  }

  private _handleBlur() {
    this._input.setAttribute("type", "text");
    this._input.value = this._val ? this._intl.format(this._val) : "";
  }

  private _handleChange(evt: Event) {
    if (evt.target instanceof HTMLInputElement) {
      const min = Number(this.getAttribute("min") || -Infinity);
      const max = Number(this.getAttribute("max") || Infinity);
      this.value = Math.max(min, Math.min(Number(evt.target.value), max));
      const changeEvt: NumberFieldChangeEvent = Object.assign(
        new Event("change", {bubbles: true, composed: true}),
        {value: this.value},
      );

      this.dispatchEvent(changeEvt);
    }
  }

  private _handleDec() {
    const min = Number(this.getAttribute("min") || -Infinity);
    const step = Number(this.getAttribute("step") || 1);
    const numVal = this.value || 0;
    this.value = Number(Math.max(min, numVal - step).toFixed(2));
  }

  private _handleInc() {
    const max = Number(this.getAttribute("max") || Infinity);
    const step = Number(this.getAttribute("step") || 1);
    const numVal = this.value || 0;
    this.value = Number(Math.min(numVal + step, max).toFixed(2));
  }
}

customElements.define("number-field", NumberField);
