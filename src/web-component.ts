import {Catalyx, parseHTML, find} from "./dom-utils";

type WebComponentProps =
  | string
  | {
      name: string;
      template?: string;
      style?: string;
    };

export class WebComponent {
  public name: string;

  private _style?: HTMLStyleElement;
  private _template?: HTMLTemplateElement;
  private _shadowRoot?: ShadowRoot;

  constructor(props: WebComponentProps) {
    const setShadowRoot = this.setShadowRoot.bind(this);
    const {name, template, style} = Object.assign(
      {},
      typeof props === "string" ? {name: props} : props,
    );

    customElements.define(
      name,
      class extends HTMLElement {
        constructor() {
          super();
          setShadowRoot(this.attachShadow({mode: "open"}));
        }
      },
    );

    this.name = name;
    this.style = style;
    this.template = template;
  }

  set style(str: string | undefined | null) {
    if (str) {
      this._style = parseStyle(str);
      this.shadowRoot.appendChild(this._style);
    }
  }

  set template(str: string | undefined | null) {
    if (str) {
      this._template = parseTemplate(str);
      this.shadowRoot.appendChild(this._template.content);
    }
  }

  get shadowRoot(): ShadowRoot {
    if (!this._shadowRoot) {
      throw new Error("Shadow root not initialized.");
    }

    return this._shadowRoot;
  }

  private setShadowRoot(shadowRoot: ShadowRoot) {
    this._shadowRoot = shadowRoot;
  }

  find(selector: string): Catalyx {
    return find(selector, this.shadowRoot);
  }
}

function parseStyle(str: string): HTMLStyleElement {
  const style = parseHTML("<style>" + str + "</style>");

  if (!(style instanceof HTMLStyleElement)) {
    throw new Error("Styles must be a <style> element.");
  }

  return style;
}

function parseTemplate(str: string): HTMLTemplateElement {
  const template = parseHTML("<template>" + str + "</template>");

  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error("Template must be a <template> element.");
  }

  return template;
}
