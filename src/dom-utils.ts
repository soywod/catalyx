import {Observable, BehaviorSubject, defer} from "rxjs";
import {withLatestFrom, flatMap, mergeAll} from "rxjs/operators";
import isEqual from "lodash/fp/isEqual";

import {arrayDiffs} from "./array-utils";

type Trex = TrexBindings & {
  elem: HTMLElement | null;
  elems: HTMLElement[];
};

type TrexBind = <T>(obs$: Observable<T>, fn: (val: T) => string) => void;
type TrexBindArr = <T>(obs$: Observable<T[]>, render: (val: T, idx: number) => string) => void;

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
  bindArr: TrexBindArr;
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
          elem.innerHTML = render(val);
        });
      });
    },
    bindArr: <T>(next$: Observable<T[]>, render: (val: T, idx: number) => string) => {
      elems.forEach(elem => {
        const prev$ = new BehaviorSubject<T[]>([]);

        next$
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

export function $(selector: string, parent?: HTMLElement): Trex {
  const root = parent || document;
  const sanitizedSelector = selector.trim();
  if (sanitizedSelector.length === 0) return trexFactory([]);

  if (sanitizedSelector[0] === "#" && sanitizedSelector.indexOf(" ") === -1) {
    const element = document.getElementById(selector.slice(1));
    return trexFactory(element ? [element] : []);
  }

  if (sanitizedSelector[0] === "." && selector.indexOf(" ") === -1) {
    return trexFactory(
      Array.from(root.getElementsByClassName(selector.slice(1))).reduce<HTMLElement[]>(
        (elements, el) => (el instanceof HTMLElement ? [...elements, el] : elements),
        [],
      ),
    );
  }

  return trexFactory(
    Array.from(root.querySelectorAll(selector)).reduce<HTMLElement[]>(
      (elements, el) => (el instanceof HTMLElement ? [...elements, el] : elements),
      [],
    ),
  );
}

function parseHTML(html: string): HTMLElement {
  const wrapper = document.createElement("template");
  wrapper.innerHTML = html.trim();
  const elem = wrapper.content.firstElementChild;
  if (!(elem instanceof HTMLElement)) throw "Parsing element failed!";
  return elem;
}
