import {Input} from "./input";
import style from "./password.css";
import template from "./password.html";
import iconError from "./icon-error.html";
import iconVisible from "./icon-visible.html";
import iconHidden from "./icon-hidden.html";

export class InputPassword extends Input {
  _toggler: HTMLSpanElement;

  constructor() {
    super(style, template + iconError);

    const toggler = this.shadowRoot && this.shadowRoot.getElementById("toggler");
    if (!(toggler instanceof HTMLButtonElement)) throw new Error("Toggler not found.");
    this._toggler = toggler;
    this._toggler.innerHTML = iconHidden;
  }

  connectedCallback() {
    this._input.addEventListener("input", this._validate);
    this._toggler.addEventListener("mousedown", this._toggleVisibility);
  }

  disconnectedCallback() {
    this._input.removeEventListener("input", this._validate);
    this._toggler.removeEventListener("mousedown", this._toggleVisibility);
  }

  private _toggleVisibility = (evt: MouseEvent) => {
    evt.preventDefault();

    if (this._input.type === "text") {
      this._toggler.innerHTML = iconHidden;
      this._input.type = "password";
    } else {
      this._toggler.innerHTML = iconVisible;
      this._input.type = "text";
    }
  };
}

customElements.define("cx-input-password", InputPassword);
