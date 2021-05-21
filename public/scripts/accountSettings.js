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
    //If fetch put request comes back with 200, send to app page 
    // window.location.href = "/app";
}


const backToApp = () => {
    window.location.href = "/app";
}

const getUserData = () => {
    //fetch current user data. Set input field values to results of fetch 
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

getUserData();


//TODO logout button