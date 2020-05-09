import {createPopper, Instance as PopperInstance, Placement} from "@popperjs/core";

import {parseStyle, parseTemplate} from "../dom-utils";
import style from "./tooltip.css";
import template from "./tooltip.html";

export class Tooltip extends HTMLElement {
  private _target: Element;
  private _container: HTMLDivElement;
  private _content: HTMLDivElement;
  private _placement: Placement;
  private _instance?: PopperInstance;

  constructor() {
    super();
    const shadow = this.attachShadow({mode: "open"});
    shadow.append(parseStyle(style), parseTemplate(template));

    const targetSlot = shadow.querySelector(`slot:not([name])`);
    if (!(targetSlot instanceof HTMLSlotElement)) throw new Error("Target not found.");
    const target = targetSlot.assignedElements()[0];
    if (!(target instanceof Element)) throw new Error("Target not found.");
    this._target = target;

    const container = shadow.getElementById("container");
    if (!(container instanceof HTMLDivElement)) throw new Error("Tooltip container not found.");
    this._container = container;

    const content = shadow.getElementById("content");
    if (!(content instanceof HTMLDivElement)) throw new Error("Tooltip content not found.");
    this._content = content;

    this._placement = parsePlacement(this.getAttribute("placement"));
    this._content.textContent = this.getAttribute("title");
    this.removeAttribute("title");
  }

  connectedCallback() {
    this._target.addEventListener("mouseenter", this._show);
    this._target.addEventListener("mouseleave", this._hide);
  }

  disconnectedCallback() {
    this._target.removeEventListener("mouseenter", this._show);
    this._target.removeEventListener("mouseleave", this._hide);
  }

  private _show = () => {
    this._instance = createPopper(this._target, this._container, {
      placement: this._placement,
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ],
    });

    this._instance.update();
    this.setAttribute("visible", "");
  };

  private _hide = () => {
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

function parsePlacement(str?: string | null): Placement {
  switch (str) {
    case "auto":
    case "auto-start":
    case "auto-end":
    case "top":
    case "top-start":
    case "top-end":
    case "bottom":
    case "bottom-start":
    case "bottom-end":
    case "left":
    case "left-start":
    case "left-end":
    case "right":
    case "right-start":
    case "right-end":
      return str;

    default:
      return "top";
  }
}

customElements.define("cx-tooltip", Tooltip);
