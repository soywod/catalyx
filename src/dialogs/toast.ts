import {parseStyle, parseTpl} from "../dom-utils";
import style from "./toast.css";
import tpl from "./toast.html";

export class Toast extends HTMLElement {
  static show = (msg: string) => {
    const toast = document.createElement("cx-toast");
    toast.textContent = msg;
    document.body.appendChild(toast);
  };

  public constructor() {
    super();

    this.attachShadow({mode: "open", delegatesFocus: true}).append(
      parseStyle(style),
      parseTpl(tpl),
    );
  }

  protected connectedCallback() {
    setTimeout(() => this.setAttribute("visible", ""), 0);
    setTimeout(() => this._remove(), 2500);
    this.addEventListener("click", this._remove);
  }

  protected disconnectedCallback() {
    this.removeEventListener("click", this._remove);
  }

  private _remove = () => {
    this.removeAttribute("visible");
    setTimeout(() => this.remove(), 500);
  };
}

customElements.define("cx-toast", Toast);
