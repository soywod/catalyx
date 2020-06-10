import {parseStyle, parseTpl, findOrFail, transferAttrs} from "../dom-utils";

import fileStyle from "./file.css";
import fileTpl from "./file.html";

export class FilePicker extends HTMLElement {
  private _input: HTMLInputElement;
  private _dropzone: HTMLDivElement;
  private _files: HTMLDivElement;
  private _clear: HTMLButtonElement;
  private _fileList: FileList | null;

  public constructor() {
    super();

    this.attachShadow({mode: "open", delegatesFocus: true}).append(
      parseStyle(fileStyle),
      parseTpl(fileTpl),
    );

    this._input = findOrFail(this.shadowRoot, HTMLInputElement, "input");
    this._dropzone = findOrFail(this.shadowRoot, HTMLDivElement, "dropzone");
    this._files = findOrFail(this.shadowRoot, HTMLDivElement, "files");
    this._clear = findOrFail(this.shadowRoot, HTMLButtonElement, "clear");
    this._clear.hidden = true;
    this._fileList = null;

    transferAttrs(this, this._input);
  }

  protected connectedCallback() {
    this._input.addEventListener("change", this._handleChange);
    this._clear.addEventListener("click", this._removeFiles);
  }

  protected disconnectedCallback() {
    this._input.removeEventListener("change", this._handleChange);
    this._clear.removeEventListener("click", this._removeFiles);
  }

  private _handleChange = (evt: Event) => {
    if (evt.target instanceof HTMLInputElement && evt.target.files && evt.target.files.length > 0) {
      this._fileList = evt.target.files;
      this._renderFiles();
      this._clear.hidden = false;
    }
  };

  private _removeFiles = (evt: MouseEvent) => {
    evt.preventDefault();
    this._fileList = null;
    this._renderFiles();
    this._clear.hidden = true;
  };

  private _renderFiles = () => {
    this._files.innerHTML = Array.from(this._fileList || []).reduce(
      (html, file) => html + `<div class="file">${file.name}</div>`,
      "",
    );
  };
}

customElements.define("cx-file-picker", FilePicker);
