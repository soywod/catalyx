import {parseStyle, parseTpl} from "../dom-utils";
import style from "./heading.css";
import tpl from "./heading.html";

export class Heading extends HTMLElement {
  public constructor() {
    super();
    this.attachShadow({mode: "open"}).append(parseStyle(style), parseTpl(tpl));
  }
}

customElements.define("cx-heading", Heading);
