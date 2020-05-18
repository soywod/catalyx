# ⚗️ Catalyx [![Build Status](https://travis-ci.org/soywod/catalyx.svg?branch=master)](https://travis-ci.org/soywod/catalyx) [![npm](https://img.shields.io/npm/v/catalyx?label=npm)](https://www.npmjs.com/package/catalyx)

Catalyx is a collection of native web components:

✔ based on **Web Components** standards<br>
✔ written in pure **JavaScript**<br>
✔ lightweight, performant and customizable<br>

*Live demo at https://catalyx.soywod.me.*

## Table of contents

- [Roadmap to `v1`](#roadmap-to-v1)
- [Buttons](#buttons)
  - [Button](#button)
  - [Choice](#choice)
  - [Switch](#switch)
- [Fields](#fields)
  - Text based
    - [Text](#text)
    - [Email](#email)
    - [Tel](#tel)
    - [URL](#url)
    - [Password](#password)
    - [Phone](#phone)
  - Number based
    - [Integer](#integer)
    - [Float](#float)
    - [Currency](#currency)
- [Pickers](#pickers)
  - [Date](#date)
- [Dialogs](#dialogs)
  - [Tooltip](#tooltip)
- [Layouts](#layouts)
  - [Heading](#heading)
- [Changelog](https://github.com/soywod/catalyx/blob/master/CHANGELOG.md)
- [License](https://github.com/soywod/catalyx/blob/master/LICENSE)

## Roadmap to `v1`

- [ ] Buttons
  - [X] Button
  - [ ] Choice
  - [ ] Switch
- [X] Fields
  - [X] Text based
    - [X] Text
    - [X] Email
    - [X] Tel
    - [X] URL
    - [X] Password
    - [X] Phone
  - [X] Number based
    - [X] Integer
    - [X] Float
    - [X] Currency
- [ ] Pickers
  - [X] Date
  - [ ] Time
  - [ ] Datetime
  - [ ] Month
  - [ ] Range
  - [ ] Color
  - [ ] File
- [ ] Dialogs
  - [X] Tooltip
  - [ ] Modal
  - [ ] Toast
  - [ ] Drawer
  - [ ] Dropdown
  - [ ] Notification
- [ ] Layouts
  - [X] Heading
  - [ ] Form
  - [ ] Router

## Buttons
### Button
## Fields
### Text

Control for entering a single or multiple lines of text.

#### Usage

```html
<cx-text-field></cx-text-field>
```

#### Attributes

Accept all `<input type="text">` attributes.

### Email

Control for entering an email. Extends [Text field](#text).

#### Usage

```html
<cx-email-field></cx-email-field>
```

#### Attributes

Accept all `<input type="email">` attributes.

### Password

Control for entering a password. Extends [Text field](#text). The password can be
shown or hidden with the toggler on the right side.

#### Usage

```html
<cx-password-field></cx-password-field>
```

#### Attributes

Accept all `<input type="password">` attributes.

### Integer

Control for entering an integer. The value can be incremented and decremented via the input (right buttons), via the keyboard (top and bottom arrow), and via the mouse (wheel).

#### Usage

```html
<cx-integer-field></cx-integer-field>
```

#### Attributes

Accept all `<input type="number">` attributes.

### Float

Control for entering a float.

#### Usage

```html
<cx-float-field></cx-float-field>
```

### Currency

Control for entering a currency.

#### Usage

```html
<cx-currency-field></cx-currency-field>
```

### Date picker

Control for picking a date based on [`Popper`](https://popper.js.org/) positionning engine.

#### Usage

```html
<cx-date-picker></cx-date-picker>
```

#### Attributes

#### Properties

#### Events

Name|Description|Example
---|---|---
`change`|Called when the date changes. Date available in `evt.detail.date`.|`elem.addEventListener("change", handler)`

## Tooltip

Text popup tip based on [`Popper`](https://popper.js.org/) positionning engine.

#### Usage

```html
<cx-tooltip title="Tooltip">
  <button>Hover me</button>
</cx-tooltip>
```

#### Attributes

Name|Description|Example
---|---|---
`title`|Tooltip title initializer.|`<cx-tooltip title="Text tip">`
`placement`|Tooltip position initializer. Possible values: <code>top</code> (default), <code>bottom</code>, <code>right</code>, <code>left</code>, <code>top-start</code>, <code>top-end</code>, <code>bottom-start</code>, <code>bottom-end</code>, <code>right-start</code>, <code>right-end</code>, <code>left-start</code>, <code>left-end</code>, <code>auto</code>, <code>auto-start</code>, <code>auto-end</code>|`<cx-tooltip placement="right">`

#### Properties

Name|Description|Example
---|---|---
`title`|Tooltip title setter.|`elem.title = "New tooltip"`
`placement`|Tooltip position setter. Same possible values as `placement` attribute.|`elem.placement = "bottom"`

## Links

- [CSS `::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
- [Various way of styling a web component](https://www.smashingmagazine.com/2016/12/styling-web-components-using-a-shared-style-sheet/)
- [Awesome Google doc about Web Components](https://developers.google.com/web/fundamentals/web-components)
- [List of HTML colors](https://en.wikipedia.org/wiki/Web_colors)
- [Web Components and SEO](https://medium.com/patternfly-elements/web-components-and-seo-58227413e072)
- [List of HTML5 inputs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Labels_and_placeholders)
