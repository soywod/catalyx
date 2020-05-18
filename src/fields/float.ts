import {NumberField} from "./number";

export class FloatField extends NumberField {
  constructor() {
    super({step: 0.01});
  }
}

customElements.define("cx-float-field", FloatField);
