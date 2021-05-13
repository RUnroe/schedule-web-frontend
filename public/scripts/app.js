const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY = dayjs().format("YYYY-MM-DD");

const INITIAL_YEAR = dayjs().format("YYYY");
const INITIAL_MONTH = dayjs().format("M");


let friendsList = [];
//array of user ids
let activeCalendars = [];

/* #region   */

let selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));
let currentMonthDays;
let previousMonthDays;
let nextMonthDays;

const showMonthView = () => {
    document.getElementById("calendarView").innerHTML = `
    <div class="calendar-month">
    <section class="calendar-month-header">
        <div
        id="selected-month"
        class="calendar-month-header-selected-month"
        ></div>
        <section class="calendar-month-header-selectors">
        <span id="previous-month-selector"><</span>
        <span id="present-month-selector">Today</span>
        <span id="next-month-selector">></span>
        </section>
    </section>

    <ol
        id="days-of-week"
        class="day-of-week"
    /></ol>

    <ol
        id="calendar-days"
        class="days-grid"
    >
    </ol>
    </div>
    `;
    WEEKDAYS.forEach((weekday) => {
        const weekDayElement = document.createElement("li");
        document.getElementById("days-of-week").appendChild(weekDayElement);
        weekDayElement.innerText = weekday;
    });

    createMonthCalendar();
    initMonthSelectors();


    addMonthEvent(1, {
        "start": "2021-05-28T16:23-07:00" // can pass this directly into `new Date(...)`
      , "end"  : "2021-05-28T19:14-07:00"
      });
};




const createMonthCalendar = (year = INITIAL_YEAR, month = INITIAL_MONTH) => {
    const calendarDaysElement = document.getElementById("calendar-days");

    document.getElementById("selected-month").innerText = dayjs(
        new Date(year, month - 1)
    ).format("MMMM YYYY");

    removeAllDayElements(calendarDaysElement);

    currentMonthDays = createDaysForCurrentMonth(
        year,
        month,
        dayjs(`${year}-${month}-01`).daysInMonth()
    );

    previousMonthDays = createDaysForPreviousMonth(year, month);

    nextMonthDays = createDaysForNextMonth(year, month);

    const days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

    days.forEach((day) => {
        appendDay(day, calendarDaysElement);
    });
}

const appendDay = (day, calendarDaysElement) => {
    const dayElement = document.createElement("li");
    dayElement.id = day.date;
    const dayElementClassList = dayElement.classList;
    dayElementClassList.add("calendar-day");

    const dayOfMonthElement = document.createElement("span");
    dayOfMonthElement.innerText = day.dayOfMonth;
    dayElement.appendChild(dayOfMonthElement);

    const eventsList = document.createElement("div");
    eventsList.classList.add("eventsList");
    dayElement.appendChild(eventsList);

    calendarDaysElement.appendChild(dayElement);

    if (!day.isCurrentMonth) {
        dayElementClassList.add("calendar-day--not-current");
    }

    if (day.date === TODAY) {
        dayElementClassList.add("calendar-day--today");
    }
}

const removeAllDayElements = (calendarDaysElement) => {
    let first = calendarDaysElement.firstElementChild;

    while (first) {
        first.remove();
        first = calendarDaysElement.firstElementChild;
    }
}

const getNumberOfDaysInMonth = (year, month) => {
    return dayjs(`${year}-${month}-01`).daysInMonth();
}

const createDaysForCurrentMonth = (year, month) => {
    return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
        return {
            date: dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
            dayOfMonth: index + 1,
            isCurrentMonth: true
        };
    });
}

const createDaysForPreviousMonth = (year, month) => {
    const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].date);

    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");

    // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
    const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday ?
        firstDayOfTheMonthWeekday - 1 : 6;

    const previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].date)
        .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
        .date();

    return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
        return {
            date: dayjs(
                `${previousMonth.year()}-${previousMonth.month() + 1}-${
          previousMonthLastMondayDayOfMonth + index
        }`
            ).format("YYYY-MM-DD"),
            dayOfMonth: previousMonthLastMondayDayOfMonth + index,
            isCurrentMonth: false
        };
    });
}

const createDaysForNextMonth = (year, month) => {
    const lastDayOfTheMonthWeekday = getWeekday(
        `${year}-${month}-${currentMonthDays.length}`
    );

    const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");

    const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday ?
        8 - lastDayOfTheMonthWeekday :
        lastDayOfTheMonthWeekday;

    return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
        return {
            date: dayjs(
                `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
            ).format("YYYY-MM-DD"),
            dayOfMonth: index + 1,
            isCurrentMonth: false
        };
    });
}



const initMonthSelectors = () => {
    document.getElementById("previous-month-selector").addEventListener("click", () => {
        selectedMonth = dayjs(selectedMonth).subtract(1, "month");
        createMonthCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    });

    document.getElementById("present-month-selector").addEventListener("click", () => {
        selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));
        createMonthCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    });

    document.getElementById("next-month-selector").addEventListener("click", () => {
        selectedMonth = dayjs(selectedMonth).add(1, "month");
        createMonthCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    });
}

const addMonthEvent = (userId, event) => {
    const eventDiv = document.createElement("div");
    eventDiv.dataset.owner = userId;
    eventDiv.dataset.time = Date.parse(event.start);
    eventDiv.classList.add("month-event");
    eventDiv.classList.add(activeCalendars.indexOf(userId));
    eventDiv.innerHTML = `${formatTime(event.start)} - <em>${getName(userId)}</em>`;

    const date = new Date(event.start).toISOString().split("T")[0];
    if(document.getElementById(date)) {
        let eventContainer = document.getElementById(date).getElementsByClassName("eventsList")[0];
        eventContainer.append(eventDiv);
    }
}
/* #endregion */

const formatTime = time => {
    let startTime = new Date(time).toLocaleTimeString("en-US");
    let startTimeArr = startTime.split(":");
    let ampm = startTimeArr[2].split(" ");
    return `${startTimeArr[0]}:${startTimeArr[1]} ${ampm[1]}`;
}

const getName = id => {
    if(friendsList[id]) return friendsList[id].name;
    return "Cannot find friend";
}

const getWeekday = date => {
    return new Date(date).getDay();
}

showMonthView();


document.getElementById("profileCard").addEventListener("click", () => {
    window.location = "account/settings";
});


document.getElementById("friendsPageBtn").addEventListener("click", () => {
    window.location = "friends";
});