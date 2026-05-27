const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
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

// Modal elements
let noteModalEl;
let modalDateTitleEl;
let noteTextEl;
let saveNoteBtnEl;
let closeModalBtnEl;
let currentEditingDateStr = "";

// State
let notesData = {};

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

function withViewTransition(callback) {
  if (!document.startViewTransition) {
    callback();
    return;
  }
  document.startViewTransition(() => {
    callback();
  });
}

function renderCalendar() {
  withViewTransition(() => {
    if (currentView === "month") {
      renderMonthView();
    } else {
      renderYearView();
    }
  });
  saveViewState();
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

    const currentDateRendered = new Date(displayYear, displayMonth, day);
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isPast = currentDateRendered < todayDateOnly;

    if (isPast) {
      dayDiv.classList.add("past-day");
    }

    const dateStr = `${displayYear}-${displayMonth}-${day}`;
    if (notesData[dateStr] && notesData[dateStr].trim() !== "") {
      dayDiv.appendChild(createDiv("note-indicator"));
    }

    if (!isPast) {
      dayDiv.addEventListener("click", () => openNoteModal(day, displayMonth, displayYear));
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

// Storage Functions
async function saveViewState() {
  if (chrome && chrome.storage) {
    await chrome.storage.local.set({
      lastView: {
        month: displayMonth,
        year: displayYear,
        view: currentView
      }
    });
  }
}

async function loadDataAndInit() {
  if (chrome && chrome.storage) {
    const data = await chrome.storage.local.get(["lastView", "notes"]);
    if (data.lastView) {
      displayMonth = data.lastView.month;
      displayYear = data.lastView.year;
      currentView = data.lastView.view;
    }
    if (data.notes) {
      notesData = data.notes;
    }
  }
  updateViewToggleButton();
  // Call inner functions directly on first load without view transition animation
  if (currentView === "month") {
    renderMonthView();
  } else {
    renderYearView();
  }
}

// Modal Functions
function openNoteModal(day, month, year) {
  currentEditingDateStr = `${year}-${month}-${day}`;
  modalDateTitleEl.textContent = `${MONTH_NAMES[month]} ${day}, ${year}`;
  noteTextEl.value = notesData[currentEditingDateStr] || "";
  noteModalEl.classList.add("active");
  noteTextEl.focus();
}

function closeNoteModal() {
  noteModalEl.classList.remove("active");
  currentEditingDateStr = "";
}

async function saveNote() {
  if (!currentEditingDateStr) return;
  const noteContent = noteTextEl.value.trim();
  
  if (noteContent) {
    notesData[currentEditingDateStr] = noteContent;
  } else {
    delete notesData[currentEditingDateStr];
  }
  
  if (chrome && chrome.storage) {
    await chrome.storage.local.set({ notes: notesData });
  }
  
  closeNoteModal();
  renderCalendar(); // Re-render to show/hide note indicator
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

  // Modal elements
  noteModalEl = document.getElementById("noteModal");
  modalDateTitleEl = document.getElementById("modalDateTitle");
  noteTextEl = document.getElementById("noteText");
  saveNoteBtnEl = document.getElementById("saveNoteBtn");
  closeModalBtnEl = document.getElementById("closeModalBtn");

  document.getElementById("prevBtn").addEventListener("click", () => changeMonth(-1));
  document.getElementById("nextBtn").addEventListener("click", () => changeMonth(1));
  document.getElementById("todayBtn").addEventListener("click", goToToday);
  viewToggleBtnEl.addEventListener("click", toggleView);

  closeModalBtnEl.addEventListener("click", closeNoteModal);
  saveNoteBtnEl.addEventListener("click", saveNote);
  
  noteModalEl.addEventListener("click", (e) => {
    if (e.target === noteModalEl) {
      closeNoteModal();
    }
  });

  loadDataAndInit();
});
