import {WebComponent, CustomElement} from "../web-component";

import "./counter";
import "./todo";

@CustomElement("demo-app")
export default class extends WebComponent {
  render() {
    return `
      <demo-counter></demo-counter>
      <demo-counter></demo-counter>
      <demo-todo></demo-todo>
    `;
  }
}
