import {parseStyle, parseTpl} from "../dom-utils";
import style from "./toast.css";
import tpl from "./toast.html";

const spacing = window.getComputedStyle(document.body).getPropertyValue("--spacing-md");

type ToastOpts = Partial<{
  type: "default" | "primary" | "error";
}>;

export class Toast extends HTMLElement {
  private static _instances: Toast[] = [];

  private static _adjustToastsTop = () => {
    Toast._instances.forEach((toast, i) => {
      toast.style.top = `calc(calc(${i} * ${spacing}) + ${i * toast.clientHeight}px)`;
    });
  };

  public static show = (msg: string, opts: ToastOpts = {}) => {
    const toast = document.createElement("cx-toast");
    const type = opts.type || "default";
    if (!(toast instanceof Toast)) throw new Error();

    toast.textContent = msg;
    toast.id = Date.now().toString();
    toast.setAttribute("data-type", type);
    Toast._instances.unshift(toast);
    Toast._adjustToastsTop();

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
    setTimeout(() => this.setAttribute("visible", ""), 50);
    setTimeout(() => this._remove(), 5000);
    this.addEventListener("click", this._remove);
  }

  protected disconnectedCallback() {
    this.removeEventListener("click", this._remove);
  }

  private _remove = () => {
    this.removeAttribute("visible");
    Toast._instances = Toast._instances.filter(instance => instance.id !== this.id);
    Toast._adjustToastsTop();
    setTimeout(() => this.remove(), 300);
  };
}

customElements.define("cx-toast", Toast);
