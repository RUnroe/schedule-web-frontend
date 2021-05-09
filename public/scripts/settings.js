const userCalendarList = {};




const getCalendarList = () => {
    fetch(`${apiUrl}/api/${apiVersion}/friends`) //TODO: Update link
    .then((response) => response.json())
    .then((data) => {
        userCalendarList = data;
        updateCalendarListDisplay();
    });
}


const updateCalendarListDisplay = () => {

}

const removeCalendar = (id) => {

}

const addCalendar = (name, ics) => {

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
