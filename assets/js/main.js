const $ = document.querySelector.bind(document);
const modal = $(".modal");
const modalClose = $(".modal-close");


const INPUT_VALIDATION = {
  FULLNAME: {
    FORMAT : /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
    MESSAGE :"Special characters are not allowed"
  },
  EMAIL: {
    FORMAT : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    MESSAGE : "Please enter a valid email address"
  },
  PASSWORD: {
    FORMAT :  /^(?=.*[a-z])(?=.*[A-Z]).{8,32}$/,
    MESSAGE : "8-32 characters, 1 uppercase, 1 lowercase"
  },

  PASSWORD_CONFIRM : {
    MESSAGE : "The password and confirm password don't match"
  }

};



validateForm("#form-1");

//? Handle Modal
modalClose.onclick = function () {
  modal.classList.remove("show");
};

window.addEventListener("click", function (e) {
  if (!modal.contains(e.target) && !e.target.matches(".form-submit")) {
    modal.classList.remove("show");
  }
});

//? Handle Validate Form

function validateForm(formName) {
  const formElement = $(formName);
  const form = formElement.querySelector.bind(formElement);
  const inputList = formElement.querySelectorAll("input");
  const submitBtn = form(".form-submit");
  const confirmPass = form("#password_confirm");

  //? Handle input changes
  inputList.forEach(function (inputElement) {
    inputElement.addEventListener("input", function(){

        if (checkInputChange(inputElement) === true) {
          getParent(inputElement).classList.remove("invalid");
          getParent(inputElement, ".form-message").innerHTML = "";
        } 

        else {

          if (inputElement.value === "") {
            errorMessage(inputElement);
          } else
            errorMessage(inputElement, INPUT_VALIDATION[inputElement.name.toUpperCase()].MESSAGE);
        }
    
        //? Handle disabled submit
        let isValid = true;
        +(function checkSubmit() {
          isValid = Array.from(inputList).every(function (input) {
            return (
              input.value !== "" &&
              !getParent(input).classList.contains("invalid")
            );
          });
          if (isValid) {
            submitBtn.removeAttribute("disabled");
          } else {
            submitBtn.setAttribute("disabled", "true");
          }
        })();
    })
  });



  submitBtn.addEventListener("click", (e)=> {
    e.preventDefault();
    modal.classList.add("show");
  })

  function getValueById(inputElement) {
    return form(inputElement).value;  
  }

  //? Check Input Changes
  function checkInputChange(inputElement) {
    const nameValue = getValueById("#fullname").trim();
    const emailValue = getValueById("#email").trim();
    const passValue = getValueById("#password");
    const confirmPassValue = getValueById("#password_confirm"); 

    if (inputElement.value.trim() === "") { 
      return false;
    }

    if (inputElement.name === "fullname") {
      return !INPUT_VALIDATION.FULLNAME.FORMAT.test(nameValue);
    }

    if (inputElement.name === "email") {
      return INPUT_VALIDATION.EMAIL.FORMAT.test(emailValue);
    }

    if (inputElement.name === "password" && passValue !== confirmPassValue) {
      errorMessage(confirmPass, INPUT_VALIDATION.PASSWORD_CONFIRM.MESSAGE);  
      return (INPUT_VALIDATION.PASSWORD.FORMAT.test(passValue))

    } 
    else {
      getParent(confirmPass).classList.remove("invalid");
      getParent(confirmPass, ".form-message").innerHTML = "";
    }

    if (inputElement.name === "password_confirm" && confirmPassValue !== passValue){
      return false;
    }
    return true;
  }
}

//? Handle Error Messages

function errorMessage(inputElement, message) {
  getParent(inputElement).classList.add("invalid");
  getParent(inputElement, ".form-message").innerHTML =
    message || "This field is required";
}

function getParent(element, target = null) {
  const parent = element.parentElement;
  return target ? parent.querySelector(target) : parent;
}
