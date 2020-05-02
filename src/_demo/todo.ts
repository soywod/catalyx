import {BehaviorSubject} from "rxjs";
import cn from "classnames";

import {defineElement} from "../custom-elem";
import {find} from "../dom-utils";

type Task = {
  desc: string;
  done: boolean;
};

defineElement(function demoTodo(elem) {
  const tasks$ = new BehaviorSubject<Task[]>([]);
  const shadow = elem.attachShadow({mode: "open"});

  shadow.innerHTML = `
    <link rel="stylesheet" href="https://unpkg.com/bulma@0.8.2/css/bulma.min.css">
    <style>
      .has-line-through {
        text-decoration: line-through;
      }
    </style>
    <form class="panel">
      <div class="panel-heading">
        Todo
      </div>
      <div class="panel-block">
        <div class="control field has-addons">
          <div class="control is-expanded">
            <input class="input is-fullwidth" name="task" type="text">
          </div>
          <div class="control">
            <button class="button" type="submit">Add</button>
          </div>
        </div>
      </div>
      <div id="tasks"></div>
    </form>
  `;

  find("form", shadow).on("submit", evt => {
    if (evt.target instanceof HTMLFormElement) {
      evt.preventDefault();
      const taskDesc = new FormData(evt.target).get("task");
      const taskInput = evt.target.elements.namedItem("task");

      if (taskDesc) {
        tasks$.next([...tasks$.value, {desc: String(taskDesc), done: false}]);
      }

      if (taskInput instanceof HTMLInputElement) {
        taskInput.value = "";
      }
    }
  });

  find("#tasks", shadow)
    .bind(tasks$, task => {
      const classes = cn("panel-block task", {"has-text-grey-lighter has-line-through": task.done});
      return `<a class="${classes}">${task.desc}</div>`;
    })
    .on("click", ".task", evt => {
      tasks$.next(tasks$.value.map((t, key) => (key === evt.key ? {...t, done: !t.done} : t)));
    })
    .on("contextmenu", ".task", evt => {
      evt.preventDefault();
      tasks$.next(tasks$.value.filter((_, key) => key !== evt.key));
    });
});
