import {BehaviorSubject} from "rxjs";

import {$} from "../dom-utils";

const counter$ = new BehaviorSubject(1);

$("#counter").bind(counter$, counter => String(counter));

$("#inc").on("click", () => {
  counter$.next(counter$.value + 1);
  data$.next([...data$.value, {name: "YOLO"}]);
});

type Data = {
  name: string;
};

const data$ = new BehaviorSubject<Data[]>([]);

const $table = $("#table tbody");

$table.bindArr(data$, data => `<tr><td>${data.name}</td></tr>`);

$table.on("click", evt => {
  if (evt.target instanceof HTMLTableCellElement) {
    if (evt.target.parentElement) {
      const idx = evt.target.parentElement.getAttribute("data-key");
      if (idx) {
        data$.next(Object.assign(data$.value, {[+idx]: {name: "YOLO *changed"}}));
      }
    }
  }
});

$table.on("contextmenu", evt => {
  evt.preventDefault();
  if (evt.target instanceof HTMLTableCellElement) {
    if (evt.target.parentElement) {
      const dataIdx = evt.target.parentElement.getAttribute("data-key");
      if (dataIdx) {
        data$.next(
          Object.assign(
            [],
            data$.value.filter((_, idx) => idx !== +dataIdx),
          ),
        );
      }
    }
  }
});
