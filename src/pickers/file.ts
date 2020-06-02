import {parseStyle, parseTpl, findOrFail} from "../dom-utils";

import fileStyle from "./file.css";
import fileTpl from "./file.html";

export class FilePicker extends HTMLElement {
  private _input: HTMLInputElement;
  private _dropzone: HTMLDivElement;

  public constructor() {
    super();

    this.attachShadow({mode: "open", delegatesFocus: true}).append(
      parseStyle(fileStyle),
      parseTpl(fileTpl),
    );

    this._input = findOrFail(this.shadowRoot, HTMLInputElement, "input");
    this._dropzone = findOrFail(this.shadowRoot, HTMLDivElement, "dropzone");
  }
}

customElements.define("cx-file-picker", FilePicker);
