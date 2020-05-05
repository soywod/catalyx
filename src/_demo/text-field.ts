const style = document.createElement("style");
style.innerHTML = `
  :host {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    border: 1px solid lightgray
  }

  ::slotted([slot="prefix"]),
  ::slotted([slot="suffix"]) {
    padding: 0 5px;
  }

  input {
    border: none;
  }

  input:focus {
    outline: none;
  }
`;

const template = document.createElement("template");
template.innerHTML = `
  <slot name="prefix">
    <span></span>
  </slot>
  <input id="input" type="text">
  <slot name="suffix">
    <span></span>
  </slot>
`;

type TextFieldHandler = (val: string | undefined) => void;
type TextFieldChangeEvent = Event & {
  value: string | undefined;
};

export default class TextField extends HTMLElement {
  _input: HTMLInputElement;
  _value?: string;
  _allowedChars?: RegExp;
  _handler?: TextFieldHandler;

  static get observedAttributes() {
    return ["value", "allowed-chars"];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({mode: "open", delegatesFocus: true});
    shadow.append(style.cloneNode(true), template.content.cloneNode(true));

    const input = shadow.getElementById("input");
    if (!(input instanceof HTMLInputElement)) throw new Error("Input not found.");
    this._input = input;

    this._handleInput = this._handleInput.bind(this);
  }

  connectedCallback() {
    const allowedChars = this.getAttribute("allowed-chars");
    if (allowedChars) this._allowedChars = new RegExp(allowedChars);

    this._input.addEventListener("input", this._handleInput);
  }

  disconnectedCallback() {
    this._input.removeEventListener("input", this._handleInput);
  }

  attributeChangedCallback(name: string, prevVal: string, nextVal: string) {
    if (prevVal !== nextVal) {
      switch (name) {
        case "value": {
          const chars = nextVal.split("");
          const allCharsMatch = chars.every(
            char => !this._allowedChars || this._allowedChars.test(char),
          );

          if (allCharsMatch) {
            this.value = nextVal;
            this._input.value = nextVal;
          } else {
            this.value = prevVal;
            this._input.value = prevVal;
          }
          break;
        }

        case "allowed-chars":
          this.allowedChars = nextVal ? new RegExp(nextVal) : undefined;
          break;

        default:
          break;
      }
    }
  }

  get value() {
    return this._value;
  }

  set value(val: string | undefined) {
    this._value = val;
    this.setAttribute("value", val || "");
  }

  get allowedChars() {
    return this._allowedChars;
  }

  set allowedChars(val: RegExp | undefined) {
    if (val && !(val instanceof RegExp)) {
      throw new Error("allowedChars should be a valid RegExp.");
    }

    this._allowedChars = val;
  }

  onChange(handler: TextFieldHandler) {
    this._handler = handler;
  }

  _handleInput(evt: Event) {
    if (evt instanceof InputEvent && evt.target instanceof HTMLInputElement) {
      const char = evt.data || "";
      const isDelete = evt.inputType === "deleteContentBackward";
      const isCharAllowed = !this._allowedChars || this._allowedChars.test(char);

      if (isDelete || isCharAllowed) {
        this.value = evt.target.value || undefined;
      } else {
        this._input.value = this.value || "";
      }

      const changeEvt: TextFieldChangeEvent = Object.assign(
        new Event("change", {bubbles: true, composed: true}),
        {value: this.value},
      );

      this.dispatchEvent(changeEvt);
    }
  }
}

customElements.define("text-field", TextField);
