import {FloatField} from "./float";

export class CurrencyField extends FloatField {
  constructor() {
    super();

    const locale = this.getAttribute("locale") || navigator.language;
    const currency = this.getAttribute("currency") || "EUR";
    const intl = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: this._precision,
      maximumFractionDigits: this._precision,
    });

    this.format = strVal => {
      const numVal = parseFloat(strVal);
      return isNaN(numVal) ? "" : intl.format(numVal);
    };
  }
}

customElements.define("cx-currency-field", CurrencyField);
