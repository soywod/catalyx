import {defineElement} from "../custom-elem";

import "./counter";
import "./todo";

defineElement(function demoApp(elem) {
  elem.innerHTML = `
    <div class="columns">
      <div class="column is-one-quarter">
        <demo-counter></demo-counter>
      </div>
      <div class="column is-one-quarter">
        <demo-todo></demo-todo>
      </div>
    </div>
  `;
});
