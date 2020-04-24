import {arrayDiffs} from "./obj-utils";

type Observable<T> = {
  subscribe: (observer: (next: T) => void) => Subscription;
};

type Subscription = {
  unsubscribe: () => void;
};

export type Catalyx = CatalyxBindings & {
  elem: HTMLElement | null;
  elems: HTMLElement[];
};

export type CatalyxBindings = {
  bind: CatalyxBind;
  on: CatalyxOn;
};

export type CatalyxBind = <T>(obs$: Observable<T | T[]>, fn: CatalyxBindFn<T>) => void;
export type CatalyxBindFn<T> = (val: T, elem: HTMLElement, idx: number) => any;

export type CatalyxOn = <T extends keyof GlobalEventHandlersEventMap>(
  evtType: T,
  targetOrFn: string | CatalyxOnFn<T>,
  fn?: CatalyxOnFn<T>,
) => void;

export type CatalyxOnFn<T extends keyof GlobalEventHandlersEventMap> = (
  evt: GlobalEventHandlersEventMap[T] & {
    mainTarget: HTMLElement;
    key: number;
  },
) => void;

function catalyxFactory(e: HTMLElement | HTMLElement[] | null): Catalyx {
  const elems: HTMLElement[] = Array.isArray(e) ? e : e ? [e] : [];
  const elem: HTMLElement | null = 0 in elems ? elems[0] : null;
  const bindings: CatalyxBindings = {
    bind: <T>(obs$: Observable<T | T[]>, fn: CatalyxBindFn<T>) => {
      elems.forEach(elem => {
        let prev: T[] = [];
        const subscription = obs$.subscribe(next => {
          if (Array.isArray(next)) {
            arrayDiffs(prev, next).forEach(change => {
              console.debug("[catalyx] array changed", change, elem);

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
            console.debug("[catalyx] value changed", next, elem);
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
                  console.debug("[catalyx] unsubscribed", removedNode);
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
      targetOrFn: string | CatalyxOnFn<T>,
      fn?: CatalyxOnFn<T>,
    ) => {
      elems.forEach(elem => {
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
                  console.debug("[catalyx] unsubscribed", evtType, removedNode);
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

export function find(selector: string, parent: ParentNode = document): Catalyx {
  const sanitizedSelector = selector.trim();
  if (sanitizedSelector.length === 0) return catalyxFactory([]);

  return catalyxFactory(
    Array.from(parent.querySelectorAll(selector)).reduce<HTMLElement[]>(
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
