const emailInput = document.getElementById("emailInput");
const fNameInput = document.getElementById("fNameInput");
const lNameInput = document.getElementById("lNameInput");


const validateForm = () => {
    let results = [];
    results.push(validateField(fNameInput, validateName));
    results.push(validateField(lNameInput, validateName));
    let retValue = true;
    results.forEach(result => {
        if (!result) retValue = false;
    });
    return retValue;
} 

const postData = () => {
    //TODO 
    const userData = {
        first_name: fNameInput.value,
        last_name: lNameInput.value
    }
    //If fetch put request comes back with 204, send to app page 
    fetch(`${apiUrl}${apiVersion}/auth`, {
        method: "PUT",
        credentials: credentials,
        body: JSON.stringify(userData),
        headers: new Headers({'Content-Type': 'application/json'})
    })
    .then(response => {
        if(response.status == 204) backToApp();
        //else uh oh
    });
   
}



const getUserData = () => {
    //fetch current user data. Set input field values to results of fetch 
    fetch(`${apiUrl}${apiVersion}/auth`)
    .then(response => (response.json()))
    .then((data) => {
        emailInput.value = data.email,
        fNameInput.value = data.first_name,
        lNameInput.value = data.last_name
    });
}

const logUserOut = () => {
    //TODO
    fetch(`${apiUrl}${apiVersion}/auth`, {
        method: "DELETE"
    }).then(response => {
        window.location = "/";
    });
}

const backToApp = () => {
    window.location.href = "/app";
}

fNameInput.addEventListener("focusout", () => {
    validateField(fNameInput, validateName);
});
lNameInput.addEventListener("focusout", () => {
    validateField(lNameInput, validateName);
});

document.getElementById("cancelBtn").addEventListener("click", () => {backToApp();});
document.getElementsByClassName("back-arrow")[0].addEventListener("click", () => {backToApp();});

document.getElementById("saveBtn").addEventListener("click", () => {
    if(validateForm()) postData();
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    logUserOut();
});

getUserData();

