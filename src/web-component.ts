import {Catalyx, parseHTML, find} from "./dom-utils";

type WebComponentProps = {
  template?: string;
  style?: string;
};

export class WebComponent {
  private _template = document.createElement("template");

  public constructor(props: WebComponentProps = {}) {
    this.style = props.style;
    this.template = props.template;
  }

  public set style(str: string | undefined | null) {
    if (str) {
      this._template.content.prepend(parseStyle(str));
    }
  }

  public set template(str: string | undefined | null) {
    if (str) {
      this._template.content.append(...parseTemplate(str).content.children);
    }
  }

  public find(selector: string): Catalyx {
    return find(selector, this._template.content);
  }

  public registerAs(name: string) {
    const template = this._template.content;
    customElements.define(
      name,
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({mode: "open"}).appendChild(template);
        }
      },
    );
  }
}

function parseStyle(str: string): HTMLStyleElement {
  const style = parseHTML("<style>" + str.trim() + "</style>");

  if (!(style instanceof HTMLStyleElement)) {
    throw new Error("Styles must be a <style> element.");
  }

  return style;
}

function parseTemplate(str: string): HTMLTemplateElement {
  const template = parseHTML("<template>" + str.trim() + "</template>");

  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error("Template must be a <template> element.");
  }

  return template;
}
