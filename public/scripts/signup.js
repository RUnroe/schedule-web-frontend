const emailInput = document.getElementById("emailInput");
const fNameInput = document.getElementById("fNameInput");
const lNameInput = document.getElementById("lNameInput");
const passInput = document.getElementById("passInput");
const confirmPassInput = document.getElementById("confirmPassInput");


const validateForm = () => {
    let results = [];
    results.push(validateField(emailInput, validateEmail));
    results.push(validateField(fNameInput, validateName));
    results.push(validateField(lNameInput, validateName));
    results.push(validateField(passInput, validatePassword));
    results.push(confirmPass(confirmPassInput, passInput, confirmPassword));
    console.log(results);
    let retValue = true;
    results.forEach(result => {
        if (!result) retValue = false;
    });
    return retValue;
} 

const postData = () => {
    console.log(
        emailInput.value,
        fNameInput.value + " " + lNameInput.value
    )
}

const confirmPass = (confirmField, passField, validationCallback) => {
    let result = validationCallback(confirmField.value, passField.value); 
    let errorMessage = confirmField.parentNode.children[2];
    if(!result.isValid) {
        errorMessage.innerHTML = result.errorMsg;
        if(errorMessage.classList.contains("hidden")) errorMessage.classList.remove("hidden");
    }
    else {
        if(!errorMessage.classList.contains("hidden")) errorMessage.classList.add("hidden");
    }
    return result.isValid;
}

emailInput.addEventListener("focusout", () => {
    validateField(emailInput, validateEmail);
});
fNameInput.addEventListener("focusout", () => {
    validateField(fNameInput, validateName);
});
lNameInput.addEventListener("focusout", () => {
    validateField(lNameInput, validateName);
});
passInput.addEventListener("focusout", () => {
    validateField(passInput, validatePassword);
});
confirmPassInput.addEventListener("focusout", () => {
    confirmPass(confirmPassInput, passInput, confirmPassword);
});


document.getElementById("createAccountBtn").addEventListener("click", () => {
    if(validateForm()) postData();
});

//set up create account btn. have it call method. Method checks if validateForm is true. if it is, send fetch request