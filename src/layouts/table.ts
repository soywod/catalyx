import {parseStyle, parseTemplate} from "../dom-utils";
import style from "./table.css";
import tpl from "./table.html";

export default class Table extends HTMLElement {
  public constructor() {
    super();
    this.attachShadow({mode: "open"}).append(parseStyle(style), parseTemplate(tpl));
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
