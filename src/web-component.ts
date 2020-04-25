import {parseStyle, find} from "./dom-utils";

export type WebComponentOpts = {
  attachShadow: boolean | ShadowRootInit;
  style?: string;
};

export const defaultOpts: WebComponentOpts = {
  attachShadow: true,
};

export abstract class WebComponent extends HTMLElement {
  attrs: {[key: string]: string} = {};
  rootElement: HTMLElement | ShadowRoot;

  constructor(overrideOpts: Partial<WebComponentOpts> = {}) {
    super();
    const opts: WebComponentOpts = Object.assign({}, defaultOpts, overrideOpts);

    for (const attr of this.attributes) {
      this.attrs[attr.name] = attr.value;
    }

    this.rootElement = opts.attachShadow
      ? this.attachShadow(opts.attachShadow === true ? {mode: "open"} : opts.attachShadow)
      : this;

    this.rootElement.innerHTML = this.render();

    if (opts.style) {
      this.rootElement.prepend(parseStyle(opts.style));
    }
  }

  find(selector: string) {
    return find(selector, this.rootElement);
  }

  abstract render(): string;
}

export function CustomElement(name: string) {
  return function (target: CustomElementConstructor) {
    customElements.define(name, target);
  };
}
