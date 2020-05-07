import InputNumber from "./number";

export default class InputCurrency extends InputNumber {
  private _intl: Intl.NumberFormat;
  private _prevVal = "";

  constructor() {
    super();

    const locale = this.getAttribute("locale") || navigator.language;
    const currency = this.getAttribute("currency") || "USD";
    this._intl = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: this._precision,
      maximumFractionDigits: this._precision,
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._input.addEventListener("focus", this._handleFocus);
    this._input.addEventListener("blur", this._handleBlur);
  }

  disconnectedCallback() {
    super.connectedCallback();
    this._input.removeEventListener("focus", this._handleFocus);
    this._input.removeEventListener("blur", this._handleBlur);
  }

  private _handleFocus = () => {
    if (this._input.checkValidity()) {
      this._input.value = this._prevVal;
      this._input.type = "number";
    }
  };

  private _handleBlur = () => {
    if (this._input.checkValidity()) {
      this._prevVal = this._input.value;
      this._input.type = "text";
      const val = parseFloat(this._prevVal);
      this._input.value = isNaN(val) ? "" : this._intl.format(val);
    }
  };

  get intl() {
    return this._intl;
  }

  set intl(intl: Intl.NumberFormat) {
    this._intl = intl;
  }
}

customElements.define("cx-input-currency", InputCurrency);
