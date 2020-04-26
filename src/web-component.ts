import {Binder, BinderBindData, BinderBindFn, BinderOnFn, find, parseStyle} from "./dom-utils";
import {toKebabCase} from "./str-utils";

export type WebComponentOpts = {
  attachShadow: boolean | ShadowRootInit;
  style?: string;
};

export const defaultOpts: WebComponentOpts = {
  attachShadow: true,
};

export function CustomElement(name?: string) {
  return function (target: CustomElementConstructor) {
    customElements.define(name || toKebabCase(target.name), target);
  };
}

export abstract class WebComponent extends HTMLElement {
  attrs: {[key: string]: string} = {};
  rootElement: ParentNode & InnerHTML;

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

  find(selector: string): Binder {
    return find(selector, this.rootElement);
  }

  bind<T>(data: BinderBindData<T>, fn?: BinderBindFn<T>): Binder {
    return new Binder(this).bind(data, fn);
  }

  on<T extends keyof GlobalEventHandlersEventMap>(evtType: T, fn: BinderOnFn<T>): Binder {
    return new Binder(this).on(evtType, fn);
  }

  render() {
    return "";
  }
}
