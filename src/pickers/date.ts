import {createPopper, Instance as PopperInstance, Placement} from "@popperjs/core";

import {findOrFail} from "../dom-utils";
import {parsePlacement} from "../dialogs";
import {TextField} from "../fields";

import textStyle from "../fields/text.css";
import prefixTpl from "../fields/text-prefix.html";
import textTpl from "../fields/text.html";
import clearTpl from "../fields/text-clear.html";
import suffixTpl from "../fields/text-suffix.html";
import tooltipTpl from "../fields/text-tooltip.html";
import dateStyle from "./date.css";
import dateTpl from "./date.html";

export type DatePickerView = "daily" | "monthly" | "yearly";
export type DatePickerEvent = CustomEvent<{date: Date}>;

const YEARS_CHUNK_SIZE = 30;

const style = textStyle + dateStyle;
const tpl = prefixTpl + textTpl + clearTpl + suffixTpl + tooltipTpl + dateTpl;

export class DatePicker extends TextField {
  private _popperPlacement: Placement;
  private _popperInstance?: PopperInstance;

  private _picker: HTMLDivElement;
  private _title: HTMLDivElement;
  private _dayBtn: HTMLButtonElement;
  private _monthBtn: HTMLButtonElement;
  private _yearBtn: HTMLButtonElement;
  private _content: HTMLDivElement;

  private _yearsCursor: number;
  private _year?: number;
  private _month?: number;
  private _day?: number;
  private _date?: Date;

  constructor() {
    super({style, tpl});
    this._picker = findOrFail(this.shadowRoot, HTMLDivElement, "picker");
    this._title = findOrFail(this.shadowRoot, HTMLDivElement, "title");
    this._dayBtn = findOrFail(this.shadowRoot, HTMLButtonElement, "curr-day");
    this._monthBtn = findOrFail(this.shadowRoot, HTMLButtonElement, "curr-month");
    this._yearBtn = findOrFail(this.shadowRoot, HTMLButtonElement, "curr-year");
    this._content = findOrFail(this.shadowRoot, HTMLDivElement, "content");
    this._popperPlacement = parsePlacement(this._picker.getAttribute("placement"));
    this._yearsCursor = getClosestYearsCursor(new Date());
    /* this._input.readOnly = true; */
  }

  connectedCallback() {
    this.addEventListener("focus", this._showPicker);
    this.addEventListener("blur", this._hidePicker);
    this.addEventListener("keydown", this._handleKeyDown);
    this._picker.addEventListener("mousedown", this._handleClick);
    this._picker.addEventListener("touchstart", this._handleClick);
    this._input.addEventListener("input", this.validate);
    this._content.addEventListener("wheel", this._handleWheel);
  }

  disconnectedCallback() {
    this.removeEventListener("focus", this._showPicker);
    this.removeEventListener("blur", this._hidePicker);
    this.removeEventListener("keydown", this._handleKeyDown);
    this._picker.removeEventListener("mousedown", this._handleClick);
    this._picker.removeEventListener("touchstart", this._handleClick);
    this._input.removeEventListener("input", this.validate);
    this._content.removeEventListener("wheel", this._handleWheel);
  }

  private _handleWheel = (evt: WheelEvent) => {
    if (this._content.classList.contains("yearly")) {
      evt.preventDefault();
      this._yearsCursor += YEARS_CHUNK_SIZE * (evt.deltaY > 0 ? -1 : 1);
      return this._showYearlyView();
    }
  };

  private _handleKeyDown = (evt: KeyboardEvent) => {
    if (this._content.classList.contains("yearly")) {
      if (["ArrowDown", "ArrowLeft"].includes(evt.key)) {
        evt.preventDefault();
        this._yearsCursor -= YEARS_CHUNK_SIZE;
        return this._showYearlyView();
      } else if (["ArrowUp", "ArrowRight"].includes(evt.key)) {
        evt.preventDefault();
        this._yearsCursor += YEARS_CHUNK_SIZE;
        return this._showYearlyView();
      }
    }
  };

  private _handleClick = (evt: MouseEvent | TouchEvent) => {
    evt.preventDefault();

    if (evt.target instanceof HTMLElement) {
      if (evt.target.id === "curr-day") {
        return this._showDailyView();
      }

      if (evt.target.id === "curr-month") {
        return this._showMonthlyView();
      }

      if (evt.target.id === "curr-year") {
        return this._showYearlyView();
      }

      if (evt.target.id === "prev-years") {
        this._yearsCursor -= YEARS_CHUNK_SIZE;
        return this._showYearlyView();
      }

      if (evt.target.id === "next-years") {
        this._yearsCursor += YEARS_CHUNK_SIZE;
        return this._showYearlyView();
      }

      if (evt.target.classList.contains("day")) {
        this._day = Number(evt.target.getAttribute("data-day"));
        if (this._year !== undefined && this._month !== undefined) {
          this._date = new Date(this._year, this._month, this._day);
          this._input.value = this._date.toLocaleDateString();
          this.dispatchEvent(new CustomEvent("change", {detail: {value: this._date}}));
          this._showDailyView();
          this.validate();
        }
      }

      if (evt.target.classList.contains("month")) {
        this._month = Number(evt.target.getAttribute("data-month"));
        this._showDailyView();
      }

      if (evt.target.classList.contains("year")) {
        this._year = Number(evt.target.getAttribute("data-year"));
        this._showMonthlyView();
      }
    }
  };

  private _renderDailyView = () => {
    const now = new Date();
    const year = this._year || now.getFullYear();
    const month = this._month || now.getMonth();
    const daysInMonth = 32 - new Date(year, month, 32).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysOfWeek = getDaysOfWeek().reduce(
      (html, day) => html + `<span class="weekday">${day}</span>`,
      "",
    );

    const emptyDays = [...Array(firstDayOfWeek)].reduce(html => html + `<span></span>`, daysOfWeek);
    return [...Array(daysInMonth)].reduce((html, _, idx) => {
      const day = idx + 1;
      const classes = ["btn", "day"];
      day === now.getDate() && classes.push("today");
      day === this._day && classes.push("active");
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
      const classes = ["btn", "month"];
      month === now.getMonth() && classes.push("today");
      month === this._month && classes.push("active");
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
    const prevDecade = `<button id="prev-years" class="btn"><span>&lt;&lt;</span></button>`;
    const nextDecade = `<button id="next-years" class="btn"><span>&gt;&gt;</span></button>`;

    return [...Array(YEARS_CHUNK_SIZE)].reduce((html, _, idx) => {
      const year = this._yearsCursor + idx;
      const classes = ["btn", "year"];
      year === now.getFullYear() && classes.push("today");
      year === this._year && classes.push("active");
      const className = classes.join(" ");
      const button = `
        <button class="${className}" data-year="${year}">
          <span>${year.toString()}</span>
        </button>
      `;

      return html + button;
    }, prevDecade + nextDecade);
  };

  private _renderCurrDay = () => {
    const intl = new Intl.NumberFormat("fr-FR", {minimumIntegerDigits: 2});
    return this._day === undefined ? "ˍˍ" : intl.format(this._day);
  };

  private _renderCurrMonth = () => {
    const intl = new Intl.DateTimeFormat("fr-FR", {month: "short"});
    return this._month === undefined ? "ˍˍ" : intl.format(new Date(0, this._month));
  };

  private _renderCurrYear = () => {
    return this._year === undefined ? "ˍˍˍˍ" : this._year.toString();
  };

  private _resetView = () => {
    this._dayBtn.classList.remove("active");
    this._dayBtn.textContent = this._renderCurrDay();
    this._monthBtn.classList.remove("active");
    this._monthBtn.textContent = this._renderCurrMonth();
    this._yearBtn.classList.remove("active");
    this._yearBtn.textContent = this._renderCurrYear();
    this._content.classList.remove("daily", "monthly", "yearly");
  };

  private _showDailyView = () => {
    this._resetView();
    this._title.textContent = this.getAttribute("title-day") || "Pick a day";
    this._dayBtn.classList.add("active");
    this._content.classList.add("daily");
    this._content.innerHTML = this._renderDailyView();
  };

  private _showMonthlyView = () => {
    this._resetView();
    this._title.textContent = this.getAttribute("title-month") || "Pick a month";
    this._monthBtn.classList.add("active");
    this._content.classList.add("monthly");
    this._content.innerHTML = this._renderMonthlyView();
  };

  private _showYearlyView = () => {
    this._resetView();
    this._title.textContent = this.getAttribute("title-year") || "Pick a year";
    this._yearBtn.classList.add("active");
    this._content.classList.add("yearly");
    this._content.innerHTML = this._renderYearlyView();
  };

  private _showPicker = () => {
    this._yearsCursor = getClosestYearsCursor(this._date || new Date());
    this._showYearlyView();
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

function getClosestYearsCursor(date: Date | number) {
  const year = typeof date === "number" ? date : date.getFullYear();
  return Math.trunc(year / YEARS_CHUNK_SIZE) * YEARS_CHUNK_SIZE;
}

function getDaysOfWeek(): string[] {
  const intl = new Intl.DateTimeFormat("fr-FR", {weekday: "narrow"});
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

customElements.define("cx-date-picker", DatePicker);
