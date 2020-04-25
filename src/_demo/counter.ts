import {BehaviorSubject} from "rxjs";

import {WebComponent, CustomElement} from "../web-component";

import style from "./counter.scss";

const counter$ = new BehaviorSubject(0);

@CustomElement("demo-counter")
export default class extends WebComponent {
  constructor() {
    super({style});

    this.find(".counter").bind(counter$);

    this.find(".sub")
      .bind("-")
      .on("click", () => counter$.next(counter$.value - 1));

    this.find(".add")
      .bind("+")
      .on("click", () => counter$.next(counter$.value + 1));
  }

  render() {
    return `
      <button class="sub"></button>
      <div class="counter"></div>
      <button class="add"></button>
    `;
  }
}
