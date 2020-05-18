import {parseStyle, parseTemplate, findOrFail} from "../dom-utils";
import defaultStyle from "./button.css";
import defaultTpl from "./button.html";

export type ButtonParams = {
  style?: string;
  tpl?: string;
};

export class Button extends HTMLElement {
  private _button: HTMLButtonElement;
  private _isToggler: boolean;

  public constructor(params: ButtonParams = {}) {
    super();

    this.attachShadow({mode: "open", delegatesFocus: true}).append(
      parseStyle(params.style || defaultStyle),
      parseTemplate(params.tpl || defaultTpl),
    );

    this._button = findOrFail(this.shadowRoot, HTMLButtonElement, "button");
    this._isToggler = this.hasAttribute("toggler");
  }

  connectedCallback() {
    this.addEventListener("click", this._toggle);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._toggle);
  }

  protected _toggle = () => {
    if (this._isToggler) {
      if (this.hasAttribute("active")) {
        this.removeAttribute("active");
      } else {
        this.setAttribute("active", "");
      }
    }
  };
}

customElements.define("cx-button", Button);
