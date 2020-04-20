export function findElement(selector: string): HTMLElement | null {
  const sanitizedSelector = selector.trim()
  if (sanitizedSelector.length === 0) return null

  if (sanitizedSelector[0] === "#" && sanitizedSelector.indexOf(" ") === -1) {
    const element = document.getElementById(selector.slice(1))
    if (!(element instanceof HTMLElement)) return null
    return element
  }

  if (sanitizedSelector[0] === "." && selector.indexOf(" ") === -1) {
    const elements = document.getElementsByClassName(selector.slice(1))
    if (elements.length === 0) return null
    if (!(elements[0] instanceof HTMLElement)) return null
    return elements[0]
  }

  const element = document.querySelector(selector)
  if (!(element instanceof HTMLElement)) return null
  return element
}

export function findElements(selector: string): Element[] {
  const sanitizedSelector = selector.trim()
  if (sanitizedSelector.length === 0) return []

  if (sanitizedSelector[0] === "#" && sanitizedSelector.indexOf(" ") === -1) {
    const element = document.getElementById(selector.slice(1))
    return element ? [element] : []
  }

  if (sanitizedSelector[0] === "." && selector.indexOf(" ") === -1) {
    return Array.from(document.getElementsByClassName(selector.slice(1))).reduce<HTMLElement[]>(
      (elements, el) => (el instanceof HTMLElement ? [...elements, el] : elements),
      [],
    )
  }

  return Array.from(document.querySelectorAll(selector)).reduce<HTMLElement[]>(
    (elements, el) => (el instanceof HTMLElement ? [...elements, el] : elements),
    [],
  )
}

export function createElement<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  props: Record<string, string>,
  innerHTML: string,
): HTMLElementTagNameMap[T] {
  const el = document.createElement(tag)
  Object.keys(props).forEach(key => el.setAttribute(key, props[key]))
  Object.assign(el, props)
  el.innerHTML = innerHTML.trim()
  return el
}
