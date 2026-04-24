const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MINI_WEEKDAY_NAMES = ["M", "T", "W", "T", "F", "S", "S"];

const today = new Date();
let displayMonth = today.getMonth();
let displayYear = today.getFullYear();
let currentView = "month";

let monthYearEl;
let currentDateEl;
let calendarDaysEl;
let calendarGridEl;
let yearGridEl;
let monthsContainerEl;
let calendarContainerEl;
let viewToggleBtnEl;

function getMondayFirstIndex(dayIndex) {
  return dayIndex === 0 ? 6 : dayIndex - 1;
}

function isToday(day, month, year) {
  return (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  );
}

function createDiv(className, textContent = "") {
  const element = document.createElement("div");
  element.className = className;
  if (textContent !== "") {
    element.textContent = textContent;
  }
  return element;
}

function renderCalendar() {
  if (currentView === "month") {
    renderMonthView();
  } else {
    renderYearView();
  }
}

function renderMonthView() {
  calendarGridEl.classList.remove("is-hidden");
  yearGridEl.classList.add("is-hidden");
  calendarContainerEl.classList.remove("year-view");

  monthYearEl.textContent = `${MONTH_NAMES[displayMonth]} ${displayYear}`;
  currentDateEl.textContent = `Today: ${DAY_NAMES[today.getDay()]}, ${MONTH_NAMES[today.getMonth()]} ${today.getDate()}`;

  const daysFragment = document.createDocumentFragment();
  const firstDay = getMondayFirstIndex(new Date(displayYear, displayMonth, 1).getDay());
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(displayYear, displayMonth, 0).getDate();

  for (let i = firstDay - 1; i >= 0; i--) {
    daysFragment.appendChild(createDiv("day other-month", String(daysInPrevMonth - i)));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = createDiv("day", String(day));

    if (isToday(day, displayMonth, displayYear)) {
      dayDiv.classList.add("today");
    }

    daysFragment.appendChild(dayDiv);
  }

  const totalCells = firstDay + daysInMonth;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  for (let i = 1; i <= remainingCells; i++) {
    daysFragment.appendChild(createDiv("day other-month", String(i)));
  }

  calendarDaysEl.replaceChildren(daysFragment);
}

function renderYearView() {
  calendarGridEl.classList.add("is-hidden");
  yearGridEl.classList.remove("is-hidden");
  calendarContainerEl.classList.add("year-view");

  monthYearEl.textContent = String(displayYear);
  currentDateEl.textContent = `Year View: ${displayYear}`;
  const monthsFragment = document.createDocumentFragment();

  for (let month = 0; month < 12; month++) {
    const monthCard = createDiv("month-card");

    if (month === today.getMonth() && displayYear === today.getFullYear()) {
      monthCard.classList.add("current-month");
    }

    monthCard.addEventListener("click", () => {
      displayMonth = month;
      currentView = "month";
      updateViewToggleButton();
      renderCalendar();
    });

    const monthName = createDiv("month-name", MONTH_NAMES[month]);

    const weekdaysRow = createDiv("month-weekdays");
    MINI_WEEKDAY_NAMES.forEach((day) => {
      const weekdayDiv = createDiv("month-weekday", day);
      weekdaysRow.appendChild(weekdayDiv);
    });

    const monthPreview = createDiv("month-preview");

    const firstDay = getMondayFirstIndex(new Date(displayYear, month, 1).getDay());
    const daysInMonth = new Date(displayYear, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      monthPreview.appendChild(createDiv("month-preview-day"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDiv = createDiv("month-preview-day", String(day));

      if (isToday(day, month, displayYear)) {
        dayDiv.classList.add("today");
      }

      monthPreview.appendChild(dayDiv);
    }

    monthCard.appendChild(monthName);
    monthCard.appendChild(weekdaysRow);
    monthCard.appendChild(monthPreview);
    monthsFragment.appendChild(monthCard);
  }

  monthsContainerEl.replaceChildren(monthsFragment);
}

function changeMonth(direction) {
  if (currentView === "month") {
    displayMonth += direction;

    if (displayMonth > 11) {
      displayMonth = 0;
      displayYear++;
    } else if (displayMonth < 0) {
      displayMonth = 11;
      displayYear--;
    }
  } else {
    displayYear += direction;
  }

  renderCalendar();
}

function goToToday() {
  const today = new Date();
  displayMonth = today.getMonth();
  displayYear = today.getFullYear();
  currentView = "month";
  updateViewToggleButton();
  renderCalendar();
}

function toggleView() {
  currentView = currentView === "month" ? "year" : "month";
  updateViewToggleButton();
  renderCalendar();
}

function updateViewToggleButton() {
  viewToggleBtnEl.textContent = currentView === "month" ? "Year" : "Month";
}

document.addEventListener("DOMContentLoaded", () => {
  monthYearEl = document.getElementById("monthYear");
  currentDateEl = document.getElementById("currentDate");
  calendarDaysEl = document.getElementById("calendarDays");
  calendarGridEl = document.querySelector(".calendar-grid");
  yearGridEl = document.getElementById("yearGrid");
  monthsContainerEl = document.getElementById("monthsContainer");
  calendarContainerEl = document.querySelector(".calendar-container");
  viewToggleBtnEl = document.getElementById("viewToggleBtn");

  document.getElementById("prevBtn").addEventListener("click", () => changeMonth(-1));
  document.getElementById("nextBtn").addEventListener("click", () => changeMonth(1));
  document.getElementById("todayBtn").addEventListener("click", goToToday);
  viewToggleBtnEl.addEventListener("click", toggleView);

  updateViewToggleButton();
  renderCalendar();
});
