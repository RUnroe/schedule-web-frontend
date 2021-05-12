let userCalendarList = [];
let newId = 0;



const getCalendarList = () => {
    fetch(`${apiUrl}/api/${apiVersion}/friends`) //TODO: Update link
    .then((response) => response.json())
    .then((data) => {
        userCalendarList = data;
        updateCalendarListDisplay();
        checkIfListIsEmpty();
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
    if(!calendar.visible) calendarItem.classList.add("disabled");
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

    let visibilityBtn = document.createElement("span");
    visibilityBtn.classList.add("visibility");
    visibilityBtn.classList.add("icon-btn");
    //Image came from https://fontawesome.com/icons. Color has been modified.
    visibilityBtn.innerHTML = `<img src=${calendar.visible ? "../images/eye-solid.svg" : "../images/eye-slash-solid.svg" } />`;
    visibilityBtn.addEventListener("click", () => {
        toggleVisibility(calendar.id);
    });
    btnGroup.appendChild(visibilityBtn);


    let editBtn = document.createElement("span");
    editBtn.classList.add("accept");
    editBtn.classList.add("icon-btn");
    //Image came from https://fontawesome.com/icons. Color has been modified.
    editBtn.innerHTML = `<img src="../images/pencil-alt-solid.svg" />`;
    editBtn.addEventListener("click", () => {
        if(document.getElementById(calendar.id).dataset.editMode === "true") exitEditMode();
        else enterEditMode(calendar.id);
    });
    btnGroup.appendChild(editBtn);

    calendarItem.appendChild(calendarICS);
    let deleteBtn = document.createElement("span");
    deleteBtn.classList.add("delete");
    deleteBtn.classList.add("icon-btn");
    deleteBtn.innerHTML = `<img src="../images/trash.svg" />`;
    deleteBtn.addEventListener("click", () => {
        removeCalendar(calendar.id);
    });

    btnGroup.appendChild(deleteBtn);
    calendarItem.appendChild(btnGroup);;
    return calendarItem;
}

const toggleVisibility = id => {
    let visibility;
    userCalendarList = userCalendarList.map( object => {
        if(object.id == id) {
            let newObject = {
                id: object.id,
                name: object.name,
                ics: object.ics
            }
            visibility = !object.visible;
            newObject.visible = visibility;
            return newObject;
        } 
        return object;
    });
    document.getElementById(id).getElementsByClassName("visibility")[0].childNodes[0].src = visibility ? "../images/eye-solid.svg" : "../images/eye-slash-solid.svg";
    document.getElementById(id).classList.toggle("disabled");
}

const removeCalendar = id => {
    //remove element from HTML
    document.getElementById(id).remove();
    //remove from global list
    userCalendarList = userCalendarList.filter((cal) => (cal.id != id));
    checkIfListIsEmpty();
}

const addCalendar = (name, ics) => {
   let newCalendar = {
        id: `replace${newId++}`,
        name,
        ics,
        visible: true
   }
   if(userCalendarList.length == 0) document.getElementById("calendarList").innerHTML = "";
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
        if(calendarItem.dataset.editMode === "true") {
            let jsonCalendar = userCalendarList.filter(cal => cal.id == calendarItem.id)[0];


            let icsText = calendarItem.childNodes[1].value;
            calendarItem.childNodes[1].remove();
            let icsDisplay = document.createElement("p");
            icsDisplay.classList.add("calendar-ics");
            if(isIcsValid(icsText))icsDisplay.innerHTML = icsText;
            else icsDisplay.innerHTML = jsonCalendar.ics;
            
            let nameText = calendarItem.childNodes[0].value;
            calendarItem.childNodes[0].remove();
            let nameDisplay = document.createElement("p");
            nameDisplay.classList.add("calendar-name");
            if(isTextValid(nameText)) nameDisplay.innerHTML = nameText;
            else nameDisplay.innerHTML = jsonCalendar.name;

            calendarItem.prepend(icsDisplay);
            calendarItem.prepend(nameDisplay);

            calendarItem.dataset.editMode = false;

            //save to list
            userCalendarList = userCalendarList.map( object => {
                if(object.id == calendarItem.id) {
                    let newObject = {
                        id: object.id,
                        name: nameText,
                        ics: icsText,
                        visible: object.visible
                    }
                    return newObject;
                } 
                return object;
            });
        }
    });

}


const checkIfListIsEmpty = () => {
    if(userCalendarList.length == 0) {
        document.getElementById("calendarList").innerHTML = "";
        let text = document.createElement("p");
        text.innerHTML = "You do not have any calendars. Add one below!";
        document.getElementById("calendarList").appendChild(text);
    }
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

const isTextValid = text => {
    if(text.length > 0) {
        return true;
    }
    document.getElementById("ErrorMsg").innerHTML = "Please give the calendar a name";
    return false;
}

const isIcsValid = ics => {
    if( ics.includes(".ics")) {
        return true;
    }
    document.getElementById("ErrorMsg").innerHTML = "Invalid ICS link";
    return false;
}

document.getElementById("createCalendarBtn").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value;
    const ics = document.getElementById("icsInput").value;
    if(isTextValid(name) && isIcsValid(ics)) {
        if(!document.getElementById("ErrorMsg").classList.contains("hidden")) document.getElementById("ErrorMsg").classList.add("hidden");
        addCalendar(name, ics);
        document.getElementById("nameInput").value = "";
        document.getElementById("icsInput").value = "";
    }
    else {
        if(document.getElementById("ErrorMsg").classList.contains("hidden")) document.getElementById("ErrorMsg").classList.remove("hidden");
    }
});

document.getElementById("saveBtn").addEventListener("click", () => {saveChanges();});
document.getElementById("cancelBtn").addEventListener("click", () => {backToApp();});
document.getElementsByClassName("back-arrow")[0].addEventListener("click", () => {backToApp();});
