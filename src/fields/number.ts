import {findOrFail} from "../dom-utils";
import {TextField, TextFieldParams} from "./text";
import textStyle from "./text.css";
import prefixTpl from "./text-prefix.html";
import textTpl from "./text.html";
import clearTpl from "./text-clear.html";
import suffixTpl from "./text-suffix.html";
import tooltipTpl from "./text-tooltip.html";
import numberStyle from "./number.css";
import controllersTpl from "./number.html";

const style = textStyle + numberStyle;
const tpl = prefixTpl + textTpl + clearTpl + controllersTpl + suffixTpl + tooltipTpl;

export type NumberFieldParams = TextFieldParams & {
  min?: number;
  max?: number;
  step?: number;
};

export class NumberField extends TextField {
  protected _input: HTMLInputElement;
  protected _inc: HTMLButtonElement;
  protected _dec: HTMLButtonElement;

  protected _min: number;
  protected _max: number;
  protected _step: number;
  protected _precision: number;

  constructor(params: NumberFieldParams = {}) {
    super({style: params.style || style, tpl: params.tpl || tpl});

    this._input = findOrFail(this.shadowRoot, HTMLInputElement, "input");
    this._inc = findOrFail(this.shadowRoot, HTMLButtonElement, "inc");
    this._dec = findOrFail(this.shadowRoot, HTMLButtonElement, "dec");

    this._min = Number(this.getAttribute("min") || params.min || -Infinity);
    this._max = Number(this.getAttribute("max") || params.max || Infinity);
    this._step = Number(this.getAttribute("step") || params.step || 1);
    this._precision = Math.abs(Math.floor(Math.log(Math.min(this._step, 1)) / Math.log(10)));

    if (this.hasAttribute("autoformat")) {
      const locale = this.getAttribute("locale") || navigator.language;
      const intl = new Intl.NumberFormat(locale, {
        minimumFractionDigits: this._precision,
        maximumFractionDigits: this._precision,
      });

      this._format = strVal => {
        const numVal = parseFloat(strVal);
        return isNaN(numVal) ? "" : intl.format(numVal);
      };
    }

    // Reflect host attributes to input
    this._input.setAttribute("type", "number");
    this._input.setAttribute("min", this._min.toString());
    this._input.setAttribute("max", this._max.toString());
    this._input.setAttribute("step", this._step.toString());
  }

  connectedCallback() {
    super.connectedCallback();
    this._input.addEventListener("keydown", this._handleKeyDown);
    this._inc.addEventListener("mousedown", this._handleInc);
    this._dec.addEventListener("mousedown", this._handleDec);
    this.addEventListener("wheel", this._handleWheel);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._input.removeEventListener("keydown", this._handleKeyDown);
    this._inc.removeEventListener("mousedown", this._handleInc);
    this._dec.removeEventListener("mousedown", this._handleDec);
    this.removeEventListener("wheel", this._handleWheel);
  }

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
    this._validate();
  };

  private _handleInc = (evt?: Event) => {
    evt && evt.preventDefault();
    const val = parseFloat(this._input.value) || 0;
    this._input.value = Number(Math.min(val + this._step, this._max)).toFixed(this._precision);
    this._validate();
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

  protected _preFocus = () => {
    this._input.setAttribute("type", "number");
  };

  protected _preBlur = () => {
    this._input.setAttribute("type", "text");
  };

  protected _postValidate = () => {
    const num = parseFloat(this._input.value);
    if (this._input.value && isNaN(num)) {
      throw new Error(this._input.validationMessage);
    }
  };
}

customElements.define("cx-number-field", NumberField);
