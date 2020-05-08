import {parseStyle, parseTemplate} from "../dom-utils";
import textStyle from "./text.css";
import textAreaStyle from "./text-area.css";
import template from "./text-area.html";
import iconError from "./icon-error.html";

export class TextArea extends HTMLElement {
  protected _input: HTMLTextAreaElement;
  protected _error: HTMLSpanElement;

  constructor() {
    super();
    const shadow = this.attachShadow({mode: "open", delegatesFocus: true});
    shadow.append(parseStyle(textStyle + textAreaStyle), parseTemplate(template + iconError));

    const input = shadow.getElementById("input");
    if (!(input instanceof HTMLTextAreaElement)) throw new Error("Input not found.");
    this._input = input;

    const error = shadow.getElementById("error");
    if (!(error instanceof HTMLSpanElement)) throw new Error("Error icon not found.");
    this._error = error;

    Array.from(this.attributes).forEach(attr => {
      this._input.setAttribute(attr.name, attr.value);
    });
  }

  connectedCallback() {
    this._input.addEventListener("input", this._validate);
  }

  disconnectedCallback() {
    this._input.removeEventListener("input", this._validate);
  }

  private _validate = () => {
    try {
      if (!this._input.checkValidity()) {
        throw new Error(this._input.validationMessage);
      }

      this.removeAttribute("invalid");
      this.setAttribute("valid", "");
      this._error.removeAttribute("title");
    } catch (err) {
      this.removeAttribute("valid");
      this.setAttribute("invalid", "");
      this._error.setAttribute("title", err.message);
    }
  };
}

customElements.define("cx-text-area", TextArea);
