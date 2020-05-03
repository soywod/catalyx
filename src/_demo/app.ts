import {defineElement} from "../custom-elem";

import "./counter";
import "./todo";
import "./router";

defineElement(function demoApp(elem) {
  elem.innerHTML = `
    <div class="columns">
      ${["counter", "todo", "router"].reduce(
        (html, elem) =>
          html +
          `
            <div class="column is-one-quarter">
              <demo-${elem}></demo-${elem}>
            </div>
          `,
        "",
      )}
    </div>
  `;
});
