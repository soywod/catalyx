import {BehaviorSubject} from "rxjs";

import {defineElement} from "../custom-elem";
import {find} from "../dom-utils";

defineElement(function demoCounter(elem) {
  const counter$ = new BehaviorSubject(0);
  const shadow = elem.attachShadow({mode: "open"});

  shadow.innerHTML = `
    <link rel="stylesheet" href="https://unpkg.com/bulma@0.8.2/css/bulma.min.css">
    <div class="panel">
      <div class="panel-heading">
        Counter
      </div>
      <div class="panel-block">
        <div class="control field has-addons">
          <div class="control">
            <button id="sub" class="button">-</button>
          </div>
          <div class="control is-expanded">
            <input id="counter" class="input has-text-weight-bold has-text-centered is-paddingless is-fullwidth" type="text" readonly>
          </div>
          <div class="control">
            <button id="add" class="button">+</button>
          </div>
        </div>
      </div>
    </div>
  `;

  find("#sub", shadow).on("click", () => counter$.next(counter$.value - 1));
  find("#add", shadow).on("click", () => counter$.next(counter$.value + 1));
  find("#counter", shadow).bind(counter$, (counter, elem) => {
    if (elem instanceof HTMLInputElement) {
      elem.value = String(counter);
      elem.classList.remove("has-text-success", "has-text-danger");
      if (counter > 0) elem.classList.add("has-text-success");
      if (counter < 0) elem.classList.add("has-text-danger");
    }
  });
});
