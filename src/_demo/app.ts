import {defineCustomElement} from "../dom-utils";

import "./counter";
import "./todo";

defineCustomElement(`
  <template id="demo-app">
    <demo-counter></demo-counter>
    <demo-todo></demo-todo>
  </template>
`);
