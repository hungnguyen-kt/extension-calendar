let currentDate = new Date();
let displayMonth = currentDate.getMonth();
let displayYear = currentDate.getFullYear();
let currentView = 'month'; // 'month' or 'year'

function renderCalendar() {
    if (currentView === 'month') {
        renderMonthView();
    } else {
        renderYearView();
    }
}

function renderMonthView() {
    const monthYear = document.getElementById('monthYear');
    const currentDateEl = document.getElementById('currentDate');
    const daysContainer = document.getElementById('calendarDays');
    const calendarGrid = document.querySelector('.calendar-grid');
    const yearGrid = document.getElementById('yearGrid');
    const calendarContainer = document.querySelector('.calendar-container');

    // Show month view, hide year view
    calendarGrid.style.display = 'block';
    yearGrid.style.display = 'none';
    calendarContainer.classList.remove('year-view');

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    monthYear.textContent = `${months[displayMonth]} ${displayYear}`;

    const today = new Date();
    currentDateEl.textContent = `Today: ${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}`;

    daysContainer.innerHTML = '';

    const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();
    // Adjust for Monday start (0=Sunday, 1=Monday, etc.)
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(displayYear, displayMonth, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day other-month';
        dayDiv.textContent = daysInPrevMonth - i;
        daysContainer.appendChild(dayDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = day;

        if (day === today.getDate() &&
            displayMonth === today.getMonth() &&
            displayYear === today.getFullYear()) {
            dayDiv.classList.add('today');
        }

        daysContainer.appendChild(dayDiv);
    }

    const totalCells = firstDay + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

    for (let i = 1; i <= remainingCells; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day other-month';
        dayDiv.textContent = i;
        daysContainer.appendChild(dayDiv);
    }
}

function renderYearView() {
    const monthYear = document.getElementById('monthYear');
    const currentDateEl = document.getElementById('currentDate');
    const monthsContainer = document.getElementById('monthsContainer');
    const calendarGrid = document.querySelector('.calendar-grid');
    const yearGrid = document.getElementById('yearGrid');
    const calendarContainer = document.querySelector('.calendar-container');

    // Show year view, hide month view
    calendarGrid.style.display = 'none';
    yearGrid.style.display = 'block';
    calendarContainer.classList.add('year-view');

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];

    monthYear.textContent = displayYear;
    currentDateEl.textContent = `Year View: ${displayYear}`;

    monthsContainer.innerHTML = '';

    const today = new Date();

    for (let month = 0; month < 12; month++) {
        const monthCard = document.createElement('div');
        monthCard.className = 'month-card';

        if (month === today.getMonth() && displayYear === today.getFullYear()) {
            monthCard.classList.add('current-month');
        }

        monthCard.addEventListener('click', () => {
            displayMonth = month;
            currentView = 'month';
            updateViewToggleButton();
            renderCalendar();
        });

        const monthName = document.createElement('div');
        monthName.className = 'month-name';
        monthName.textContent = months[month];

        const monthPreview = document.createElement('div');
        monthPreview.className = 'month-preview';

        // Create mini calendar preview
        const firstDayOfMonth = new Date(displayYear, month, 1).getDay();
        const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        const daysInMonth = new Date(displayYear, month + 1, 0).getDate();

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'month-preview-day';
            monthPreview.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'month-preview-day';
            dayDiv.textContent = day;

            if (day === today.getDate() && month === today.getMonth() && displayYear === today.getFullYear()) {
                dayDiv.classList.add('today');
            }

            monthPreview.appendChild(dayDiv);
        }

        monthCard.appendChild(monthName);
        monthCard.appendChild(monthPreview);
        monthsContainer.appendChild(monthCard);
    }
}

function changeMonth(direction) {
    if (currentView === 'month') {
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
    currentView = 'month';
    updateViewToggleButton();
    renderCalendar();
}

function toggleView() {
    currentView = currentView === 'month' ? 'year' : 'month';
    updateViewToggleButton();
    renderCalendar();
}

function updateViewToggleButton() {
    const viewToggleBtn = document.getElementById('viewToggleBtn');
    viewToggleBtn.textContent = currentView === 'month' ? 'Year' : 'Month';
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('prevBtn').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextBtn').addEventListener('click', () => changeMonth(1));
    document.getElementById('todayBtn').addEventListener('click', goToToday);
    document.getElementById('viewToggleBtn').addEventListener('click', toggleView);

    updateViewToggleButton();
    renderCalendar();
});