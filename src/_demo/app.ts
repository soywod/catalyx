import {WebComponent, CustomElement} from "../web-component";

import "./counter";
import "./todo";

@CustomElement()
export class DemoApp extends WebComponent {
  render() {
    return `
      <demo-counter></demo-counter>
      <demo-counter></demo-counter>
      <demo-todo></demo-todo>
    `;
  }
}
