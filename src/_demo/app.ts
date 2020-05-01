import {WebComponent, CustomElement} from "../web-component";

import "./chat";

@CustomElement()
export class DemoApp extends WebComponent {
  render() {
    return `
      <demo-chat></demo-chat>
    `;
  }
}
