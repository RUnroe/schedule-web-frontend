const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY = dayjs().format("YYYY-MM-DD");

const INITIAL_YEAR =  dayjs().format("YYYY");
const INITIAL_MONTH = dayjs().format("M");
const INITIAL_DAY =   dayjs().format("D");

let calendarViewMode = "month";

//get from backend
let currentUserId = "18162393822390028";

//List of friends : ids and names
let friendsList = [];

//Object of calendars. if calendar is not listed in here, fetch it
let allCalendars = {};

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


    showMonthEvents(selectedMonth.format("YYYY"), selectedMonth.format("M"));
};




const createMonthCalendar = (year = INITIAL_YEAR, month = INITIAL_MONTH) => {
    const calendarDaysElement = document.getElementById("calendar-days");

    document.getElementById("selected-month").innerHTML = dayjs(
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
        appendMonthDay(day, calendarDaysElement);
    });
}

const appendMonthDay = (day, calendarDaysElement) => {
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
    const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");

    const visibleNumberOfDaysFromNextMonth = 6 - lastDayOfTheMonthWeekday;
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
    eventContainer.dataset.count = (parseInt(eventContainer.dataset.count) + 1) + "";
    const countDiv = document.getElementById(date).getElementsByClassName("event-count")[0];

    if (eventContainer.childElementCount >= 2) {
        countDiv.classList.remove("hidden");
        countDiv.innerHTML = `+${parseInt(eventContainer.dataset.count) - 2}`;
    } else {
        countDiv.classList.add("hidden");

        const eventDiv = document.createElement("div");
        eventDiv.dataset.owner = userId;
        eventDiv.dataset.time = Date.parse(event.start);
        eventDiv.classList.add("month-event");
        eventDiv.classList.add("color-" + activeCalendars.indexOf(userId));

        eventDiv.innerHTML = `<b>${getName(userId)}</b>`;


        if (document.getElementById(date)) {
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
        if ((evtStartDate.getMonth() + 1) == month && evtStartDate.getFullYear() == year) {
            addMonthEvent(currentUserId, event);
        }
    });

    activeCalendars.forEach(id => {
        if(allCalendars[id]) {
            allCalendars[id].forEach(event => {
                let evtStartDate = new Date(event.start);
                if ((evtStartDate.getMonth() + 1) == month && evtStartDate.getFullYear() == year) {
                    addMonthEvent(id, event);
                }
            });
        }
        if (document.getElementById(id)) document.getElementById(id).parentNode.classList.add("color-" + activeCalendars.indexOf(id));
        
    });



}
/* #endregion */




/* #region   */

let currentDateObj = dayjs();
let initialWeekDays;
let currentWeekDays;


const showWeekView = () => {
    document.getElementById("calendarView").innerHTML = `
    <div class="calendar-week">
    <section class="calendar-week-header">
        <div
        id="selected-week"
        class="calendar-week-header-selected-week"
        ></div>
        <section class="calendar-week-header-selectors">
        <span id="previous-week-selector"><</span>
        <span id="present-week-selector">Today</span>
        <span id="next-week-selector">></span>
        </section>
    </section>

    <ol
        id="days-of-week"
        class="day-of-week center"
    /></ol>

    <ol
        id="week-calendar-days"
        class="week-days-grid"
    >
    </ol>
    </div>
    `;

    if(!initialWeekDays) setInitialWeekDays();

    

    createWeekCalendar();
    initWeekSelectors();

    showWeekEvents();
}

const setInitialWeekDays = () => {
    let tempWeekDays = [];
    let currDay = dayjs();
    let currDayOfWeek = getWeekday(currDay.format("YYYY-MM-DD"));
    let startOfWeek = currDay.subtract( currDayOfWeek ,"day");
    for(let i = 0; i < 7; i++) {
        tempWeekDays.push(startOfWeek.add(i, "day"));
    }
    initialWeekDays = tempWeekDays;
    currentWeekDays = [...initialWeekDays];
}

const changeWeek = (direction) => {
    if(direction == "present") {
        currentWeekDays = [...initialWeekDays];
    }
    else {
        tempWeekDays = [];
        currentWeekDays.forEach(weekDay => {
            if(direction == "next") tempWeekDays.push(weekDay.add(7, "day"));
            else tempWeekDays.push(weekDay.subtract(7, "day"));
        });
        currentWeekDays = tempWeekDays;
    }
}

const createWeekCalendar = () => {
    const calendarDaysElement = document.getElementById("week-calendar-days");

    document.getElementById("selected-week").innerHTML = 
    `${currentWeekDays[0].format("MMMM")} ${currentWeekDays[0].format("D")} -${currentWeekDays[1].isSame(currentWeekDays[6], 'month') ? "" : (" " + currentWeekDays[6].format("MMMM"))} ${currentWeekDays[6].format("D")}`
    
    document.getElementById("week-calendar-days").innerHTML = "";

    // removeAllDayElements(calendarDaysElement);
    document.getElementById("days-of-week").innerHTML = "";
    for(let i = 0; i < WEEKDAYS.length; i++) {
        const weekDayElement = document.createElement("li");
        document.getElementById("days-of-week").appendChild(weekDayElement);
        weekDayElement.innerText = `${WEEKDAYS[i]} - ${currentWeekDays[i].date()}`;
    }

    //Add horizontal lines to calendar
    let dividerContainer = document.createElement("div");
    dividerContainer.classList.add("divider-container");


    //Add time on left of calendar 
    let timeScale = document.createElement("li");
    timeScale.classList.add("time-scale");
    for(let i = 0; i < 24; i++) {
        let suffix = i >= 12 ? " PM":" AM";
        let hour = ((i + 11) % 12 + 1) + suffix;
        let timeBlock = document.createElement("div");
        timeBlock.innerHTML = hour;
        timeScale.appendChild(timeBlock);

        let divider = document.createElement("div");
        dividerContainer.appendChild(divider);
    }
    calendarDaysElement.appendChild(timeScale);
    calendarDaysElement.appendChild(dividerContainer);
    
    currentWeekDays.forEach((day) => {
        appendWeekDay(day, calendarDaysElement);
    });
}


const appendWeekDay = (day, calendarDaysElement) => {
    const dayElement = document.createElement("li");
    dayElement.id = day.format("YYYY-MM-DD");
    dayElement.classList.add("week-day");

    calendarDaysElement.appendChild(dayElement);


}


const initWeekSelectors = () => {
    document.getElementById("previous-week-selector").addEventListener("click", () => {
        changeWeek("previous");
        createWeekCalendar();
        showWeekEvents();
    });

    document.getElementById("present-week-selector").addEventListener("click", () => {
        changeWeek("present");
        createWeekCalendar();
        showWeekEvents();
    });

    document.getElementById("next-week-selector").addEventListener("click", () => {
        changeWeek("next");
        createWeekCalendar();
        showWeekEvents();
    });
}



const showWeekEvents = () => {
    //remove all elements first
    document.querySelectorAll(".week-event").forEach(item => {
        item.remove();
    });

    //remove color from friend item
    document.querySelectorAll(".friend-item").forEach(friendItem => {
        friendItem.className = "friend-item";
    });
    allCalendars[currentUserId].forEach(event => {
        let evtStartDate = dayjs(event.start);
        
        currentWeekDays.forEach(weekDay => {
            if (evtStartDate.isSame(weekDay, "day")) {
                addWeekEvent(currentUserId, event);
            }
        });
    });
    
    activeCalendars.forEach(id => {
        if(allCalendars[id]) {
            allCalendars[id].forEach(event => {
                let evtStartDate = dayjs(event.start);
                currentWeekDays.forEach(weekDay => {
                    if (evtStartDate.isSame(weekDay, "day")) {
                        addWeekEvent(id, event);
                    }
                });
            });
        }
        if (document.getElementById(id)) document.getElementById(id).parentNode.classList.add("color-" + activeCalendars.indexOf(id));
    });
    adjustWidthOfWeekEvents();
}

const addWeekEvent = (userId, event) => {
    const date = new Date(event.start).toISOString().split("T")[0];
    const eventContainer = document.getElementById(date);



    const eventDiv = document.createElement("div");
    eventDiv.dataset.owner = userId;
    eventDiv.dataset.time = Date.parse(event.start);
    eventDiv.classList.add("week-event");
    eventDiv.classList.add("color-" + activeCalendars.indexOf(userId));

    eventDiv.innerHTML = `<b>${getName(userId)}</b>`;

   
    eventDiv.style.marginTop = `${dayjs(event.start).hour() * 3}rem`;
    eventDiv.style.height = `${((dayjs(event.end).hour() - dayjs(event.start).hour()) * 3)-0.1}rem`;

    eventDiv.dataset.startTime = `${dayjs(event.start).hour()}:${dayjs(event.start).minute()}`;
    eventDiv.dataset.endTime = `${dayjs(event.end).hour()}:${dayjs(event.end).minute()}`;
    eventDiv.dataset.leftNeighbors = 0;
    eventDiv.dataset.rightNeighbors = 0;

    
    
    if (document.getElementById(date)) {
        eventContainer.append(eventDiv);
    }
    
}

const adjustWidthOfWeekEvents = () => {
    //loop through each day of current week element
        //iterate over each event
            //iterate over each event
                //If currEvent has a neighbor, add to neighbor count
    document.querySelectorAll(".week-day").forEach(dayColumn => {
        dayColumn.childNodes.forEach(selectedEvent => {
            let observingBeforeSelected = true;
            dayColumn.childNodes.forEach(observedEvent => {
                if(selectedEvent != observedEvent) {
                    if(areNeighbors(selectedEvent, observedEvent)) {
                        if(observingBeforeSelected) selectedEvent.dataset.leftNeighbors = parseInt(selectedEvent.dataset.leftNeighbors) + 1;
                        else selectedEvent.dataset.rightNeighbors = parseInt(selectedEvent.dataset.rightNeighbors) + 1;
                    }
                }
                else {
                    observingBeforeSelected = false;
                }
            });
        });
    });

    //adjust widths based on neighbor count
    document.querySelectorAll(".week-day").forEach(dayColumn => {
        dayColumn.childNodes.forEach(selectedEvent => {
            let neighbors = parseInt(selectedEvent.dataset.leftNeighbors) + parseInt(selectedEvent.dataset.rightNeighbors); 
            let width = (100 / (neighbors+1))-1;
            selectedEvent.style.width = `${width}%`;
            selectedEvent.style.left = `${(width * parseInt(selectedEvent.dataset.leftNeighbors)) + parseInt(selectedEvent.dataset.leftNeighbors)}%`;
        });
    });
}

const areNeighbors = (firstEvent, secondEvent) => {
    if(compareDates(firstEvent.dataset.startTime, secondEvent.dataset.startTime, "lte")) {
        //firstEvent starts before or at same time as secondEvent
        return compareDates(secondEvent.dataset.startTime, firstEvent.dataset.endTime, "lt");
    }
    else {
        //secondEvent starts before firstEvent
        return compareDates(firstEvent.dataset.startTime, secondEvent.dataset.endTime, "lt");
    }
}

const compareDates = (firstDate, secondDate, comparison) => {
    switch(comparison) {
        case "lte":
            //If first date hour is less than second date hour
            if(parseInt(firstDate.split(":")[0]) == parseInt(secondDate.split(":")[0])) {
                //return true if first date minutes are greater than or equal to 
                return parseInt(firstDate.split(":")[1]) <= parseInt(secondDate.split(":")[1]);
            } 
            return parseInt(firstDate.split(":")[0]) < parseInt(secondDate.split(":")[0]);
            break;
        case "lt": 
            //If first date hour is less than second date hour
            if(parseInt(firstDate.split(":")[0]) == parseInt(secondDate.split(":")[0])) {
                //return true if first date minutes are less than second date minutes
                return parseInt(firstDate.split(":")[1]) < parseInt(secondDate.split(":")[1]);
            } 
            return parseInt(firstDate.split(":")[0]) < parseInt(secondDate.split(":")[0]);
            break;
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
    let name = "You";
    friendsList.forEach(friend => {
        if (friend.id == id) name = friend.name;
    });
    return name;
}

const getWeekday = date => {
    // console.log(`${date}`, new Date(`${date}T18:00:00+00:00`));
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

const populateCalendarList = (data) => {

    let list = Object.values(data);
    list.forEach(calendar => {
        let container = document.createElement("div");
        container.classList.add("calendar-display-container");

        let visibilityDisplay = document.createElement("div");
        visibilityDisplay.classList.add("calendar-display-visibility");
        visibilityDisplay.innerHTML = calendar.enabled ? "&#10004;" : "&#10006;";

        container.appendChild(visibilityDisplay);
        let calendarName = document.createElement("p");
        calendarName.classList.add("calendar-display-name");
        calendarName.innerHTML = calendar.name;

        container.appendChild(calendarName);
        document.getElementById("yourCalendarList").appendChild(container);
    });
}

const toggleActiveCalendar = id => {
    let calendarIsActive = false;
    activeCalendars.forEach(calendarId => {
        if (calendarId == id) {
            calendarIsActive = true;
        }
    });
    if (calendarIsActive) {
        activeCalendars.splice(activeCalendars.indexOf(id), 1);
    } else {
        activeCalendars.push(id);
        if (activeCalendars.length > 4) {
            for (let i = 4; i < activeCalendars.length; i++) {
                document.getElementById(activeCalendars[0]).checked = false;
                activeCalendars.shift();
            }
        }

    }
    getCalendarData(id).then(() => {
        if (calendarViewMode == "month") showMonthEvents(selectedMonth.format("YYYY"), selectedMonth.format("M"));
        else showWeekEvents();
    });

}

//Fetch calendar data from backend
const getCalendarData = async (userId) => {
    if (allCalendars[userId]) return null;
    return fetch(`${apiUrl}${apiVersion}/calendars?id=${userId}`, {
            method: "GET",
            mode: "cors",
            // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: credentials
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            allCalendars[userId] = data[userId];
        });
}
//FETCH friends list
fetch(`${apiUrl}${apiVersion}/friends/current`, {
    method: "GET",
    mode: "cors",
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: credentials
})
.then(response => {
    return response.json();
})
.then(data => {
    let list = [];
    Object.keys(data).forEach(dataKey => {
        let obj = {id: dataKey};
        list.push(Object.assign(obj, data[dataKey]));
    });

    friendsList = list;
    populateFriendsList();
});

//FETCH current users calendars
fetch(`${apiUrl}${apiVersion}/calendars/details`, {
    method: "GET",
    mode: "cors",
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: credentials
})
.then(response => {
    return response.json();
})
.then(data => {
    populateCalendarList(data);
});



document.getElementById("calendarViewModeSelect").addEventListener("change", event => {
    if (event.target.value == "week") {
        calendarViewMode = "week";
        showWeekView();
    } else {
        calendarViewMode = "month";
        showMonthView();
    }
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

getCalendarData(currentUserId).then(() => (showMonthView()));