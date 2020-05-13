import {createPopper, Instance as PopperInstance, Placement} from "@popperjs/core";

import {findOrFail} from "../dom-utils";
import {Input} from "./input";
import textStyle from "./text.css";
import datetimeStyle from "./datetime.css";
import textTemplate from "./text.html";
import datetimeTemplate from "./datetime.html";
import iconError from "./icon-error.html";

import iconPrev from "../icons/chevron-left.svg";
import iconNext from "../icons/chevron-right.svg";

export class DatetimeInput extends Input {
  private _placement: Placement;
  private _instance?: PopperInstance;
  private _picker: HTMLDivElement;
  private _date: Date;

  constructor() {
    super(textStyle + datetimeStyle, textTemplate + datetimeTemplate + iconError);
    this._picker = findOrFail(this.shadowRoot, HTMLDivElement, "picker");
    this._placement = parsePlacement(this._picker.getAttribute("placement"));
    this._date = new Date();
  }

  connectedCallback() {
    this.addEventListener("focus", this._showPicker);
    this.addEventListener("blur", this._hidePicker);
    this._input.addEventListener("input", this._validate);
    this._picker.addEventListener("mousedown", this._handleMouseDown);
  }

  disconnectedCallback() {
    this.removeEventListener("focus", this._showPicker);
    this.removeEventListener("blur", this._hidePicker);
    this._input.removeEventListener("input", this._validate);
    this._picker.removeEventListener("mousedown", this._handleMouseDown);
  }

  private _handleMouseDown = (evt: MouseEvent) => {
    if (!(evt.target instanceof Node)) return;

    const currMonth = findOrFail(this.shadowRoot, HTMLButtonElement, "curr-month");
    if (currMonth.contains(evt.target)) {
      evt.preventDefault();

      this._picker.innerHTML = `
        <div id="monthly-view-header" class="header">
          ${this._renderMonthlyViewHeader()}
        </div>
        <div id="monthly-view-content" class="content">
          ${this._renderMonthlyViewContent()}
        </div>
      `;

      return;
    }

    const prevMonth = findOrFail(this.shadowRoot, HTMLButtonElement, "prev-month");
    if (prevMonth.contains(evt.target)) {
      evt.preventDefault();
      this._date = new Date(this._date.getFullYear(), this._date.getMonth() - 1);
      const dailyViewContent = findOrFail(this.shadowRoot, HTMLDivElement, "daily-view-content");
      findOrFail(
        this.shadowRoot,
        HTMLButtonElement,
        "curr-month",
      ).innerHTML = this._renderCurrMonth();
      findOrFail(
        this.shadowRoot,
        HTMLButtonElement,
        "curr-year",
      ).innerHTML = this._renderCurrYear();
      dailyViewContent.innerHTML = this._renderDailyViewContent();
      return;
    }

    const nextMonth = findOrFail(this.shadowRoot, HTMLButtonElement, "next-month");
    if (nextMonth.contains(evt.target)) {
      evt.preventDefault();
      this._date = new Date(this._date.getFullYear(), this._date.getMonth() + 1);
      const dailyViewContent = findOrFail(this.shadowRoot, HTMLDivElement, "daily-view-content");
      findOrFail(
        this.shadowRoot,
        HTMLButtonElement,
        "curr-month",
      ).innerHTML = this._renderCurrMonth();
      findOrFail(
        this.shadowRoot,
        HTMLButtonElement,
        "curr-year",
      ).innerHTML = this._renderCurrYear();
      dailyViewContent.innerHTML = this._renderDailyViewContent();
      return;
    }

    const prevYear = findOrFail(this.shadowRoot, HTMLButtonElement, "prev-year");
    if (prevYear.contains(evt.target)) {
      evt.preventDefault();
      this._date = new Date(this._date.getFullYear() - 1, this._date.getMonth());
      const dailyViewContent = findOrFail(this.shadowRoot, HTMLDivElement, "daily-view-content");
      findOrFail(
        this.shadowRoot,
        HTMLButtonElement,
        "curr-month",
      ).innerHTML = this._renderCurrMonth();
      findOrFail(
        this.shadowRoot,
        HTMLButtonElement,
        "curr-year",
      ).innerHTML = this._renderCurrYear();
      dailyViewContent.innerHTML = this._renderDailyViewContent();
      return;
    }

    const nextYear = findOrFail(this.shadowRoot, HTMLButtonElement, "next-year");
    if (nextYear.contains(evt.target)) {
      evt.preventDefault();
      this._date = new Date(this._date.getFullYear() + 1, this._date.getMonth());
      const dailyViewContent = findOrFail(this.shadowRoot, HTMLDivElement, "daily-view-content");
      findOrFail(
        this.shadowRoot,
        HTMLButtonElement,
        "curr-month",
      ).innerHTML = this._renderCurrMonth();
      findOrFail(
        this.shadowRoot,
        HTMLButtonElement,
        "curr-year",
      ).innerHTML = this._renderCurrYear();
      dailyViewContent.innerHTML = this._renderDailyViewContent();
      return;
    }
  };

  private _renderCurrMonth = () => {
    return new Intl.DateTimeFormat("fr-FR", {month: "short"}).format(this._date);
  };

  private _renderCurrYear = () => {
    return this._date.getFullYear().toString();
  };

  private _renderDailyViewHeader = () => {
    return `
      <button id="prev-month">${iconPrev}</button>
      <button id="curr-month">${this._renderCurrMonth()}</button>
      <button id="next-month">${iconNext}</button>
      <button id="prev-year">${iconPrev}</button>
      <button id="curr-year">${this._renderCurrYear()}</button>
      <button id="next-year">${iconNext}</button>
    `;
  };

  private _renderDailyViewContent = () => {
    const now = new Date();
    const year = this._date.getFullYear();
    const month = this._date.getMonth();
    const sameMonth = now.getMonth() === month;
    const sameYear = now.getFullYear() === year;
    const daysInMonth = 32 - new Date(year, month, 32).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysOfWeek = getDaysOfWeek().reduce(
      (html, day) => html + `<span class="weekday">${day}</span>`,
      "",
    );
    const emptyDays = [...Array(firstDayOfWeek)].reduce(html => html + `<span></span>`, daysOfWeek);
    const classes = (idx: number) => {
      const sameDay = now.getDate() === idx + 1;
      return "date day" + (sameYear && sameMonth && sameDay ? " today" : "");
    };

    return [...Array(daysInMonth)].reduce(
      (html, _, idx) => html + `<button class="${classes(idx)}"><span>${idx + 1}</span></button>`,
      emptyDays,
    );
  };

  private _renderMonthlyViewHeader = () => {
    return `
      <button id="prev-year">${iconPrev}</button>
      <button id="curr-year">${this._renderCurrYear()}</button>
      <button id="next-year">${iconNext}</button>
    `;
  };

  private _renderMonthlyViewContent = () => {
    const now = new Date();
    const sameYear = now.getFullYear() === this._date.getFullYear();
    return getMonths().reduce((html, month, idx) => {
      const sameMonth = now.getMonth() === idx;
      const classes = "date month" + (sameYear && sameMonth ? " today" : "");
      return html + `<button class="${classes}"><span>${month}</span></button>`;
    }, "");
  };

  private _showPicker = () => {
    this._picker.innerHTML = `
      <div id="daily-view-header" class="header">
        ${this._renderDailyViewHeader()}
      </div>
      <div id="daily-view-content" class="content">
        ${this._renderDailyViewContent()}
      </div>
    `;

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
  const intl = new Intl.DateTimeFormat("fr-FR", {weekday: "short"});
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  return [...Array(7)].reduce((days, _, i) => {
    const date = new Date(year, month, day + i);
    return Object.assign(days, {[date.getDay() % 7]: intl.format(date)});
  }, []);
}

function getMonths(): string[] {
  const intl = new Intl.DateTimeFormat("fr-FR", {month: "short"});
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  return [...Array(12)].reduce((months, _, i) => {
    const date = new Date(year, month + i);
    return Object.assign(months, {[date.getMonth() % 12]: intl.format(date)});
  }, []);
}

customElements.define("cx-datetime-input", DatetimeInput);
