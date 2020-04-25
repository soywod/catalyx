import {BehaviorSubject} from "rxjs";
import cn from "classnames";

import {WebComponent, CustomElement} from "../web-component";

import style from "./todo.scss";

type Task = {
  desc: string;
  done: boolean;
};

const tasks$ = new BehaviorSubject<Task[]>([]);
const taskName$ = new BehaviorSubject<string | null>(null);

@CustomElement("demo-todo")
export default class extends WebComponent {
  constructor() {
    super({style});

    this.find("form").on("submit", evt => {
      evt.preventDefault();
      if (taskName$.value) {
        tasks$.next([...tasks$.value, {desc: taskName$.value, done: false}]);
        taskName$.next(null);
      }
    });

    this.find("input")
      .bind(taskName$, (taskName, elem) => {
        if (elem instanceof HTMLInputElement) {
          elem.value = taskName || "";
        }
      })
      .on("change", evt => {
        if (evt.target instanceof HTMLInputElement) {
          taskName$.next(evt.target.value);
        }
      });

    this.find(".tasks")
      .bind(tasks$, task => {
        const classes = cn("task", {done: task.done});
        return `<div class="${classes}">${task.desc}</div>`;
      })
      .on("click", ".task", evt => {
        tasks$.next(tasks$.value.map((t, key) => (key === evt.key ? {...t, done: !t.done} : t)));
      })
      .on("contextmenu", ".task", evt => {
        evt.preventDefault();
        tasks$.next(tasks$.value.filter((_, key) => key !== evt.key));
      });
  }

  render() {
    return `
      <form>
        <input type="text">
        <button type="submit">Add</button>
        <div class="tasks"></div>
      </form>
    `;
  }
}
