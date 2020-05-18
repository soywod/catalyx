import {createPopper, Instance as PopperInstance, Placement} from "@popperjs/core";

import {parseStyle, parseTemplate, findOrFail, findFirstOrFail} from "../dom-utils";
import {parsePlacement} from "./popover";
import style from "./tooltip.css";
import tpl from "./tooltip.html";

export class Tooltip extends HTMLElement {
  private _target: Element;
  private _container: HTMLDivElement;
  private _content: HTMLDivElement;
  private _placement: Placement;
  private _instance?: PopperInstance;

  public constructor() {
    super();
    this.attachShadow({mode: "open"}).append(parseStyle(style), parseTemplate(tpl));

    const targetSlot = findFirstOrFail(this.shadowRoot, HTMLSlotElement, "slot:not([name])");
    const target = targetSlot.assignedElements()[0];
    if (!(target instanceof Element)) throw new Error("Target not found.");
    this._target = target;

    this._container = findOrFail(this.shadowRoot, HTMLDivElement, "container");
    this._content = findOrFail(this.shadowRoot, HTMLDivElement, "content");
    this._placement = parsePlacement(this.getAttribute("placement"));
    this._content.textContent = this.getAttribute("title");
    this.removeAttribute("title");
  }

  protected connectedCallback() {
    this._target.addEventListener("mouseenter", this.show);
    this._target.addEventListener("mouseleave", this.hide);
  }

  protected disconnectedCallback() {
    this._target.removeEventListener("mouseenter", this.show);
    this._target.removeEventListener("mouseleave", this.hide);
  }

  private show = () => {
    this._instance = createPopper(this._target, this._container, {
      placement: this._placement,
      strategy: "fixed",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ],
    });

    this.setAttribute("visible", "");
  };

  private hide = () => {
    if (this._instance) {
      this.removeAttribute("visible");
      this._instance.destroy();
      this._instance = undefined;
    }
  };

  set title(title: string) {
    this._content.textContent = title;
  }

  set placement(placement: string) {
    this._placement = parsePlacement(placement);
  }
}

customElements.define("cx-tooltip", Tooltip);
