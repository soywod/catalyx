import {BehaviorSubject} from "rxjs";

import {defineCustomElement} from "../../dom-utils";
import template from "./counter.html";
import styles from "./counter.css";

const counter$ = new BehaviorSubject(0);

defineCustomElement(template, styles, $ => {
  $(".a-trexCounter__view").bind(counter$, String);
  $(".a-trexCounter__button.-sub").on("click", () => counter$.next(counter$.value - 1));
  $(".a-trexCounter__button.-add").on("click", () => counter$.next(counter$.value + 1));
});
