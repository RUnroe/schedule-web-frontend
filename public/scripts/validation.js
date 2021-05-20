const validateName = (name) => {
	let nameRegex = /^[a-zA-Z0-9_ ]+$/;
	let areCharactersValid = nameRegex.test(name);
	let isLongEnough = name.length > 0;
	let isShortEnough = name.length < 65;
	let nameErrorMsg = "";

	if (!isLongEnough) nameErrorMsg = "Name is too short";
	else if (!areCharactersValid)
		nameErrorMsg= "Invalid character(s)";
	else if (!isShortEnough) nameErrorMsg = "Name is too long";

	let isValid = areCharactersValid && isShortEnough && isLongEnough;
	
	return {isValid, errorMsg: nameErrorMsg};
};

const validateEmail = (email) => {
	let emailRegex = /\w+@\w+\.\w+/;
	isValid = emailRegex.test(email);
	let emailErrorMsg = "Email is invalid";
	
	return {isValid, errorMsg: emailErrorMsg};
};

const validatePassword = (password) => {
	//Minimum eight characters, at least one letter and one number
	let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
	let isValid = passwordRegex.test(password);
	let passwordErrorMsg = "Password must contain at least 8 characters, 1 letter, and 1 number";

	
	return {isValid, errorMsg: passwordErrorMsg};
};



const confirmPassword = (confirmValue, password) => {
	let isValid = confirmValue == password && confirmValue != "";
	let confirmErrorMsg = "Passwords do not match";

	return {isValid, errorMsg: confirmErrorMsg}
};

const validateField = (field, validationCallback) => {
    let result = validationCallback(field.value); 
    let errorMessage = field.parentNode.children[2];
    if(!result.isValid) {
        errorMessage.innerHTML = result.errorMsg;
        if(errorMessage.classList.contains("hidden")) errorMessage.classList.remove("hidden");
    }
    else {
        if(!errorMessage.classList.contains("hidden")) errorMessage.classList.add("hidden");
    }
    return result.isValid;
}