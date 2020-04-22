import {BehaviorSubject} from "rxjs";
import cn from "classnames";

import {defineCustomElement} from "../../dom-utils";
import template from "./todo.html";
import styles from "./todo.css";

type Task = {
  desc: string;
  done: boolean;
};

const tasks$ = new BehaviorSubject<Task[]>([]);
const taskName$ = new BehaviorSubject<string | null>(null);

defineCustomElement(template, styles, $ => {
  $("form").on("submit", evt => {
    evt.preventDefault();
    if (taskName$.value) {
      tasks$.next([...tasks$.value, {desc: taskName$.value, done: false}]);
      taskName$.next(null);
    }
  });

  $("input").bind(taskName$, (taskName, elem) => {
    if (elem instanceof HTMLInputElement) {
      elem.value = taskName || "";
    }
  });

  $("input").on("change", evt => {
    if (evt.target instanceof HTMLInputElement) {
      taskName$.next(evt.target.value);
    }
  });

  $(".tasks").bindList(tasks$, task => {
    const classes = cn("task", {done: task.done});
    return `<div class="${classes}">${task.desc}</div>`;
  });

  $(".tasks").on("click", ".task", evt => {
    tasks$.next(tasks$.value.map((t, key) => (key === evt.key ? {...t, done: !t.done} : t)));
  });
});
