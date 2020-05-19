import {findOrFail, findAllOrFail, parseTpl, isValidatable} from "../dom-utils";
import tpl from "./form.html";

type Data = {[key: string]: any};

export type FormChangeEvt = {
  key: string;
  val: any;
  data: Data;
};

export class Form extends HTMLElement {
  private _form: HTMLFormElement;
  private _fields: HTMLElement[];
  private _observer: MutationObserver;
  private _data: Data = {};

  constructor() {
    super();
    this.attachShadow({mode: "open"}).append(parseTpl(tpl));

    this._form = findOrFail(this.shadowRoot, HTMLFormElement, "form");
    this._form.append(...this.children);
    this._observer = new MutationObserver(console.log);
    this._fields = findAllOrFail(this.shadowRoot, HTMLElement, "*").filter(isValidatable);
  }

  protected connectedCallback() {
    this._observer.observe(this, {childList: true});
    this._fields.forEach(field => field.addEventListener("change", this._updateData));
  }

  protected disconnectedCallback() {
    this._observer.disconnect();
    this._fields.forEach(field => field.removeEventListener("change", this._updateData));
  }

  private _updateData = (evt: Event) => {
    if (evt instanceof CustomEvent && evt.target instanceof HTMLElement) {
      const name = evt.target.getAttribute("name");
      if (name) {
        this._data[name] = evt.detail.value;
        this.dispatchEvent(
          new CustomEvent<FormChangeEvt>("change", {
            detail: {key: name, val: evt.detail.value, data: this._data},
          }),
        );

        console.debug("form change", name, evt.detail.value, this._data);
      }
    }
  };

  public submit() {
    const isFormValid = this._fields.reduce(
      (isFormValid, f) => isValidatable(f) && f.validate() && isFormValid,
      true,
    );

    if (isFormValid) {
      this.dispatchEvent(new CustomEvent<Data>("submit", this._data));
      console.debug("form submit", this._data);
    }
  }
}

customElements.define("cx-form", Form);
