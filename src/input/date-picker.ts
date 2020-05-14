import {createPopper, Instance as PopperInstance, Placement} from "@popperjs/core";

import {findOrFail} from "../dom-utils";
import {Input} from "./input";
import textStyle from "./text.css";
import dateStyle from "./date-picker.css";
import textTemplate from "./text.html";
import dateTemplate from "./date-picker.html";
import iconError from "./icon-error.html";

export type DatePickerView = "daily" | "monthly" | "yearly";
export type DatePickerEvent = CustomEvent<{date: Date}>;

function getClosestHalfCentury(date: Date | number) {
  const year = typeof date === "number" ? date : date.getFullYear();
  return Math.trunc(year / 50) * 50;
}

export class DatePicker extends Input {
  private _popperPlacement: Placement;
  private _popperInstance?: PopperInstance;
  private _picker: HTMLDivElement;
  private _currDay: HTMLButtonElement;
  private _currMonth: HTMLButtonElement;
  private _currYear: HTMLButtonElement;
  private _content: HTMLDivElement;
  private _currDate: Date;
  private _currHalfCentury: number;

  constructor() {
    super(textStyle + dateStyle, textTemplate + dateTemplate + iconError);
    this._picker = findOrFail(this.shadowRoot, HTMLDivElement, "picker");
    this._currDay = findOrFail(this.shadowRoot, HTMLButtonElement, "curr-day");
    this._currMonth = findOrFail(this.shadowRoot, HTMLButtonElement, "curr-month");
    this._currYear = findOrFail(this.shadowRoot, HTMLButtonElement, "curr-year");
    this._content = findOrFail(this.shadowRoot, HTMLDivElement, "content");
    this._popperPlacement = parsePlacement(this._picker.getAttribute("placement"));
    this._currDate = new Date();
    this._currHalfCentury = getClosestHalfCentury(this._currDate);
    this._input.readOnly = true;
  }

  connectedCallback() {
    this.addEventListener("focus", this._showPicker);
    this.addEventListener("blur", this._hidePicker);
    this._input.addEventListener("input", this._validate);
    this._currDay.addEventListener("mousedown", this._showDailyView);
    this._currDay.addEventListener("touchstart", this._showDailyView);
    this._currMonth.addEventListener("mousedown", this._showMonthlyView);
    this._currMonth.addEventListener("touchstart", this._showMonthlyView);
    this._currYear.addEventListener("mousedown", this._showYearlyView);
    this._currYear.addEventListener("touchstart", this._showYearlyView);
    this._content.addEventListener("mousedown", this._handleContentMouseDown);
    this._content.addEventListener("touchstart", this._handleContentMouseDown);
  }

  disconnectedCallback() {
    this.removeEventListener("focus", this._showPicker);
    this.removeEventListener("blur", this._hidePicker);
    this._input.removeEventListener("input", this._validate);
    this._currDay.removeEventListener("mousedown", this._showDailyView);
    this._currDay.removeEventListener("touchstart", this._showDailyView);
    this._currMonth.removeEventListener("mousedown", this._showMonthlyView);
    this._currMonth.removeEventListener("touchstart", this._showMonthlyView);
    this._currYear.removeEventListener("mousedown", this._showYearlyView);
    this._currYear.removeEventListener("touchstart", this._showYearlyView);
    this._content.removeEventListener("mousedown", this._handleContentMouseDown);
    this._content.removeEventListener("touchstart", this._handleContentMouseDown);
  }

  private _handleContentMouseDown = (evt: Event) => {
    if (evt.target instanceof HTMLElement) {
      if (evt.target.id === "prev-decade") {
        evt.preventDefault();
        this._currHalfCentury -= 50;
        return this._showYearlyView();
      }

      if (evt.target.id === "next-decade") {
        evt.preventDefault();
        this._currHalfCentury += 50;
        return this._showYearlyView();
      }

      if (evt.target.classList.contains("day")) {
        evt.preventDefault();
        const year = this._currDate.getFullYear();
        const month = this._currDate.getMonth();
        const day = Number(evt.target.getAttribute("data-day"));
        this._currDate = new Date(year, month, day);
        this._input.value = this._currDate.toLocaleDateString();
        this.dispatchEvent(new CustomEvent("change", {detail: {date: this._currDate}}));
        this._showDailyView();
      }

      if (evt.target.classList.contains("month")) {
        evt.preventDefault();
        const year = this._currDate.getFullYear();
        const month = Number(evt.target.getAttribute("data-month"));
        const day = this._currDate.getDate();
        this._currDate = new Date(year, month, day);
        this._showDailyView();
      }

      if (evt.target.classList.contains("year")) {
        evt.preventDefault();
        const year = Number(evt.target.getAttribute("data-year"));
        const month = this._currDate.getMonth();
        const day = this._currDate.getDate();
        this._currDate = new Date(year, month, day);
        this._showMonthlyView();
      }
    }
  };

  private _renderDailyView = () => {
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
      const classes = ["btn", "day"];
      matchByDay(currDate, now) && classes.push("today");
      matchByDay(currDate, this._currDate) && classes.push("active");
      const className = classes.join(" ");
      const button = `
        <button class="${className}" data-day="${day}">
          <span>${day}</span>
        </button>
      `;

      return html + button;
    }, emptyDays);
  };

  private _renderMonthlyView = () => {
    const now = new Date();
    return getMonths().reduce((html, monthStr, month) => {
      const currDate = new Date(this._currDate.getFullYear(), month, this._currDate.getDate());
      const classes = ["btn", "month"];
      matchByMonth(currDate, now) && classes.push("today");
      matchByMonth(currDate, this._currDate) && classes.push("active");
      const className = classes.join(" ");
      const button = `
        <button class="${className}" data-month="${month}">
          <span>${monthStr}</span>
        </button>
      `;

      return html + button;
    }, "");
  };

  private _renderYearlyView = () => {
    const now = new Date();
    const prevDecade = `<button id="prev-decade" class="btn"><span><span class="zoom">&larr;</span></span></button>`;
    const nextDecade = `<button id="next-decade" class="btn"><span><span class="zoom">&rarr;</span></span></button>`;

    return [...Array(51)].reduce((html, _, idx) => {
      const year = this._currHalfCentury + idx;
      const currDate = new Date(year, this._currDate.getMonth(), this._currDate.getDate());
      const classes = ["btn", "year"];
      matchByYear(currDate, now) && classes.push("today");
      matchByYear(currDate, this._currDate) && classes.push("active");
      const className = classes.join(" ");
      const button = `
        <button class="${className}" data-year="${year}">
          <span>${idx === 0 ? year : year.toString().slice(2)}</span>
        </button>
      `;

      return html + button;
    }, prevDecade + nextDecade);
  };

  private _renderCurrDay = () => {
    return this._currDate.getDate().toString();
  };

  private _renderCurrMonth = () => {
    return new Intl.DateTimeFormat("fr-FR", {month: "short"}).format(this._currDate);
  };

  private _renderCurrYear = () => {
    return this._currDate.getFullYear().toString();
  };

  private _showDailyView = () => {
    this._currDay.textContent = this._renderCurrDay();
    this._currMonth.textContent = this._renderCurrMonth();
    this._currYear.textContent = this._renderCurrYear();
    this._content.classList.remove("daily", "monthly", "yearly");
    this._content.classList.add("daily");
    this._content.innerHTML = this._renderDailyView();
  };

  private _showMonthlyView = () => {
    this._currDay.textContent = this._renderCurrDay();
    this._currMonth.textContent = this._renderCurrMonth();
    this._currYear.textContent = this._renderCurrYear();
    this._content.classList.remove("daily", "monthly", "yearly");
    this._content.classList.add("monthly");
    this._content.innerHTML = this._renderMonthlyView();
  };

  private _showYearlyView = () => {
    this._currDay.textContent = this._renderCurrDay();
    this._currMonth.textContent = this._renderCurrMonth();
    this._currYear.textContent = this._renderCurrYear();
    this._content.classList.remove("daily", "monthly", "yearly");
    this._content.classList.add("yearly");
    this._content.innerHTML = this._renderYearlyView();
  };

  private _showPicker = () => {
    this._currHalfCentury = getClosestHalfCentury(this._currDate);
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
