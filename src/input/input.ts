import {parseStyle, parseTemplate} from "../dom-utils";

export abstract class Input extends HTMLElement {
  protected _input: HTMLInputElement;
  protected _sign: HTMLSpanElement;

  constructor(style: string, template: string) {
    super();

    const shadow = this.attachShadow({mode: "open", delegatesFocus: true});
    shadow.append(parseStyle(style), parseTemplate(template));

    const input = shadow.getElementById("input");
    if (!(input instanceof HTMLInputElement)) throw new Error("Input not found.");
    this._input = input;

    const sign = shadow.getElementById("sign");
    if (!(sign instanceof HTMLSpanElement)) throw new Error("Sign not found.");
    this._sign = sign;

    Array.from(this.attributes).forEach(attr => {
      this._input.setAttribute(attr.name, attr.value);
    });
  }

  protected _validate = () => {
    try {
      if (!this._input.checkValidity()) {
        throw new Error(this._input.validationMessage);
      }

      this._postValidate();

      this.removeAttribute("invalid");
      this.setAttribute("valid", "");
      this._sign.removeAttribute("title");
    } catch (err) {
      this.removeAttribute("valid");
      this.setAttribute("invalid", "");
      this._sign.setAttribute("title", err.message);
    }
  };

  protected _postValidate = () => {
    //
  };
}
