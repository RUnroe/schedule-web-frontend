let userCalendarList = [];
let newId = 0;



const getCalendarList = () => {
    fetch(`${apiUrl}/api/${apiVersion}/friends`) //TODO: Update link
    .then((response) => response.json())
    .then((data) => {
        userCalendarList = data;
        updateCalendarListDisplay();
    });
}


const updateCalendarListDisplay = () => {
    userCalendarList.forEach(calendar => {
        document.getElementById("calendarList").appendChild(createCalendarItem(calendar));
    });
}

const createCalendarItem = calendar => {
    let calendarItem = document.createElement("div");
    calendarItem.classList.add("calendar-item");
    calendarItem.id = calendar.id;

    let calendarName = document.createElement("p");
    calendarName.classList.add("calendar-name")
    calendarName.innerHTML = calendar.name;

    calendarItem.appendChild(calendarName);
    let calendarICS = document.createElement("p");
    calendarICS.classList.add("calendar-ics");
    calendarICS.innerHTML = calendar.ics;

    calendarItem.appendChild(calendarICS);
    let deleteBtn = document.createElement("span");
    deleteBtn.classList.add("delete");
    deleteBtn.innerHTML = "&#10006;";
    deleteBtn.addEventListener("click", () => {
        removeCalendar(calendar.id);
    });
    calendarItem.appendChild(deleteBtn);
    return calendarItem;
}

const removeCalendar = (id) => {
    //remove element from HTML
    document.getElementById(id).remove();
    //remove from global list
    userCalendarList = userCalendarList.filter((cal) => (cal.id != id));
}

const addCalendar = (name, ics) => {
   let newCalendar = {
        id: `replace${newId++}`,
        name,
        ics
   }
   document.getElementById("calendarList").appendChild(createCalendarItem(newCalendar));
   userCalendarList.push(newCalendar);
}

const enterEditMode = (id) => {

}

const exitEditMode = () => {

}

const generateCalendarItem = () => {

}


const backToApp = () => {
    window.location.href = "/app";
}

const saveChanges = () => {
    let modifiedList = userCalendarList.map(calendar => {
        if(calendar.id.includes("replace")) {
            let newCalendar = calendar;
            newCalendar.id = null;
            return newCalendar;
        }
        return calendar;
    });
    console.log(modifiedList);
    //fetch request. Send calendar list to backend

    backToApp();
}

document.getElementById("createCalendarBtn").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value;
    const ics = document.getElementById("icsInput").value;
    addCalendar(name, ics);
});

document.getElementById("saveBtn").addEventListener("click", () => {saveChanges();});
document.getElementById("cancelBtn").addEventListener("click", () => {backToApp();});
document.getElementsByClassName("back-arrow")[0].addEventListener("click", () => {backToApp();});
