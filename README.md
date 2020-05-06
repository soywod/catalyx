# ⚗️ Catalyx [![Build Status](https://travis-ci.org/soywod/catalyx.svg?branch=master)](https://travis-ci.org/soywod/catalyx) [![npm](https://img.shields.io/npm/v/catalyx?label=npm)](https://www.npmjs.com/package/catalyx)

Catalyx is a collection of native web components:

✔ based on **Web Components** standards<br>
✔ written in pure **JavaScript** (`0` dependency)<br>
✔ lightweight, performant and customizable<br>

## Table of contents

- [Roadmap to `v1`](#roadmap-to-v1)
- [Inputs](#inputs)
  - [Number](#number)
- [Changelog](https://github.com/soywod/catalyx/blob/master/CHANGELOG.md)
- [License](https://github.com/soywod/catalyx/blob/master/LICENSE)

## Roadmap to `v1`

- [ ] Inputs
  - [ ] Button / reset / submit
  - [ ] Checkbox
  - [ ] Color
  - [ ] Datetime
  - [ ] Email
  - [ ] File
  - [X] Number
  - [ ] Password
  - [ ] Phone
  - [ ] Radio
  - [ ] Switch
  - [ ] Text
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

### Number

*Size: 5kB*

Control for entering a number. Authorized chars: `-.0123456789`. The value can be incremented and decremented via the input (right buttons), via the keyboard (top and bottom arrow), and via the mouse (wheel). The value is formatted (on blur) by [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat#Using_locales).

#### Attributes

Name|Description|Example
---|---|---
`min`|Minimum value to accept.|`<cx-input-number min="0"></cx-input-number>`
`max`|Maximum value to accept.|`<cx-input-number max="100"></cx-input-number>`
`step`|Granularity that the value must adhere to. Also restrict the fractional part: `step >= 1` means only integers. `step >= 0.01` means only 2 fractional digits.|`<cx-input-number step="0.1"></cx-input-number>`

#### Properties

## Links

- [CSS `::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
- [Various way of styling a web component](https://www.smashingmagazine.com/2016/12/styling-web-components-using-a-shared-style-sheet/)
- [Awesome Google doc about Web Components](https://developers.google.com/web/fundamentals/web-components)
- [List of HTML colors](https://en.wikipedia.org/wiki/Web_colors)
- [Web Components and SEO](https://medium.com/patternfly-elements/web-components-and-seo-58227413e072)
- [List of HTML5 inputs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Labels_and_placeholders)
