import {parseStyle, parseTemplate} from "../dom-utils";
import style from "./heading.css";
import template from "./heading.html";

export class Heading extends HTMLElement {
  public constructor() {
    super();
    this.attachShadow({mode: "open"}).append(parseStyle(style), parseTemplate(template));
  }
}

customElements.define("cx-heading", Heading);
