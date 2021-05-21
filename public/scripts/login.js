const emailInput = document.getElementById("emailInput");
const passInput = document.getElementById("passInput");


const validateForm = () => {
    let results = [];
    results.push(validateField(emailInput, validateEmail));
    results.push(validateField(passInput, validatePassword));
    console.log(results);
    let retValue = true;
    results.forEach(result => {
        if (!result) retValue = false;
    });
    return retValue;
} 

const postData = () => {
    //TODO 
    //fetch data. If valid, go to app page. If not, get angy


    // window.location.href = "/app";
}


emailInput.addEventListener("focusout", () => {
    validateField(emailInput, validateEmail);
});

passInput.addEventListener("focusout", () => {
    validateField(passInput, validatePassword);
});



document.getElementById("loginBtn").addEventListener("click", () => {
    if(validateForm()) postData();
});

