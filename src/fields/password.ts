import {findOrFail} from "../dom-utils";
import iconVisible from "../icons/opened-eye.svg";
import iconHidden from "../icons/closed-eye.svg";
import {TextField} from "./text";
import textStyle from "./text.css";
import prefixTpl from "./text-prefix.html";
import textTpl from "./text.html";
import clearTpl from "./text-clear.html";
import suffixTpl from "./text-suffix.html";
import tooltipTpl from "./text-tooltip.html";
import visibilityTpl from "./password.html";
import passwordStyle from "./password.css";

const style = textStyle + passwordStyle;
const tpl = prefixTpl + textTpl + clearTpl + visibilityTpl + suffixTpl + tooltipTpl;

export class PasswordField extends TextField {
  _toggler: HTMLButtonElement;

  constructor() {
    super({style, tpl});

    this._input.setAttribute("type", "password");
    this._toggler = findOrFail(this.shadowRoot, HTMLButtonElement, "toggler");
    this._toggler.innerHTML = iconHidden;
  }

  connectedCallback() {
    super.connectedCallback();
    this._toggler.addEventListener("mousedown", this._toggleVisibility);
    this._toggler.addEventListener("touchstart", this._toggleVisibility);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._toggler.removeEventListener("mousedown", this._toggleVisibility);
    this._toggler.removeEventListener("touchstart", this._toggleVisibility);
  }

  private _toggleVisibility = (evt: MouseEvent | TouchEvent) => {
    evt.preventDefault();

    if (this._input.getAttribute("type") === "text") {
      this._toggler.innerHTML = iconHidden;
      this._input.setAttribute("type", "password");
    } else {
      this._toggler.innerHTML = iconVisible;
      this._input.setAttribute("type", "text");
    }
  };
}

customElements.define("cx-password-field", PasswordField);
