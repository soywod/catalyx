import {parseStyle} from "../dom-utils";
import style from "./code.css";

export default class Code extends HTMLElement {
  constructor() {
    super();

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    const chunks = this.innerHTML.trim().split(/\r?\n/);

    for (let i = 0; i < chunks.length; i++) {
      code.append(chunks[i], document.createElement("br"));
    }

    pre.appendChild(code);
    this.attachShadow({mode: "open"}).append(parseStyle(style), pre);
  }
}

customElements.define("cx-code", Code);
