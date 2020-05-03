import {toKebabCase} from "./str-utils";

export type CustomElement = (elem: HTMLElement) => string | null | void;

type CustomElementOpts = ElementDefinitionOptions & {
  name?: string;
};

export function defineElement(fn: CustomElement, opts: CustomElementOpts = {}) {
  const name = opts.name || toKebabCase(fn.name);
  const ElementClass = class extends HTMLElement {
    constructor() {
      super();
      fn(this);
    }
  };

  customElements.define(name, ElementClass, opts);
}
