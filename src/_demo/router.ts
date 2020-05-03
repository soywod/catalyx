import {BehaviorSubject} from "rxjs";

import {defineElement} from "../custom-elem";
import {find} from "../dom-utils";

const route$ = new BehaviorSubject(window.location.pathname);

window.addEventListener("popstate", () => route$.next(document.location.pathname));

function pushState(url: string) {
  history.pushState(undefined, "", url);
  route$.next(url);
}

defineElement(function demoRouter(elem) {
  const shadow = elem.attachShadow({mode: "open"});

  shadow.innerHTML = `
    <link rel="stylesheet" href="https://unpkg.com/bulma@0.8.2/css/bulma.min.css">
    <div class="panel">
      <div class="panel-heading">
        Router
      </div>
      <div class="panel-tabs">
        <a href="/one">One</a>
        <a href="/two">Two</a>
        <a href="/three">Three</a>
        <a href="/four">Four</a>
      </div>
      <div class="panel-block">
      </div>
    </div>
  `;

  find("a", shadow)
    .on("click", evt => {
      if (evt.target instanceof HTMLAnchorElement) {
        evt.preventDefault();
        const href = evt.target.getAttribute("href");
        href && pushState(href);
      }
    })
    .bind(route$, (route, elem) => {
      if (elem instanceof HTMLAnchorElement) {
        const href = elem.getAttribute("href");
        elem.classList.remove("is-active");
        href === route && elem.classList.add("is-active");
      }
    });

  find(".panel-block", shadow).bind(route$, route => `Route: <code>${route}</code>`);
});
