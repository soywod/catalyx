import {parseStyle, parseTemplate} from "../dom-utils";
import {Tooltip} from "../tooltip";

export class Input extends HTMLElement {
  protected _input: HTMLInputElement;
  protected _error: Tooltip;

  constructor(style: string, template: string) {
    super();

    const shadow = this.attachShadow({mode: "open", delegatesFocus: true});
    shadow.append(parseStyle(style), parseTemplate(template));

    const input = shadow.getElementById("input");
    if (!(input instanceof HTMLInputElement)) throw new Error("Input not found.");
    this._input = input;
    this._input.title = "";

    const error = shadow.getElementById("error");
    if (!(error instanceof Tooltip)) throw new Error("Tooltip not found.");
    this._error = error;

    Array.from(this.attributes).forEach(attr => {
      if (!["id", "type", "part"].includes(attr.name)) {
        this._input.setAttribute(attr.name, attr.value);
      }
    });
  }

  protected _validate = () => {
    this._input.title = "";

    try {
      if (!this._input.checkValidity()) {
        throw new Error(this._input.validationMessage);
      }

      this._postValidate();

      this.removeAttribute("invalid");
      this.setAttribute("valid", "");
    } catch (err) {
      this.removeAttribute("valid");
      this.setAttribute("invalid", "");
      this._error.title = err.message;
    }
  };

  protected _postValidate = () => {
    //
  };
}
