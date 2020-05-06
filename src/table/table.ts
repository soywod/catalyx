import {parseStyle, parseTemplate} from "../dom-utils";
import style from "./table.css";
import template from "./table.html";

export default class Table extends HTMLElement {
  public constructor() {
    super();
    this.attachShadow({mode: "open"}).append(parseStyle(style), parseTemplate(template));
  }
}

export class TableCell extends HTMLElement {
  public constructor() {
    super();
    this.append(parseTemplate(`<slot></slot>`));
  }
}

customElements.define("cx-table", Table);
customElements.define("cx-table-cell", TableCell);
