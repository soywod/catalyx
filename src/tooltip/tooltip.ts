import {createPopper, Instance as PopperInstance, Placement} from "@popperjs/core";

import {parseStyle, parseTemplate} from "../dom-utils";
import style from "./tooltip.css";
import template from "./tooltip.html";

export class Tooltip extends HTMLElement {
  private _target: HTMLElement;
  private _tooltip: HTMLDivElement;
  private _placement: Placement;
  private _popperInstance?: PopperInstance;

  constructor() {
    super();
    const shadow = this.attachShadow({mode: "open"});
    shadow.append(parseStyle(style), parseTemplate(template));

    const targetSlot = shadow.querySelector(`slot:not([name])`);
    if (!(targetSlot instanceof HTMLSlotElement)) throw new Error("Target not found.");
    const target = targetSlot.assignedElements()[0];
    if (!(target instanceof HTMLElement)) throw new Error("Target not found.");
    this._target = target;

    const tooltip = shadow.getElementById("tooltip");
    if (!(tooltip instanceof HTMLDivElement)) throw new Error("Tooltip not found.");
    this._tooltip = tooltip;
    this._placement = parsePlacement(this.getAttribute("placement"));

    if (this.hasAttribute("title")) {
      const title = this.getAttribute("title");
      if (!title) throw new Error("Title is empty.");
      const tooltip = document.createElement("span");
      tooltip.slot = "title";
      tooltip.textContent = title;
      this.removeAttribute("title");
      this._tooltip.append(tooltip);
    } else {
      const tooltipSlot = shadow.querySelector(`slot[name="tooltip"]`);
      if (!(tooltipSlot instanceof HTMLSlotElement)) throw new Error("Tooltip not found.");
      const tooltip = tooltipSlot.assignedElements()[0];
      if (!(tooltip instanceof HTMLElement)) throw new Error("Tooltip not found.");
      this._tooltip.append(tooltip);
    }
  }

  connectedCallback() {
    this._target.addEventListener("mouseenter", this._showTooltip);
    this._target.addEventListener("mouseleave", this._hideTooltip);
  }

  disconnectedCallback() {
    this._target.removeEventListener("mouseenter", this._showTooltip);
    this._target.removeEventListener("mouseleave", this._hideTooltip);
  }

  private _showTooltip = () => {
    this._popperInstance = createPopper(this._target, this._tooltip, {
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

    this.setAttribute("visible", "");
  };

  private _hideTooltip = () => {
    if (this._popperInstance) {
      this.removeAttribute("visible");
      this._popperInstance.destroy();
      delete this._popperInstance;
    }
  };

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
