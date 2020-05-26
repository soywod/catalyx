import {createPopper, Instance as PopperInstance, Placement} from "@popperjs/core";

import {findOrFail, findAllOrFail, parseStyle, parseTpl} from "../dom-utils";
import {parsePlacement} from "../dialogs";
import {Checkbox} from "../buttons";
import {TextField} from "../fields";

import textStyle from "../fields/text.css";
import prefixTpl from "../fields/text-prefix.html";
import textTpl from "../fields/text.html";
import clearTpl from "../fields/text-clear.html";
import suffixTpl from "../fields/text-suffix.html";
import tooltipTpl from "../fields/text-tooltip.html";
import optionTpl from "./option.html";
import optionStyle from "./option.css";
import selectStyle from "./select.css";
import selectTpl from "./select.html";

const style = textStyle + selectStyle;
const tpl = prefixTpl + textTpl + clearTpl + suffixTpl + tooltipTpl + selectTpl;

export class Option extends HTMLElement {
  public _checkbox: Checkbox;

  public constructor() {
    super();

    this.attachShadow({mode: "open", delegatesFocus: true}).append(
      parseStyle(optionStyle),
      parseTpl(optionTpl),
    );

    this._checkbox = findOrFail(this.shadowRoot, Checkbox, "option");
  }

  protected connectedCallback() {
    this._checkbox.addEventListener("change", this._handleChange);
  }

  protected disconnectedCallback() {
    this._checkbox.removeEventListener("change", this._handleChange);
  }

  private _handleChange = () => {
    this.dispatchEvent(new CustomEvent("change", {detail: {value: this.selected}}));
  };

  public get selected() {
    return this._checkbox.checked;
  }

  public set selected(val: boolean) {
    this._checkbox.checked = val;
  }

  public get value() {
    return this.getAttribute("value") || "";
  }

  public set hideCheckbox(val: boolean) {
    this._checkbox.hideCheckmark = val;
  }

  public get hideCheckbox() {
    return this._checkbox.hideCheckmark;
  }
}

export class Select extends TextField {
  private _popperPlacement: Placement;
  private _popperInstance?: PopperInstance;
  private _picker: HTMLDivElement;
  private _opts: Option[];

  private _isMultiple = false;
  private _min = 1;
  private _max = 1;
  private _selectedOptsCount = 0;

  public constructor() {
    super({style, tpl});

    const max = Number(this.getAttribute("max")) || 1;
    const isMultiple = this.hasAttribute("multiple");

    this._picker = findOrFail(this.shadowRoot, HTMLDivElement, "picker");
    this._picker.append(...this.children);
    if (!this.hasAttribute("multiple")) {
      for (const child of this._picker.children) {
        if (child instanceof Option) {
          child.hideCheckbox = true;
        }
      }
    }

    this._opts = findAllOrFail(this._picker, Option, "cx-option");
    this._popperPlacement = parsePlacement(this._picker.getAttribute("placement"));

    this._min = Number(this.getAttribute("min")) || 1;
    this._max = this.hasAttribute("max") ? max : isMultiple ? this._opts.length - 1 : 1;
    this._isMultiple = this._max > 1;

    Array.from(this.children).forEach(child => child.remove());
  }

  connectedCallback() {
    this.addEventListener("focus", this._showPicker);
    this.addEventListener("blur", this._hidePicker);
    this._picker.addEventListener("mousedown", this._preventDefault);
    this._picker.addEventListener("touchstart", this._preventDefault);
    this._input.addEventListener("input", this.validate);
    this._opts.forEach(opt => opt.addEventListener("change", this._updateSelectedOpts));
  }

  disconnectedCallback() {
    this.removeEventListener("focus", this._showPicker);
    this.removeEventListener("blur", this._hidePicker);
    this._picker.removeEventListener("mousedown", this._preventDefault);
    this._picker.removeEventListener("touchstart", this._preventDefault);
    this._input.removeEventListener("input", this.validate);
    this._opts.forEach(opt => opt.removeEventListener("change", this._updateSelectedOpts));
  }

  private _updateSelectedOpts = (evt: Event) => {
    const {target} = evt;

    if (evt instanceof CustomEvent && target instanceof Option) {
      if (this._isMultiple) {
        this._selectedOptsCount += evt.detail.value === true ? 1 : -1;
        this._input.value = this._opts
          .filter(opt => opt.selected)
          .reduce<string[]>((values, opt) => [...values, opt.textContent || ""], [])
          .join(", ");
      } else {
        this._opts.forEach(opt => (opt.selected = false));
        target.selected = true;
        this._input.value = target.textContent || "";
        this.blur();
      }

      this.validate();
    }
  };

  private _preventDefault = (evt: MouseEvent | TouchEvent) => {
    evt.preventDefault();
  };

  protected _postValidate = () => {
    if (this._isMultiple) {
      if (this._selectedOptsCount < this._min) {
        throw new Error(`Please select at least ${this._min} option(s).`);
      }

      if (this._selectedOptsCount > this._max) {
        throw new Error(`Please select no more than ${this._max} option(s).`);
      }
    }
  };

  private _showPicker = () => {
    this._popperInstance = createPopper(this._input, this._picker, {
      placement: this._popperPlacement,
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ],
    });
    this.setAttribute("visible", "");
  };

  private _hidePicker = () => {
    if (this._popperInstance) {
      this.removeAttribute("visible");
      this._popperInstance.destroy();
      this._popperInstance = undefined;
    }
  };
}

customElements.define("cx-option", Option);
customElements.define("cx-select", Select);
