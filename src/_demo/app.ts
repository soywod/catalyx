import {WebComponent} from "../web-component";

import "./counter";
import "./todo";

class DemoApp extends WebComponent {
  render() {
    return `
      <demo-counter></demo-counter>
      <demo-counter></demo-counter>
      <demo-counter></demo-counter>
    `;
  }
}

customElements.define("demo-app", DemoApp);
