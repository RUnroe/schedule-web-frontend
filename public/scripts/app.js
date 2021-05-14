const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY = dayjs().format("YYYY-MM-DD");

const INITIAL_YEAR = dayjs().format("YYYY");
const INITIAL_MONTH = dayjs().format("M");

//get from backend
let currentUserId = "18162393822390028";

//List of friends : ids and names
let friendsList = [
      { "id": "18162393822390029", "name": "Joe Mama" , "icon": "18162838739488302" }
    , { "id": "18162393822390030", "name": "Joe Manga", "icon": "18162833478388302" }
    , { "id": "18162393822390031", "name": "Banjoe Ma", "icon": "18162833434328302" }
    , { "id": "18162393822390032", "name": "fu Ma", "icon": "18162833434328302" }
];

//Object of calendars. if calendar is not listed in here, fetch it
let allCalendars = {
    "18162393822390028": [
        {
          "start": "2021-05-28T16:23-07:00" // can pass this directly into `new Date(...)`
        , "end"  : "2021-05-28T19:14-07:00"
        }
        , {
          "start": "2021-05-02T12:28-07:00"
        , "end"  : "2021-05-02T16:19-07:00"
        }
      ],
    "18162393822390029": [
        {
          "start": "2021-05-28T16:23-07:00" // can pass this directly into `new Date(...)`
        , "end"  : "2021-05-28T19:14-07:00"
        }
        , {
          "start": "2021-05-03T12:28-07:00"
        , "end"  : "2021-05-03T16:19-07:00"
        }
      ],
    "18162393822390030": [
        {
          "start": "2021-05-29T16:23-07:00" // can pass this directly into `new Date(...)`
        , "end"  : "2021-05-29T19:14-07:00"
        }
        , {
          "start": "2021-05-04T12:28-07:00"
        , "end"  : "2021-05-04T16:19-07:00"
        }
      ],
    "18162393822390031": [
        {
          "start": "2021-05-26T16:23-07:00" // can pass this directly into `new Date(...)`
        , "end"  : "2021-05-26T19:14-07:00"
        }
        , {
          "start": "2021-05-02T12:28-07:00"
        , "end"  : "2021-05-02T16:19-07:00"
        }
      ],
      "18162393822390032": [
        {
          "start": "2021-05-26T16:23-07:00" // can pass this directly into `new Date(...)`
        , "end"  : "2021-05-26T19:14-07:00"
        }
        , {
          "start": "2021-05-02T14:28-07:00"
        , "end"  : "2021-05-02T16:19-07:00"
        }
      ],
};

//array of user ids
let activeCalendars = ["18162393822390029", "18162393822390031", "18162393822390030", "18162393822390032"];

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


    showMonthEvents(selectedMonth.format("YYYY"), selectedMonth.format("M"));
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

    const eventCount = document.createElement("div");
    eventCount.classList.add("event-count");
    eventCount.classList.add("hidden");
    eventCount.innerHTML = "+0";
    dayElement.appendChild(eventCount);

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
    // const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday ?
    //     firstDayOfTheMonthWeekday - 1 : 6;
        const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday != 6 ?
        firstDayOfTheMonthWeekday + 1 : 0;

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

    const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday != 6 ?
        6 - lastDayOfTheMonthWeekday :
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
    const date = new Date(event.start).toISOString().split("T")[0];
    const eventContainer = document.getElementById(date).getElementsByClassName("eventsList")[0];
    if(eventContainer.childElementCount >= 2) {
        const countDiv = document.getElementById(date).getElementsByClassName("event-count")[0];
        countDiv.classList.remove("hidden");
        countDiv.innerHTML = `+${parseInt(countDiv.innerHTML.split("+")[1]) +1}`;
    }
    else {
        const eventDiv = document.createElement("div");
        eventDiv.dataset.owner = userId;
        eventDiv.dataset.time = Date.parse(event.start);
        eventDiv.classList.add("month-event");
        eventDiv.classList.add("color-"+activeCalendars.indexOf(userId));
        eventDiv.innerHTML = `<b>${getName(userId)}</b>`;

        
        if(document.getElementById(date)) {
            eventContainer.append(eventDiv);
        }
    }
}

const showMonthEvents = (year, month) => {
    allCalendars[currentUserId].forEach(event => {
        let evtStartDate = new Date(event.start);
        if((evtStartDate.getMonth()+1) == month && evtStartDate.getFullYear() == year) {
            addMonthEvent(currentUserId, event);
        }
    });

    activeCalendars.forEach(id => {
        allCalendars[id].forEach(event => {
            let evtStartDate = new Date(event.start);
            if((evtStartDate.getMonth()+1) == month && evtStartDate.getFullYear() == year) {
                addMonthEvent(id, event);
            }
        });
    });
    
}
/* #endregion */

const formatTime = time => {
    let startTime = new Date(time).toLocaleTimeString("en-US");
    let startTimeArr = startTime.split(":");
    let ampm = startTimeArr[2].split(" ");
    return `${startTimeArr[0]}:${startTimeArr[1]} ${ampm[1]}`;
}

const getName = id => {
    let name = "You";
    friendsList.forEach(friend => {
        if(friend.id == id) name = friend.name;
    });
    return name;
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