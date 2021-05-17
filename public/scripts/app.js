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
  , { "id": "1816239382239", "name": "Ma", "icon": "18162833434328302" }
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
        , {
            "start": "2021-04-02T12:28-07:00"
          , "end"  : "2021-04-02T16:19-07:00"
          }
        , {
            "start": "2021-04-02T12:28-07:00"
        ,   "end"  : "2021-04-02T16:19-07:00"
        }
      ],
      "1816239382239": [
        {
          "start": "2021-05-28T16:23-07:00" // can pass this directly into `new Date(...)`
        , "end"  : "2021-05-28T19:14-07:00"
        }
        , {
          "start": "2021-05-03T12:28-07:00"
        , "end"  : "2021-05-03T16:19-07:00"
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
// let activeCalendars = ["18162393822390029", "18162393822390031", "18162393822390030", "18162393822390032"];
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
    const previousMonth = dayjs(`${year}-${month.length == 1 ? `0${month}` : month}-01`).subtract(1, "month");

    // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
    // const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday ?
    //     firstDayOfTheMonthWeekday - 1 : 6;
        const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday;

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
        `${year}-${month.length == 1 ? `0${month}` : month}-${currentMonthDays.length}`
    );
    console.log(lastDayOfTheMonthWeekday);
    const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");

    const visibleNumberOfDaysFromNextMonth = 6 - lastDayOfTheMonthWeekday;
    console.log(visibleNumberOfDaysFromNextMonth);
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
        showMonthEvents(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    });

    document.getElementById("present-month-selector").addEventListener("click", () => {
        selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));
        createMonthCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
        showMonthEvents(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    });

    document.getElementById("next-month-selector").addEventListener("click", () => {
        selectedMonth = dayjs(selectedMonth).add(1, "month");
        createMonthCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
        showMonthEvents(selectedMonth.format("YYYY"), selectedMonth.format("M"));
    });
}

const addMonthEvent = (userId, event) => {
    const date = new Date(event.start).toISOString().split("T")[0];
    const eventContainer = document.getElementById(date).getElementsByClassName("eventsList")[0];
    eventContainer.dataset.count = (parseInt(eventContainer.dataset.count) + 1) +"";
    const countDiv = document.getElementById(date).getElementsByClassName("event-count")[0];
    

    if(document.getElementById(userId)) document.getElementById(userId).parentNode.classList.add("color-"+activeCalendars.indexOf(userId));
    
    if(eventContainer.childElementCount >= 2) {
        countDiv.classList.remove("hidden");
        countDiv.innerHTML = `+${parseInt(eventContainer.dataset.count) - 2}`;
    }
    else {
        countDiv.classList.add("hidden");

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
    //remove all elements first
    document.querySelectorAll(".month-event").forEach(item => {
        item.remove();
    });
    //reset child count
    document.querySelectorAll(".eventsList").forEach(item => {
        item.dataset.count = 0;
    });
    //remove color from friend item
    document.querySelectorAll(".friend-item").forEach(friendItem => {
        friendItem.className = "friend-item";
    });
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


const showWeekView = () => {
    document.getElementById("calendarView").innerHTML = `
    <div></div>
    `;
}



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
    console.log(`${date}`, new Date(`${date}T18:00:00+00:00`) );
    return new Date(`${date}T18:00:00+00:00`).getUTCDay();
    // return new Date(date).getDay();
}

const populateFriendsList = () => {

    friendsList.forEach(friend => {
        const friendItem = document.createElement("div");
        friendItem.classList.add("friend-item");

        const checkbox = document.createElement("input");
        checkbox.id = friend.id;
        checkbox.setAttribute("type", "checkbox");
        checkbox.addEventListener("change", () => {
            toggleActiveCalendar(checkbox.id);
        });
        friendItem.appendChild(checkbox);

        const label = document.createElement("label");
        label.innerHTML = friend.name;
        label.setAttribute("for", friend.id);
        friendItem.appendChild(label);

        document.getElementById("friendCalendarList").appendChild(friendItem);
    });
}

const toggleActiveCalendar = id => {
    let calendarIsActive = false;
    activeCalendars.forEach(calendarId => {
        if(calendarId == id) {
            calendarIsActive = true;
        }
    });
    if(calendarIsActive) {
        activeCalendars.splice(activeCalendars.indexOf(id), 1);
    }
    else {
        activeCalendars.push(id);
        if(activeCalendars.length > 4) {
            for(let i = 4; i < activeCalendars.length; i++) {
                document.getElementById(activeCalendars[0]).checked = false;
                activeCalendars.shift();
            }
        }

    }
    showMonthEvents(selectedMonth.format("YYYY"), selectedMonth.format("M"));
}


console.log(`${apiUrl}${apiVersion}/friends/current`);
fetch(`${apiUrl}${apiVersion}/friends/current`, {
    method: "GET", 
    mode: "cors",
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: credentials 
})
// fetch(`${apiUrl}${apiVersion}/friends/current`)
.then(response => {
    console.log(response);
    return response.json();
})
.then(data => {
    friendsList = data;
    populateFriendsList();
});



showMonthView();

document.getElementById("calendarViewModeSelect").addEventListener("change", event => {
    if(event.target.value == "week") showWeekView();
    else showMonthView(); 
});

document.getElementById("profileCard").addEventListener("click", () => {
    window.location = "account/settings";
});

document.getElementById("friendsPageBtn").addEventListener("click", () => {
    window.location = "friends";
});

document.getElementById("toggleMenuBtn").addEventListener("click", () => {
    document.getElementById("leftMenu").classList.toggle("expanded");
});