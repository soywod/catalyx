# ⚗️ Catalyx [![Build Status](https://travis-ci.org/soywod/catalyx.svg?branch=master)](https://travis-ci.org/soywod/catalyx) [![npm](https://img.shields.io/npm/v/catalyx?label=npm)](https://www.npmjs.com/package/catalyx)

Catalyx is a collection of native web components:

✔ based on **Web Components** standards<br>
✔ written in pure **JavaScript** (`0` dependency)<br>
✔ lightweight, performant and customizable<br>

## Table of contents

- [Roadmap to `v1`](#roadmap-to-v1)
- [Inputs](#inputs)
  - [Text](#text)
  - [Number](#number)
  - [Password](#password)
- [Typos](#typos)
  - [Heading](#heading)
- [Changelog](https://github.com/soywod/catalyx/blob/master/CHANGELOG.md)
- [License](https://github.com/soywod/catalyx/blob/master/LICENSE)

## Roadmap to `v1`

- [ ] Inputs
  - [X] Text
  - [X] Number
  - [X] Password
  - [ ] Phone
  - [ ] Email
  - [ ] Datetime
  - [ ] Button
  - [ ] Checkbox
  - [ ] Color
  - [ ] File
  - [ ] Radio
  - [ ] Switch
- [ ]  Typos
  - [X] Heading
  - [ ] Paragraph
- [ ] Layouts
  - [ ] Grid
  - [ ] List
  - [ ] Media query
  - [ ] Table
- [ ] Engines
  - [ ] Form engine
  - [ ] Routing engine
  - [ ] Floating element positioning engine (popper.js like)
    - [ ] Drawer
    - [ ] Modal
    - [ ] Popover
    - [ ] Toast
    - [ ] Tooltip

## Inputs

### Text

Control for entering text.

#### Usage

```html
<cx-input-text></cx-input-text>
```

#### Attributes

Accept all `<input type="text">` and `<textarea></textarea>` attributes combined.

### Number

Control for entering number. The value can be incremented and decremented via the input (right buttons), via the keyboard (top and bottom arrow), and via the mouse (wheel). The value can be formatted (on blur) by [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat#Using_locales).

#### Usage

```html
<cx-input-number></cx-input-number>
```

#### Attributes

Accept all `<input type="number">` attributes.

#### Properties

Name|Description|Example
---|---|---
`intl`|Instance of [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).|`elem.intl = new Intl.NumberFormat()`

### Password

Control for entering password. The password can be shown or hidden with the toggler on the right side.

#### Usage

```html
<cx-input-password></cx-input-password>
```

#### Attributes

Accept all `<input type="password">` attributes.

## Links

- [CSS `::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
- [Various way of styling a web component](https://www.smashingmagazine.com/2016/12/styling-web-components-using-a-shared-style-sheet/)
- [Awesome Google doc about Web Components](https://developers.google.com/web/fundamentals/web-components)
- [List of HTML colors](https://en.wikipedia.org/wiki/Web_colors)
- [Web Components and SEO](https://medium.com/patternfly-elements/web-components-and-seo-58227413e072)
- [List of HTML5 inputs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Labels_and_placeholders)
