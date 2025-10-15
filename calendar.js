let currentDate = new Date();
let displayMonth = currentDate.getMonth();
let displayYear = currentDate.getFullYear();

function renderCalendar() {
    const monthYear = document.getElementById('monthYear');
    const currentDateEl = document.getElementById('currentDate');
    const daysContainer = document.getElementById('calendarDays');

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    monthYear.textContent = `${months[displayMonth]} ${displayYear}`;

    const today = new Date();
    currentDateEl.textContent = `Today: ${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}`;

    daysContainer.innerHTML = '';

    const firstDay = new Date(displayYear, displayMonth, 1).getDay();
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

function changeMonth(direction) {
    displayMonth += direction;

    if (displayMonth > 11) {
        displayMonth = 0;
        displayYear++;
    } else if (displayMonth < 0) {
        displayMonth = 11;
        displayYear--;
    }

    renderCalendar();
}

function goToToday() {
    const today = new Date();
    displayMonth = today.getMonth();
    displayYear = today.getFullYear();
    renderCalendar();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('prevBtn').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextBtn').addEventListener('click', () => changeMonth(1));
    document.getElementById('todayBtn').addEventListener('click', goToToday);

    renderCalendar();
});