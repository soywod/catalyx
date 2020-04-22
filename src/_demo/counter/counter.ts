import {BehaviorSubject} from "rxjs";

import {defineCustomElement} from "../../dom-utils";
import template from "./counter.html";
import styles from "./counter.css";

const counter$ = new BehaviorSubject(0);

defineCustomElement(template, styles, $ => {
  $(".view").bind(counter$, String);
  $(".sub").on("click", () => counter$.next(counter$.value - 1));
  $(".add").on("click", () => counter$.next(counter$.value + 1));
});
