const $ = document.querySelector.bind(document);

Validator("#form-1");

//? Handle Modal
const modal = $(".modal");
const modalClose = $(".modal-close");
modalClose.onclick = function () {
  modal.classList.remove("show");
};

window.addEventListener("click", function (e) {
  if (!modal.contains(e.target) && !e.target.matches(".form-submit")) {
    modal.classList.remove("show");
  }
});

//? Handle Validate Form

function Validator(form) {
  const formElement = $("#form-1");
  const FORM = formElement.querySelector.bind(formElement);
  const inputList = formElement.querySelectorAll("input");
  const submitBtn = FORM(".form-submit");

  //? Check input onchage
  inputList.forEach(function (inputElement) {
    inputElement.oninput = function () {
      const confirmPass = FORM("#password_confirm");
      const confirmPassValue = confirmPass.value.trim();
      const passValue = FORM("#password").value.trim();

      if (passValue !== confirmPassValue) {
        errorMessage(
          confirmPass,
          "The password and confirm password don't match"
        );
      } else {
        getParent(confirmPass).classList.remove("invalid");
        getParent(confirmPass, ".form-message").innerHTML = "";
      }

      if (checkInputChange(inputElement) !== false) {
        getParent(inputElement).classList.remove("invalid");
        getParent(inputElement, ".form-message").innerHTML = "";
      }

      //? Handle disabled submit
      let isValid;
      +(function checkSubmit() {
        if (passValue !== confirmPassValue) {
          isValid = false;
        } else isValid = true;

        inputList.forEach(function (input) {
          if (
            input.value === "" ||
            getParent(input).classList.contains("invalid")
          )
            isValid = false;
        });

        if (isValid === false) {
          submitBtn.setAttribute("disabled", "true");
          submitBtn.classList.remove("isActive");
        } else {
          submitBtn.removeAttribute("disabled");
          submitBtn.classList.add("isActive");
        }
      })();
    };
  });

  submitBtn.onclick = function (e) {
    e.preventDefault();
    modal.classList.add("show");
  };

  function getValueById(inputElement) {
    return FORM(inputElement).value.trim();
  }

  //? Handle Input Changes
  function checkInputChange(inputElement) {
    const nameValue = getValueById("#fullname");
    const emailValue = getValueById("#email");
    const passValue = getValueById("#password");
    const confirmPassValue = getValueById("#password_confirm");
    let message = "";

    if (inputElement.value.trim() === "") {
      errorMessage(inputElement);
      return false;
    }
    const formatName = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (inputElement.name === "fullname" && formatName.test(nameValue)) {
      message = "Special characters are not allowed";
      errorMessage(inputElement, message);
      return false;
    }

    const formatEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputElement.name === "email" && !formatEmail.test(emailValue)) {
      message = "Please enter a valid email address";
      errorMessage(inputElement, message);
      return false;
    }

    const formatPass = /^(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
    if (inputElement.name === "password" && !formatPass.test(passValue)) {
      message = "8-32 characters, 1 uppercase, 1 lowercase";
      errorMessage(inputElement, message);
      return false;
    }
    if (
      inputElement.name === "password_confirm" &&
      confirmPassValue !== passValue
    ) {
      message = "The password and confirm password don't match";
      errorMessage(inputElement, message);
      return false;
    }
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
