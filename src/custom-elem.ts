import {toKebabCase} from "./str-utils";

export type CustomElement = (elem: HTMLElement) => string | null | void;

type CustomElementOpts = ElementDefinitionOptions & {
  name?: string;
  class?: CustomElementConstructor;
};

export function defineElement(fn: CustomElement, opts: CustomElementOpts = {}) {
  const name = opts.name || toKebabCase(fn.name);
  const elementClass =
    opts.class ||
    class extends HTMLElement {
      constructor() {
        super();
        console.log(this);
        fn(this);
      }
    };

  customElements.define(name, elementClass, opts);
}
