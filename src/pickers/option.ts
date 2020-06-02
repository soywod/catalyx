import {findOrFail, parseStyle, parseTpl} from "../dom-utils";
import {Checkbox} from "../buttons";

import optionTpl from "./option.html";
import optionStyle from "./option.css";

export class Option extends HTMLElement {
  static get observedAttributes() {
    return ["selected"];
  }

  private _checkbox: Checkbox;

  public constructor() {
    super();

    this.attachShadow({mode: "open", delegatesFocus: true}).append(
      parseStyle(optionStyle),
      parseTpl(optionTpl),
    );

    this._checkbox = findOrFail(this.shadowRoot, Checkbox, "option");
  }

  protected connectedCallback() {
    this._checkbox.addEventListener("change", this._handleChange);
  }

  protected disconnectedCallback() {
    this._checkbox.removeEventListener("change", this._handleChange);
  }

  protected attributeChangedCallback(name: string, prevVal: string, nextVal: string) {
    if (prevVal !== nextVal) {
      switch (name) {
        case "selected":
          this.selected = nextVal === "";
          break;
      }
    }
  }

  private _syncSelectedAttr = () => {
    if (this.selected) {
      this.setAttribute("selected", "");
    } else {
      this.removeAttribute("selected");
    }
  };

  private _handleChange = () => {
    this.dispatchEvent(new CustomEvent("change", {detail: {value: this.selected}}));
    this._syncSelectedAttr();
  };

  public get selected() {
    return this._checkbox.checked;
  }

  public set selected(val: boolean) {
    this._checkbox.checked = val;
    this._syncSelectedAttr();
  }

  public get value() {
    return this.getAttribute("value") || "";
  }

  public set hideCheckbox(val: boolean) {
    this._checkbox.hideCheckmark = val;
  }

  public get hideCheckbox() {
    return this._checkbox.hideCheckmark;
  }
}

customElements.define("cx-option", Option);
