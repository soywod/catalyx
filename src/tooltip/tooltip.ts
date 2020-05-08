import {parseStyle, parseTemplate} from "../dom-utils";
import style from "./tooltip.css";
import template from "./tooltip.html";

export class Tooltip extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: "open"});
    shadow.append(parseStyle(style), parseTemplate(template));

    if (this.hasAttribute("title")) {
      const title = this.getAttribute("title");
      const tooltip = document.createElement("span");
      tooltip.slot = "title";
      tooltip.textContent = title;
      this.removeAttribute("title");
      this.append(tooltip);
    }
  }
}

customElements.define("cx-tooltip", Tooltip);
