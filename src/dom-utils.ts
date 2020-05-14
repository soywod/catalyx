type Constructor<T> = {new (...args: any[]): T};
function typeGuard<T>(o: any, className: Constructor<T>): o is T {
  return o instanceof className;
}

export function parseStyle(str: string) {
  const wrapper = document.createElement("style");
  wrapper.innerHTML = str;
  return wrapper;
}

export function parseTemplate(str: string) {
  const wrapper = document.createElement("template");
  wrapper.innerHTML = str;
  return wrapper.content;
}

export function findOrFail<T extends HTMLElement>(
  parent: DocumentFragment | null,
  type: Constructor<T>,
  id: string,
) {
  if (!parent) throw new Error(`Element "#${id}" not found.`);
  const elem = parent.getElementById(id);
  if (!typeGuard(elem, type)) throw new Error(`Element "#${id}" not found.`);
  return elem;
}

export function findAllOrFail<T extends HTMLElement>(
  parent: DocumentFragment | null,
  type: Constructor<T>,
  selector: string,
): T[] {
  if (!parent) {
    throw new Error(`Element "${selector}" not found.`);
  }

  const elems: T[] = [];

  for (const elem of Array.from(parent.querySelectorAll(selector))) {
    if (typeGuard(elem, type)) {
      elems.push(elem);
    }
  }

  return elems;
}

export function clone(elem: Node): DocumentFragment {
  const clone = elem.cloneNode(true);
  if (!(clone instanceof DocumentFragment)) throw new Error(`Clone failed.`);
  return clone;
}

export function replaceChildren(elem: Node, ...children: Node[]) {
  while (elem.lastChild) elem.removeChild(elem.lastChild);
  for (const child of children) elem.appendChild(child);
}
