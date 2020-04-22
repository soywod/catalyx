import {Observable} from "rxjs";
import isEqual from "lodash/fp/isEqual";

import {arrayDiffs} from "./array-utils";

type Trex = TrexBindings & {
  elem: HTMLElement | null;
  elems: HTMLElement[];
};

type TrexBind = <T>(
  obs$: Observable<T | T[]>,
  fn: (val: T, elem: HTMLElement, idx: number) => any,
) => void;

type TrexOn = <T extends keyof GlobalEventHandlersEventMap>(
  evtType: T,
  targetOrFn: string | TrexOnFn<T>,
  fn?: TrexOnFn<T>,
) => void;

type TrexOnFn<T extends keyof GlobalEventHandlersEventMap> = (
  evt: GlobalEventHandlersEventMap[T] & {
    mainTarget: HTMLElement;
    key: number;
  },
) => void;

type TrexBindings = {
  bind: TrexBind;
  on: TrexOn;
};

function trexFactory(e: HTMLElement | null): Trex;
function trexFactory(e: HTMLElement[]): Trex;
function trexFactory(e: HTMLElement | HTMLElement[] | null) {
  const elems: HTMLElement[] = Array.isArray(e) ? e : e ? [e] : [];
  const elem: HTMLElement | null = 0 in elems ? elems[0] : null;
  const bindings: TrexBindings = {
    bind: <T>(
      obs$: Observable<T | T[]>,
      fn: (val: T, elem: HTMLElement, idx: number) => string,
    ) => {
      elems.forEach(elem => {
        let prev: T[] = [];
        const subscription = obs$.subscribe(next => {
          if (Array.isArray(next)) {
            arrayDiffs(prev, next, isEqual).forEach(change => {
              console.log("CHANGE", change);

              switch (change.type) {
                case "create": {
                  const child = parseHTML(fn(change.item, elem, change.idx));
                  child.setAttribute("data-key", String(change.idx));
                  elem.appendChild(child);
                  break;
                }

                case "update": {
                  const rowEl = elem.children.item(change.idx);
                  if (rowEl) {
                    const child = parseHTML(fn(change.item, elem, change.idx));
                    child.setAttribute("data-key", String(change.idx));
                    rowEl.replaceWith(child);
                  }
                  break;
                }

                case "delete": {
                  const rowEl = elem.children.item(change.idx);
                  rowEl && rowEl.remove();
                  break;
                }
              }
            });

            prev = Object.assign([], next);
          } else {
            const content = fn(next, elem, NaN);
            if (typeof content === "string") {
              elem.innerHTML = content;
            }
          }
        });

        if (elem.parentNode) {
          const elemObs = new MutationObserver(mutlist => {
            mutlist
              .flatMap(mut => Array.from(mut.removedNodes))
              .forEach(removedNode => {
                if (removedNode.isEqualNode(elem.parentNode)) {
                  console.log("unsub!");
                  subscription.unsubscribe();
                }
              });
          });

          elemObs.observe(document.body, {childList: true});
        }
      });
    },
    on: <T extends keyof GlobalEventHandlersEventMap>(
      evtType: T,
      targetOrFn: string | TrexOnFn<T>,
      fn?: TrexOnFn<T>,
    ) => {
      elems.forEach(elem => {
        function handler(evt: HTMLElementEventMap[T]) {
          if (typeof targetOrFn === "string" && typeof fn === "function") {
            const $target = $(targetOrFn, elem);
            const containsTarget = (el: HTMLElement) => {
              if (!(evt.target instanceof Node)) return false;
              if (!el.contains(evt.target)) return false;
              return true;
            };

            $target.elems.filter(containsTarget).forEach(elem => {
              const overload = {mainTarget: elem, key: Number(elem.getAttribute("data-key"))};
              fn(Object.assign(evt, overload));
            });
          } else if (typeof targetOrFn === "function") {
            const overload = {mainTarget: elem, key: Number(elem.getAttribute("data-key"))};
            targetOrFn(Object.assign(evt, overload));
          }
        }

        elem.addEventListener(evtType, handler);

        if (elem.parentNode) {
          const elemObs = new MutationObserver(mutlist => {
            mutlist
              .flatMap(mut => Array.from(mut.removedNodes))
              .forEach(removedNode => {
                if (removedNode.isEqualNode(elem.parentNode)) {
                  console.log("unsub!");
                  elem.removeEventListener(evtType, handler);
                }
              });
          });

          elemObs.observe(document.body, {childList: true});
        }
      });
    },
  };

  return Object.assign({elem, elems}, bindings);
}

export function $(selector: string, parent?: ParentNode): Trex {
  const root = parent || document;
  const sanitizedSelector = selector.trim();
  if (sanitizedSelector.length === 0) return trexFactory([]);

  return trexFactory(
    Array.from(root.querySelectorAll(selector)).reduce<HTMLElement[]>(
      (elements, el) => (el instanceof HTMLElement ? [...elements, el] : elements),
      [],
    ),
  );
}

export function parseHTML(html: string): HTMLElement {
  const wrapper = document.createElement("template");
  wrapper.innerHTML = html.trim();
  const elem = wrapper.content.firstElementChild;
  if (!(elem instanceof HTMLElement)) throw "Parsing element failed!";
  return elem;
}

type DefineCustomElementFn = ($: (selector: string) => Trex) => void;

export function defineCustomElement(view: string, fn?: DefineCustomElementFn): void;
export function defineCustomElement(
  view: string,
  styles?: string,
  fn?: DefineCustomElementFn,
): void;
export function defineCustomElement(
  template: string,
  stylesOrFn?: string | DefineCustomElementFn,
  fn?: DefineCustomElementFn,
) {
  const $maybeTemplate = parseHTML(template);
  if (!($maybeTemplate instanceof HTMLTemplateElement)) {
    throw new Error("Template must be inside a <template>.");
  }
  const $template: HTMLTemplateElement = $maybeTemplate;

  const maybeName = $template.getAttribute("id");
  if (!maybeName) {
    throw new Error("Attribute [id] is missing in <template>.");
  }
  const name: string = maybeName;

  customElements.define(
    name,
    class extends HTMLElement {
      constructor() {
        super();

        const $shadow = this.attachShadow({mode: "open"});

        if (typeof stylesOrFn === "string") {
          const $style = document.createElement("style");
          $style.textContent = stylesOrFn;
          $shadow.appendChild($style);
        }

        $shadow.appendChild($template.content);

        const callback = typeof stylesOrFn === "function" ? stylesOrFn : fn;
        if (callback) {
          customElements.whenDefined(name).then(() => callback(selector => $(selector, $shadow)));
        }
      }
    },
  );
}
