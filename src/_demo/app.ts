import {WebComponent} from "../web-component";

import "./counter";
import "./todo";

const component = new WebComponent();

component.template = `
  <demo-counter></demo-counter>
  <demo-todo></demo-todo>
`;

component.registerAs("demo-app");
