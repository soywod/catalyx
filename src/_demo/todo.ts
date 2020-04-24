import {BehaviorSubject} from "rxjs";
import cn from "classnames";

import {WebComponent} from "../web-component";

import style from "./todo.scss";

type Task = {
  desc: string;
  done: boolean;
};

const tasks$ = new BehaviorSubject<Task[]>([]);
const taskName$ = new BehaviorSubject<string | null>(null);

const component = new WebComponent();

component.style = style;
component.template = `
  <form>
    <input type="text">
    <button type="submit">Add</button>
    <div class="tasks"></div>
  </form>
`;

component.find("form").on("submit", evt => {
  evt.preventDefault();
  if (taskName$.value) {
    tasks$.next([...tasks$.value, {desc: taskName$.value, done: false}]);
    taskName$.next(null);
  }
});

component.find("input").bind(taskName$, (taskName, elem) => {
  if (elem instanceof HTMLInputElement) {
    elem.value = taskName || "";
  }
});

component.find("input").on("change", evt => {
  if (evt.target instanceof HTMLInputElement) {
    taskName$.next(evt.target.value);
  }
});

component.find(".tasks").bind(tasks$, task => {
  const classes = cn("task", {done: task.done});
  return `<div class="${classes}">${task.desc}</div>`;
});

component.find(".tasks").on("click", ".task", evt => {
  tasks$.next(tasks$.value.map((t, key) => (key === evt.key ? {...t, done: !t.done} : t)));
});

component.find(".tasks").on("contextmenu", ".task", evt => {
  evt.preventDefault();
  tasks$.next(tasks$.value.filter((_, key) => key !== evt.key));
});

component.registerAs("demo-todo");
