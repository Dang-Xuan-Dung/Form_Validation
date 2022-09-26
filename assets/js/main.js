const $ = document.querySelector.bind(document);
const modal = $(".modal");
const modalClose = $(".modal-close");

const FORMAT = {
  NAME: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
  EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z]).{8,32}$/,
};
const MESSAGE = {
  FULLNAME: "Special characters are not allowed",
  EMAIL: "Please enter a valid email address",
  PASSWORD: "8-32 characters, 1 uppercase, 1 lowercase",
  PASSWORD_CONFIRM: "The password and confirm password don't match",
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

function validateForm(form) {
  const formElement = $(form);
  const FORM = formElement.querySelector.bind(formElement);
  const inputList = formElement.querySelectorAll("input");
  const submitBtn = FORM(".form-submit");
  const confirmPass = FORM("#password_confirm");

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
            errorMessage(inputElement, MESSAGE[inputElement.name.toUpperCase()]);
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
    return FORM(inputElement).value;
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

    if (inputElement.name === "fullname" && FORMAT.NAME.test(nameValue)) {
      return false;
    }

    if (inputElement.name === "email" && !FORMAT.EMAIL.test(emailValue)) {
      return false;
    }

    if (inputElement.name === "password" && passValue !== confirmPassValue) {
      errorMessage(confirmPass, MESSAGE.PASSWORD_CONFIRM);
      if (FORMAT.PASSWORD.test(passValue)) {
        return true;
      }
      return false;
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
