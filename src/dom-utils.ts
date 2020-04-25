import {Observable, isObservable} from "./observable";
import {arrayDiffs} from "./obj-utils";

export type CatalyxBind = <T>(data: CatalyxBindData<T>, fn?: CatalyxBindFn<T>) => Catalyx;
export type CatalyxBindData<T> = T | T[] | Observable<T> | Observable<T[]>;
export type CatalyxBindFn<T> = (val: T, elem: HTMLElement, idx: number) => any;

export type CatalyxOn = <T extends keyof GlobalEventHandlersEventMap>(
  evtType: T,
  targetOrFn: string | CatalyxOnFn<T>,
  fn?: CatalyxOnFn<T>,
) => Catalyx;

export type CatalyxOnFn<T extends keyof GlobalEventHandlersEventMap> = (
  evt: GlobalEventHandlersEventMap[T] & {
    mainTarget: HTMLElement;
    key: number;
  },
  elem: HTMLElement,
) => void;

export class Catalyx {
  public elem: HTMLElement | null;
  public elems: HTMLElement[];

  public constructor(elem?: HTMLElement | HTMLElement[] | null) {
    this.elems = Array.isArray(elem) ? elem : elem ? [elem] : [];
    this.elem = 0 in this.elems ? this.elems[0] : null;
  }

  public bind<T>(data: CatalyxBindData<T>, fn?: CatalyxBindFn<T>): this {
    this.elems.forEach(elem => {
      if (isObservable<T | T[]>(data)) {
        let prev: T[] = [];
        const subscription = data.subscribe((next: T | T[]) => {
          if (Array.isArray(next)) {
            arrayDiffs(prev, next).forEach(change => {
              console.debug("[catalyx] array changed", change, elem);

              switch (change.type) {
                case "create": {
                  const {item, idx} = change;
                  const child = parseHTML(fn ? fn(item, elem, idx) : String(item));
                  child.setAttribute("data-key", String(idx));
                  elem.appendChild(child);
                  break;
                }

                case "update": {
                  const {item, idx} = change;
                  const rowEl = elem.children.item(idx);
                  if (rowEl) {
                    const child = parseHTML(fn ? fn(item, elem, idx) : String(item));
                    child.setAttribute("data-key", String(idx));
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
            console.debug("[catalyx] value changed", next, elem);
            const content = fn ? fn(next, elem, NaN) : String(next);
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
                  console.debug("[catalyx] unsubscribed", removedNode);
                  subscription.unsubscribe();
                }
              });
          });

          elemObs.observe(document.body, {childList: true});
        }
      } else if (Array.isArray(data)) {
        const content = data.reduce((joinedContent, data, i) => {
          const content = fn ? fn(data, elem, i) : String(data);
          return joinedContent + (typeof content === "string" ? content : "");
        }, "");

        if (content.length > 0) {
          elem.innerHTML = content;
        }
      } else {
        const content = fn ? fn(data, elem, NaN) : String(data);
        if (typeof content === "string") {
          elem.innerHTML = content;
        }
      }
    });

    return this;
  }

  public on<T extends keyof GlobalEventHandlersEventMap>(
    evtType: T,
    targetOrFn: string | CatalyxOnFn<T>,
    fn?: CatalyxOnFn<T>,
  ): this {
    this.elems.forEach(elem => {
      function handler(evt: HTMLElementEventMap[T]) {
        console.debug("[catalyx] event triggered", evt, elem);
        if (typeof targetOrFn === "string" && typeof fn === "function") {
          const $target = find(targetOrFn, elem);
          const containsTarget = (el: HTMLElement) => {
            if (!(evt.target instanceof Node)) return false;
            if (!el.contains(evt.target)) return false;
            return true;
          };

          $target.elems.filter(containsTarget).forEach(elem => {
            const overload = {mainTarget: elem, key: Number(elem.getAttribute("data-key"))};
            fn(Object.assign(evt, overload), elem);
          });
        } else if (typeof targetOrFn === "function") {
          const overload = {mainTarget: elem, key: Number(elem.getAttribute("data-key"))};
          targetOrFn(Object.assign(evt, overload), elem);
        }
      }

      elem.addEventListener(evtType, handler);

      if (elem.parentNode) {
        const elemObs = new MutationObserver(mutlist => {
          mutlist
            .flatMap(mut => Array.from(mut.removedNodes))
            .forEach(removedNode => {
              if (removedNode.isEqualNode(elem.parentNode)) {
                console.debug("[catalyx] unsubscribed", evtType, removedNode);
                elem.removeEventListener(evtType, handler);
              }
            });
        });

        elemObs.observe(document.body, {childList: true});
      }
    });

    return this;
  }
}

export function find(selector: string, parent: ParentNode = document): Catalyx {
  const sanitizedSelector = selector.trim();
  if (sanitizedSelector.length === 0) return new Catalyx([]);

  return new Catalyx(
    Array.from(parent.querySelectorAll(selector)).reduce<HTMLElement[]>(
      (elements, el) => (el instanceof HTMLElement ? [...elements, el] : elements),
      [],
    ),
  );
}

export function parseHTML(str: string): HTMLElement {
  const wrapper = document.createElement("template");
  wrapper.innerHTML = str.trim();
  const elem = wrapper.content.firstChild;

  if (elem instanceof HTMLElement) {
    return elem;
  } else {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = str.trim();
    return wrapper;
  }
}
