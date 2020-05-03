# ⚗️ Catalyx [![Build Status](https://travis-ci.org/soywod/catalyx.svg?branch=master)](https://travis-ci.org/soywod/catalyx) [![npm](https://img.shields.io/npm/v/catalyx?label=npm)](https://www.npmjs.com/package/catalyx)

JavaScript utility to build reactive interfaces:

✔ built on the top of **Web Components** standards<br>
✔ based on **Observable pattern** (feel free to use the lib of your choice)<br>
✔ no dependency (`2kB` gzipped)<br>

*Live demo at https://catalyx.soywod.me.*

## Table of contents

- [Motivation](#motivation)
- [Installation](#installation)
  - [CDN](#cdn)
  - [NPM](#npm)
- [Usage](#usage)
  - [`defineElement`](#defineelement)
  - [`find`](#find)
  - [`bind`](#bind)
  - [`on`](#on)
  - [`Binder`](#binder)
- [Examples](#examples)
- [Development](#development)
- [Tests](#tests)
- [Changelog](https://github.com/soywod/catalyx/blob/master/CHANGELOG.md)
- [License](https://github.com/soywod/catalyx/blob/master/LICENSE)

## Motivation

- [React](https://reactjs.org/) is a great JavaScript library. But the DOM abstraction is too strong. Over time, you forget how to interact with it. You end up being dependant on `React`, and not being able to code in pure `JavaScript`.
- [Web Components](https://developer.mozilla.org/fr/docs/Web/Web_Components) are more and more supported by browsers. Missing features can be provided by powerful [polyfills](https://github.com/webcomponents/polyfills).
- The [Observable pattern](https://en.wikipedia.org/wiki/Observer_pattern) is a strong pattern, especially with events. It makes it a good candidate for DOM manipulations.

Catalyx emerged from this three statments: it's a small JavaScript utility built on the top of Web Components standards using the Observable pattern to reactively interact with the DOM.

```javascript
// demo-counter.js
import {defineElement, find} from "catalyx";
import {BehaviorSubject} from "rxjs";

function demoCounter(elem) {
  const counter$ = new BehaviorSubject(0);

  elem.innerHTML = `
    <button>-</button>
    <span></span>
    <button>+</button>
  `;

  find("span", elem).bind(counter$);
  find("button:first-of-type", elem).on("click", () => counter$.next(counter$.value - 1));
  find("button:last-of-type", elem).on("click", () => counter$.next(counter$.value + 1));
}

defineElement(demoCounter)
```

```html
<!-- index.html -->
<demo-counter></demo-counter>
```

## Installation

### CDN

```html
<!-- Exposes the global variable `catalyx` -->
<script src="https://unpkg.com/catalyx/lib/index.umd.js"></script>
```

### NPM

```bash
yarn add catalyx
npm install catalyx
```

Then:

```javascript
import {...} from "catalyx"
```

## Usage

### `defineElement`

Defines a custom element. Its name depends on the function's name passed as argument:

```typescript
function defineElement(fn: CustomElement, opts: CustomElementOpts = {}): void;

type CustomElement = (elem: HTMLElement) => string | null | void;
type CustomElementOpts = ElementDefinitionOptions & {
  name?: string;
  class?: CustomElementConstructor;
};
```

Example:

```javascript
// Defines a custom element called <my-custom-element>
defineElement(myCustomElement);
defineElement(function myCustomElement(elem) {});
defineElement(() => {}, {name: "my-custom-element"});
```

### `find`

Wrapper around `querySelectorAll`. Returns a chainable instance of [`Binder`](#binder).

```typescript
function find(selector: string, parent: ParentNode = document): Binder;
```

Example:

```javascript
find(".my-class");          // Finds classes "my-class" in all the document
find(".my-class", parent);  // Finds classes "my-class" only in parent
```

### `bind`

Binds an Observable to an element. The callback is executed each time a new value is received. Returns a chainable instance of [`Binder`](#binder).

```typescript
function bind<T>(
  data: BinderBindData<T>,
  elems: BinderElement | BinderElement[],
  fn?: BinderBindFn<T>,
): Binder

type BinderBindData<T> = T[] | T | Observable<T[]> | Observable<T>;
type BinderElement = Node & ParentNode & InnerHTML;
type BinderBindFn<T> = (val: T, elem: BinderElement, idx: number) => any;
```

Example (with `rxjs` Observable):

```javascript
import {BehaviorSubject} from "rxjs";

const counter$ = new BehaviorSubject(0);

// If no callback given, binds counter$ to elem.innerHTML
bind(counters$, elem);

// Else if callback returns a string, binds string to elem.innerHTML
bind(counters$, elem, counter => `New val: ${counter}`);

// Else just execute the callback
bind(counters$, elem, (counter, elem) => {
  elem.classList.toggle("my-class");
});
```

### `on`

Binds an event to an Observable. Returns a chainable instance of [`Binder`](#binder).

```typescript
function on<T extends keyof GlobalEventHandlersEventMap>(
  evtType: T,
  elems: BinderElement | BinderElement[],
  targetOrFn: string | BinderOnFn<T>,
  fn?: BinderOnFn<T>,
): Binder;

type BinderElement = Node & ParentNode & InnerHTML;
type BinderOnFn<T extends keyof GlobalEventHandlersEventMap> = (
  evt: GlobalEventHandlersEventMap[T] & {
    mainTarget: HTMLElement;
    key: number;
  },
  elem: HTMLElement,
) => void;
```

Example:

```javascript
import {BehaviorSubject} from "rxjs";

const counter$ = new BehaviorSubject(0);

// Increment the counter when click on elem
on("click", elem, () => counter$.next(counter$.value + 1));

// Increment the counter when click on elem subclass
on("click", elem, ".subclass", () => counter$.next(counter$.value + 1));
```

### `Binder`

Class that allows you to chain multiple calls to [`bind`](#bind) and [`on`](#on).

```typescript
class Binder {
  elem: BinderElement | null;
  elems: BinderElement[];

  bind<T>(data: BinderBindData<T>, fn?: BinderBindFn<T>): this;
  on<T extends keyof GlobalEventHandlersEventMap>(
    evtType: T,
    targetOrFn: string | BinderOnFn<T>,
    fn?: BinderOnFn<T>,
  ): this;
}
```

Example:

```javascript
import {BehaviorSubject} from "rxjs";

const counter$ = new BehaviorSubject(0);

find(".my-class", elem)
  .bind(counter$)
  .on("click", console.log);
```

### Examples

- [A basic counter](https://github.com/soywod/catalyx/blob/master/src/_demo/counter.ts)
- [A simple todolist](https://github.com/soywod/catalyx/blob/master/src/_demo/todo.ts)

## Development

```bash
git clone https://github.com/soywod/catalyx.git
cd catalyx
yarn install
```

To start the development server:

```bash
yarn start
```

To build the demo:

```bash
yarn demo
```

To build the lib:

```bash
yarn build
```

*Note: the build is available in the `/lib` folder.*

## Tests

Tests are handled by [Jest](https://jestjs.io/).

```bash
yarn test
```
