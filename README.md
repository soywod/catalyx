# ⚗️ Catalyx [![Build Status](https://travis-ci.org/soywod/catalyx.svg?branch=master)](https://travis-ci.org/soywod/catalyx) [![npm](https://img.shields.io/npm/v/catalyx?label=npm)](https://www.npmjs.com/package/catalyx)

Catalyx is a collection of native web components:

✔ based on **Web Components** standards<br>
✔ written in pure **JavaScript** (`0` dependency)<br>
✔ lightweight, performant and customizable<br>

*Live demo at https://catalyx.soywod.me.*

## Table of contents

- [Roadmap to `v1`](#roadmap-to-v1)
- [Inputs](#inputs)
  - [Text](#text)
  - [Text area](#text-area)
  - [Email](#email)
  - [Password](#password)
  - [Number](#number)
- [Tooltip](#tooltip)
- [Typos](#typos)
  - [Heading](#heading)
- [Changelog](https://github.com/soywod/catalyx/blob/master/CHANGELOG.md)
- [License](https://github.com/soywod/catalyx/blob/master/LICENSE)

## Roadmap to `v1`

- [ ] Inputs
  - [X] Text
  - [X] Text area
  - [X] Email
  - [X] Password
  - [X] Number
  - [ ] Phone
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
  - [X] Tooltip
  - [ ] Form engine
  - [ ] Routing engine
  - [ ] Drawer
  - [ ] Modal
  - [ ] Toast

## Inputs

### Text

Control for entering text.

#### Usage

```html
<cx-text-input></cx-text-input>
```

#### Attributes

Accept all `<input type="text">` attributes.

### Text area

Control for entering multilined text.

#### Usage

```html
<cx-text-area></cx-text-area>
```

#### Attributes

Accept all `<textarea>` attributes.

### Email

Control for entering email.

#### Usage

```html
<cx-email-input></cx-email-input>
```

#### Attributes

Accept all `<input type="email">` attributes.

### Password

Control for entering password. The password can be shown or hidden with the toggler on the right side.

#### Usage

```html
<cx-password-input></cx-password-input>
```

#### Attributes

Accept all `<input type="password">` attributes.

### Number

Control for entering number. The value can be incremented and decremented via the input (right buttons), via the keyboard (top and bottom arrow), and via the mouse (wheel). The value can be formatted (on blur) by [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat#Using_locales).

#### Usage

```html
<cx-number-input></cx-number-input>
```

#### Attributes

Accept all `<input type="number">` attributes.

#### Properties

Name|Description|Example
---|---|---
`intl`|Instance of [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).|`elem.intl = new Intl.NumberFormat()`

## Tooltip

Text / HTML popup tip.

#### Usage

```html
<cx-tooltip title="Text tip">
  <button>Hover me</button>
  <span slot="title"><strong>HTML tip</strong></span>
</cx-tooltip>
```

#### Attributes

Name|Description|Example
---|---|---
`title`|String title.|`<cx-tooltip title="String tip">`

#### Slots

Name|Description|Example
---|---|---
`title`|HTML title.|`<span slot="title"><strong>HTML tip</strong></span>`

## Links

- [CSS `::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
- [Various way of styling a web component](https://www.smashingmagazine.com/2016/12/styling-web-components-using-a-shared-style-sheet/)
- [Awesome Google doc about Web Components](https://developers.google.com/web/fundamentals/web-components)
- [List of HTML colors](https://en.wikipedia.org/wiki/Web_colors)
- [Web Components and SEO](https://medium.com/patternfly-elements/web-components-and-seo-58227413e072)
- [List of HTML5 inputs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Labels_and_placeholders)
