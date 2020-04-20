import {Observable, BehaviorSubject} from "rxjs"
import {withLatestFrom} from "rxjs/operators"

import {ArrDiff, arrayDiffs} from "./array-utils"

export function bind<T>(
  obs$: Observable<T>,
  el: HTMLElement | HTMLElement[] | null,
  fn: (val: T, el: HTMLElement) => void,
) {
  if (el) {
    const elements = Array.isArray(el) ? el : [el]

    elements.forEach(el => {
      obs$.subscribe(val => fn(val, el))
    })
  }
}

export function bindArr<T>(
  next$: Observable<T[]>,
  el: HTMLElement | HTMLElement[] | null,
  fn: (diff: ArrDiff<T>, el: HTMLElement) => void,
  compare?: (a: T, b: T) => boolean,
) {
  if (el) {
    const elements = Array.isArray(el) ? el : [el]

    elements.forEach(el => {
      const prev$ = new BehaviorSubject<T[]>([])

      next$.pipe(withLatestFrom(prev$)).subscribe(([next, prev]) => {
        const diffs = arrayDiffs(prev, next, compare)
        prev$.next([...next])
        diffs.forEach(diff => fn(diff, el))
      })
    })
  }
}

export function on<T extends keyof GlobalEventHandlersEventMap>(
  evtType: T,
  el: HTMLElement | HTMLElement[] | null,
  fn: (evt: GlobalEventHandlersEventMap[T], el: HTMLElement) => void,
) {
  if (el) {
    const elements = Array.isArray(el) ? el : [el]
    elements.forEach(el => {
      el.addEventListener(evtType, evt => fn(evt, el))
    })
  }
}
