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

// TODO unsubscribe
if ($table.elem) {
  const tableObserver = new MutationObserver(mutlist => {
    /* console.log(mutlist); */
  });

  tableObserver.observe($table.elem, {childList: true});
}

$table.bindArr(
  data$,
  data => `
    <tr>
      <td>
        <span>${data.name}</span>
      </td>
    </tr>
  `,
);

$table.on("click", "tr", evt => {
  data$.next(Object.assign(data$.value, {[evt.key]: {name: "YOLO *changed"}}));
});

$table.on("contextmenu", "tr", evt => {
  evt.preventDefault();
  data$.next(
    Object.assign(
      [],
      data$.value.filter((_, key) => key !== evt.key),
    ),
  );
});
