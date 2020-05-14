import {createPopper, Instance as PopperInstance, Placement} from "@popperjs/core";

import {findOrFail} from "../dom-utils";
import {Input} from "./input";
import textStyle from "./text.css";
import dateStyle from "./date-picker.css";
import textTemplate from "./text.html";
import dateTemplate from "./date-picker.html";
import iconError from "./icon-error.html";

import iconPrev from "../icons/chevron-left.svg";
import iconPrevAlt from "../icons/chevron-left-alt.svg";
import iconNext from "../icons/chevron-right.svg";
import iconNextAlt from "../icons/chevron-right-alt.svg";

export type DatePickerView = "daily" | "monthly";
export type DatePickerEvent = CustomEvent<{date: Date}>;

export class DatePicker extends Input {
  private _popperPlacement: Placement;
  private _popperInstance?: PopperInstance;
  private _picker: HTMLDivElement;
  private _currView: DatePickerView = "daily";
  private _currDate: Date;
  private _activeDate: Date;

  constructor() {
    super(textStyle + dateStyle, textTemplate + dateTemplate + iconError);
    this._picker = findOrFail(this.shadowRoot, HTMLDivElement, "picker");
    this._popperPlacement = parsePlacement(this._picker.getAttribute("placement"));
    this._currDate = new Date();
    this._activeDate = this._currDate;
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
    if (!(evt.target instanceof Element)) return;

    switch (this._currView) {
      case "daily": {
        if (findOrFail(this.shadowRoot, HTMLButtonElement, "curr-month").contains(evt.target)) {
          evt.preventDefault();
          return this._showMonthlyView();
        }

        if (findOrFail(this.shadowRoot, HTMLButtonElement, "curr-year").contains(evt.target)) {
          evt.preventDefault();
          return this._showMonthlyView();
        }

        if (findOrFail(this.shadowRoot, HTMLButtonElement, "prev-month").contains(evt.target)) {
          evt.preventDefault();
          return this._updateDailyView(this._currDate.getFullYear(), this._currDate.getMonth() - 1);
        }

        if (findOrFail(this.shadowRoot, HTMLButtonElement, "prev-year").contains(evt.target)) {
          evt.preventDefault();
          return this._updateDailyView(this._currDate.getFullYear() - 1, this._currDate.getMonth());
        }

        if (findOrFail(this.shadowRoot, HTMLButtonElement, "next-month").contains(evt.target)) {
          evt.preventDefault();
          return this._updateDailyView(this._currDate.getFullYear(), this._currDate.getMonth() + 1);
        }

        if (findOrFail(this.shadowRoot, HTMLButtonElement, "next-year").contains(evt.target)) {
          evt.preventDefault();
          return this._updateDailyView(this._currDate.getFullYear() + 1, this._currDate.getMonth());
        }

        if (evt.target.classList.contains("day")) {
          evt.preventDefault();
          const year = this._currDate.getFullYear();
          const month = this._currDate.getMonth();
          const day = Number(evt.target.getAttribute("data-day"));
          this._activeDate = new Date(year, month, day);
          this._input.value = this._activeDate.toLocaleDateString();
          this.dispatchEvent(new CustomEvent("change", {detail: {date: this._activeDate}}));
          this._updateDailyView(year, month, day);
        }

        break;
      }

      case "monthly":
        if (findOrFail(this.shadowRoot, HTMLButtonElement, "prev-year").contains(evt.target)) {
          evt.preventDefault();
          return this._updateMonthlyView(this._currDate.getFullYear() - 1);
        }

        if (findOrFail(this.shadowRoot, HTMLButtonElement, "next-year").contains(evt.target)) {
          evt.preventDefault();
          return this._updateMonthlyView(this._currDate.getFullYear() + 1);
        }

        if (findOrFail(this.shadowRoot, HTMLButtonElement, "prev-decade").contains(evt.target)) {
          evt.preventDefault();
          const currYear = this._currDate.getFullYear();
          const closestDecade = currYear - Math.trunc(currYear / 10) * 10;
          const nextYear = currYear - closestDecade - (closestDecade === 0 ? 10 : 0);
          return this._updateMonthlyView(nextYear);
        }

        if (findOrFail(this.shadowRoot, HTMLButtonElement, "next-decade").contains(evt.target)) {
          evt.preventDefault();
          const currYear = this._currDate.getFullYear();
          const closestDecade = Math.trunc(currYear / 10) * 10 - currYear + 10;
          const nextYear = currYear + closestDecade + (closestDecade === 0 ? 10 : 0);
          return this._updateMonthlyView(nextYear);
        }

        if (evt.target.classList.contains("month")) {
          evt.preventDefault();
          const year = this._currDate.getFullYear();
          const month = Number(evt.target.getAttribute("data-month"));
          this._currDate = new Date(year, month);
          this._showDailyView();
        }
    }
  };

  private _renderCurrMonth = () => {
    return new Intl.DateTimeFormat("fr-FR", {month: "short"}).format(this._currDate);
  };

  private _renderCurrYear = () => {
    return this._currDate.getFullYear().toString();
  };

  private _showDailyView = () => {
    this._currView = "daily";
    this._picker.innerHTML = `
      <div id="daily-view-header" class="header">
        ${this._renderDailyViewHeader()}
      </div>
      <div id="daily-view-content" class="content">
        ${this._renderDailyViewContent()}
      </div>
    `;
  };

  private _updateDailyView = (...params: [number, number, number?]) => {
    const [year, month, day = this._currDate.getDate()] = params;
    this._currDate = new Date(year, month, day);
    const currYear = findOrFail(this.shadowRoot, HTMLButtonElement, "curr-year");
    const currMonth = findOrFail(this.shadowRoot, HTMLButtonElement, "curr-month");
    const dailyViewContent = findOrFail(this.shadowRoot, HTMLDivElement, "daily-view-content");
    currYear.innerHTML = this._renderCurrYear();
    currMonth.innerHTML = this._renderCurrMonth();
    dailyViewContent.innerHTML = this._renderDailyViewContent();
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
    const currYear = this._currDate.getFullYear();
    const currMonth = this._currDate.getMonth();
    const daysInMonth = 32 - new Date(currYear, currMonth, 32).getDate();
    const firstDayOfWeek = new Date(currYear, currMonth, 1).getDay();
    const daysOfWeek = getDaysOfWeek().reduce(
      (html, day) => html + `<span class="weekday">${day}</span>`,
      "",
    );

    const emptyDays = [...Array(firstDayOfWeek)].reduce(html => html + `<span></span>`, daysOfWeek);

    return [...Array(daysInMonth)].reduce((html, _, idx) => {
      const day = idx + 1;
      const currDate = new Date(this._currDate.getFullYear(), this._currDate.getMonth(), day);
      const classes = ["date", "day"];
      matchByDay(currDate, now) && classes.push("today");
      matchByDay(currDate, this._activeDate) && classes.push("active");
      const className = classes.join(" ");
      const button = `
        <button class="${className}" data-day="${day}">
          <span>${day}</span>
        </button>
      `;

      return html + button;
    }, emptyDays);
  };

  private _showMonthlyView = () => {
    this._currView = "monthly";
    this._picker.innerHTML = `
      <div id="monthly-view-header" class="header">
        ${this._renderMonthlyViewHeader()}
      </div>
      <div id="monthly-view-content" class="content">
        ${this._renderMonthlyViewContent()}
      </div>
    `;
  };

  private _updateMonthlyView = (year: number) => {
    this._currDate = new Date(year, this._currDate.getMonth());
    const currYear = findOrFail(this.shadowRoot, HTMLSpanElement, "curr-year");
    const monthlyViewContent = findOrFail(this.shadowRoot, HTMLDivElement, "monthly-view-content");
    currYear.innerHTML = this._renderCurrYear();
    monthlyViewContent.innerHTML = this._renderMonthlyViewContent();
  };

  private _renderMonthlyViewHeader = () => {
    return `
      <button id="prev-decade">${iconPrevAlt}</button>
      <button id="prev-year">${iconPrev}</button>
      <span id="curr-year">${this._renderCurrYear()}</span>
      <button id="next-year">${iconNext}</button>
      <button id="next-decade">${iconNextAlt}</button>
    `;
  };

  private _renderMonthlyViewContent = () => {
    const now = new Date();
    return getMonths().reduce((html, label, month) => {
      const currDate = new Date(this._currDate.getFullYear(), month, this._currDate.getDate());
      const classes = ["date", "month"];
      matchByMonth(currDate, now) && classes.push("today");
      matchByMonth(currDate, this._activeDate) && classes.push("active");
      const className = classes.join(" ");
      const button = `
        <button class="${className}" data-month="${month}">
          <span>${label}</span>
        </button>
      `;

      return html + button;
    }, "");
  };

  private _showPicker = () => {
    this._showDailyView();
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

function matchByYear(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear();
}

function matchByMonth(d1: Date, d2: Date) {
  return matchByYear(d1, d2) && d1.getMonth() === d2.getMonth();
}

function matchByDay(d1: Date, d2: Date) {
  return matchByYear(d1, d2) && matchByMonth(d1, d2) && d1.getDate() === d2.getDate();
}

customElements.define("cx-date-picker", DatePicker);
