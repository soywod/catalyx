import {BehaviorSubject} from "rxjs";

import {WebComponent} from "../web-component";

import style from "./counter.scss";

const counter$ = new BehaviorSubject(0);

const component = new WebComponent();

component.style = style;
component.template = `
  <button class="sub">-</button>
  <div class="counter"></div>
  <button class="add">+</button>
`;

component.find(".counter").bind(counter$, String);
component.find(".sub").on("click", () => counter$.next(counter$.value - 1));
component.find(".add").on("click", () => counter$.next(counter$.value + 1));

component.registerAs("demo-counter");
