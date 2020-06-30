const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data){
    let errors = {};
    //if field is empty, then turn null into empty string for validation
    data.username = !isEmpty(data.username) ? data.username: "";
    data.email = !isEmpty(data.email) ? data.email: "";
    data.password = !isEmpty(data.password) ? data.password: "";
    data.passwordConfirm = !isEmpty(data.passwordConfirm) ? data.passwordConfirm: "";

    if (Validator.isEmpty(data.username)){
        errors.username = "Username Field is required";
    }
    //checks email
    if (Validator.isEmpty(data.email)){
        errors.email = "Email Field is required";
    }else if (!Validator.isEmail(data.email)){
        errors.email = "Email Entered is Invalid";
    }
    //checks password
    if (Validator.isEmpty(data.password)){
        errors.password = "Password Field is required";
    }
    if (Validator.isEmpty(data.passwordConfirm)){
        errors.passwordConfirm = "Confirmation Passworld Field is required";
    }
    if (!Validator.isLength(data.password, {min: 6, max: 30})){
        errors.password = "Password Must be at least 6 characters";
    }
    if (!Validator.equals(data.password, data.passwordConfirm)){
        errors.password = "Passwords Must Match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };


};