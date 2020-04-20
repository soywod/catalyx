import {BehaviorSubject} from "rxjs"

import {findElement, createElement} from "../dom-utils"
import {bind, bindArr, on} from "../bind"

const counter$ = new BehaviorSubject(1)
const counterEl = findElement("#counter")
const incEl = findElement("#inc")

bind(counter$, counterEl, (counter, el) => {
  el.innerHTML = String(counter)
})

on("click", incEl, () => {
  counter$.next(counter$.value + 1)
  data$.next([...data$.value, {name: "YOLO"}])
})

type Data = {
  name: string
}

const data$ = new BehaviorSubject<Data[]>([])

const tableEl = findElement("#table tbody")

if (tableEl) {
  const tableObserver = new MutationObserver(mutlist => {
    console.log(mutlist)
  })

  tableObserver.observe(tableEl, {childList: true})
}

bindArr(
  data$,
  tableEl,
  (change, el) => {
    switch (change.type) {
      case "create": {
        el.appendChild(
          createElement("tr", {"data-idx": String(change.idx)}, `<td>${change.item.name}</td>`),
        )
        break
      }

      case "update": {
        const rowEl = el.children.item(change.idx)
        rowEl &&
          rowEl.replaceWith(
            createElement("tr", {"data-idx": String(change.idx)}, `<td>${change.item.name}</td>`),
          )
        break
      }

      case "delete": {
        const rowEl = el.children.item(change.idx)
        rowEl && rowEl.remove()
        break
      }
    }
  },
  (a, b) => a.name === b.name,
)

on("click", tableEl, evt => {
  if (evt.target instanceof HTMLTableCellElement) {
    if (evt.target.parentElement) {
      const idx = evt.target.parentElement.getAttribute("data-idx")
      if (idx) {
        data$.next(Object.assign(data$.value, {[+idx]: {name: "coucou"}}))
      }
    }
  }
})
