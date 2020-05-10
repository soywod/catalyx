import {createPopper, Instance as PopperInstance, Placement} from "@popperjs/core";

import {Input} from "./input";
import textStyle from "./text.css";
import datetimeStyle from "./datetime.css";
import textTemplate from "./text.html";
import datetimeTemplate from "./datetime.html";
import iconError from "./icon-error.html";

export class DatetimeInput extends Input {
  private _picker: HTMLDivElement;
  private _placement: Placement;
  private _instance?: PopperInstance;
  private _days: HTMLDivElement;

  constructor() {
    super(textStyle + datetimeStyle, textTemplate + datetimeTemplate + iconError);
    if (!this.shadowRoot) throw new Error("Shadow root not found.");

    const picker = this.shadowRoot.getElementById("picker");
    if (!(picker instanceof HTMLDivElement)) throw new Error("Picker not found.");
    this._picker = picker;
    this._placement = parsePlacement(picker.getAttribute("placement"));

    const days = this.shadowRoot.getElementById("days");
    if (!(days instanceof HTMLDivElement)) throw new Error("Days container not found.");
    this._days = days;
  }

  connectedCallback() {
    this._input.addEventListener("input", this._validate);
    this.addEventListener("focus", this._showPicker);
    this.addEventListener("blur", this._hidePicker);
  }

  disconnectedCallback() {
    this._input.removeEventListener("input", this._validate);
    this.removeEventListener("focus", this._showPicker);
    this.removeEventListener("blur", this._hidePicker);
  }

  private _showPicker = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = 32 - new Date(year, month, 32).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysOfWeek = getDaysOfWeek().reduce((html, day) => html + `<strong>${day}</strong>`, "");
    const emptyDays = [...Array(firstDayOfWeek)].reduce(html => html + `<span></span>`, daysOfWeek);
    const classes = (idx: number) => "day" + (idx + 1 === now.getDate() ? " today" : "");
    const days = [...Array(daysInMonth)].reduce(
      (html, _, idx) => html + `<button class="${classes(idx)}"><span>${idx + 1}</span></button>`,
      emptyDays,
    );

    this._days.innerHTML = days;

    this._instance = createPopper(this._input, this._picker, {
      placement: this._placement,
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
    if (this._instance) {
      this.removeAttribute("visible");
      this._instance.destroy();
      this._instance = undefined;
    }
  };
}

function parsePlacement(str?: string | null): Placement {
  switch (str) {
    case "auto":
    case "auto-start":
    case "auto-end":
    case "top":
    case "top-start":
    case "top-end":
    case "bottom":
    case "bottom-start":
    case "bottom-end":
    case "left":
    case "left-start":
    case "left-end":
    case "right":
    case "right-start":
    case "right-end":
      return str;

    default:
      return "top";
  }
}

function getDaysOfWeek(): string[] {
  const intl = new Intl.DateTimeFormat("fr-FR", {weekday: "narrow"});
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  return [...Array(7)].reduce(
    (days, _, i) => Object.assign(days, {[i]: intl.format(new Date(year, month, day + i))}),
    [],
  );
}

customElements.define("cx-datetime-input", DatetimeInput);
