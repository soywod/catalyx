import {parseStyle, parseTemplate} from "../dom-utils";
import style from "./checkbox.css";
import tpl from "./checkbox.html";

export class Checkbox extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: "open", delegatesFocus: true}).append(
      parseStyle(style),
      parseTemplate(tpl),
    );
  }
}

customElements.define("cx-checkbox", Checkbox);
