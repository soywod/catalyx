import {Observable, BehaviorSubject, defer} from "rxjs";
import {withLatestFrom, flatMap, mergeAll} from "rxjs/operators";
import isEqual from "lodash/fp/isEqual";

import {arrayDiffs} from "./array-utils";

type Trex = TrexBindings & {
  elem: HTMLElement | null;
  elems: HTMLElement[];
};

type TrexBind = <T>(obs$: Observable<T>, fn: (val: T, elem: HTMLElement) => any) => void;
type TrexBindList = <T>(obs$: Observable<T[]>, fn: (val: T, idx: number) => string) => void;

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
  bindList: TrexBindList;
  on: TrexOn;
};

function trexFactory(e: HTMLElement | null): Trex;
function trexFactory(e: HTMLElement[]): Trex;
function trexFactory(e: HTMLElement | HTMLElement[] | null) {
  const elems: HTMLElement[] = Array.isArray(e) ? e : e ? [e] : [];
  const elem: HTMLElement | null = 0 in elems ? elems[0] : null;
  const bindings: TrexBindings = {
    bind: (obs$, render) => {
      elems.forEach(elem => {
        obs$.subscribe(val => {
          const content = render(val, elem);
          if (typeof content === "string") {
            elem.innerHTML = content;
          }
        });
      });
    },
    bindList: <T>(obs$: Observable<T[]>, render: (val: T, idx: number) => string) => {
      elems.forEach(elem => {
        const prev$ = new BehaviorSubject<T[]>([]);
        const subscription = obs$
          .pipe(
            withLatestFrom(prev$),
            flatMap(([next, prev]) => [
              arrayDiffs(prev, next, isEqual),
              defer(() => prev$.next(Object.assign([], next))),
            ]),
            mergeAll(),
          )
          .subscribe(change => {
            console.log("CHANGE", change);

            switch (change.type) {
              case "create": {
                const child = parseHTML(render(change.item, change.idx));
                child.setAttribute("data-key", String(change.idx));
                elem.appendChild(child);
                break;
              }

              case "update": {
                const rowEl = elem.children.item(change.idx);
                if (rowEl) {
                  const child = parseHTML(render(change.item, change.idx));
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
    on: (evtType, targetOrFn, fn) => {
      elems.forEach(elem => {
        elem.addEventListener(evtType, evt => {
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
        });
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