import {Button, ButtonParams} from "./button";
import {Form} from "../layouts";

export class SubmitButton extends Button {
  public constructor(params: ButtonParams = {}) {
    super(params);
    this._button.setAttribute("type", "submit");
  }

  protected connectedCallback() {
    this.addEventListener("click", this._submit);
  }

  protected disconnectedCallback() {
    this.removeEventListener("click", this._submit);
  }

  private _submit = () => {
    let elem: Node | null = this.shadowRoot;

    while (elem) {
      if (elem instanceof Form) return elem.submit();
      else if (elem instanceof ShadowRoot) elem = elem.host;
      else elem = elem.parentNode;
    }
  };
}

customElements.define("cx-submit", SubmitButton);
