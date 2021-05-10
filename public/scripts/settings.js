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

    let btnGroup = document.createElement("div");
    btnGroup.classList.add("btn-group");

    let editBtn = document.createElement("span");
    editBtn.classList.add("accept");
    editBtn.classList.add("edit-btn");
    //Image came from https://fontawesome.com/icons/pencil-alt. Color has been modified.
    editBtn.innerHTML = `<img src="../images/pencil-alt-solid.svg" />`;
    editBtn.addEventListener("click", () => {
        if(document.getElementById(calendar.id).dataset.editMode === "true") exitEditMode();
        else enterEditMode(calendar.id);
    });
    btnGroup.appendChild(editBtn);

    calendarItem.appendChild(calendarICS);
    let deleteBtn = document.createElement("span");
    deleteBtn.classList.add("delete");
    deleteBtn.innerHTML = "&#10006;";
    deleteBtn.addEventListener("click", () => {
        removeCalendar(calendar.id);
    });

    btnGroup.appendChild(deleteBtn);
    calendarItem.appendChild(btnGroup);;
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
    console.log("enter");

    const calendarItem = document.getElementById(id);
    let icsText = calendarItem.getElementsByClassName("calendar-ics")[0].innerHTML;
    calendarItem.getElementsByClassName("calendar-ics")[0].remove();
    let icsInput = document.createElement("input");
    icsInput.classList.add("calendar-ics");
    icsInput.value = icsText;
    calendarItem.prepend(icsInput);
    
    let nameText = calendarItem.getElementsByClassName("calendar-name")[0].innerHTML;
    calendarItem.getElementsByClassName("calendar-name")[0].remove();
    let nameInput = document.createElement("input");
    nameInput.classList.add("calendar-name");
    nameInput.value = nameText;
    calendarItem.prepend(nameInput);

    calendarItem.dataset.editMode = true;
}

const exitEditMode = () => {
    console.log("exit");
    document.getElementById("calendarList").childNodes.forEach(calendarItem => {
        let icsText = calendarItem.childNodes[1].value;
        calendarItem.childNodes[1].remove();
        let icsDisplay = document.createElement("p");
        icsDisplay.classList.add("calendar-ics");
        icsDisplay.innerHTML = icsText;
        
        
        let nameText = calendarItem.childNodes[0].value;
        calendarItem.childNodes[0].remove();
        let nameDisplay = document.createElement("p");
        nameDisplay.classList.add("calendar-name");
        nameDisplay.innerHTML = nameText;

        calendarItem.prepend(icsDisplay);
        calendarItem.prepend(nameDisplay);

        calendarItem.dataset.editMode = false;
    });
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
