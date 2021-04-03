$(document).ready(function () {
  $("#loginForm").submit(function (event) {
    event.preventDefault();
    let usernames = $("#loginUsername").val().trim();
    let passwords = $("#loginPassword").val().trim();
    let remember = $("#loginRememberme").prop("checked");
    let url = window.location.origin + "/login";
    let redirect = window.location.origin + "/record";
    $.ajax({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        username: usernames,
        password: passwords,
        remember: remember,
      },
      beforeSend: function () {
        addLoading();
      },
      success: function () {
        window.location.href = redirect;
      },
      error: function (response) {
        bootbox.alert(response.responseText);
        clearInput();
      },
      complete: function () {
        removeLoading();
      },
    });
  });

  $("#registerForm").submit(function (event) {
    event.preventDefault();
    let usernameForm = $("#registerUsername").val();
    let passwordForm = $("#registerPassword").val();
    let confirmPasswordForm = $("#registerConfirmPassword").val();
    let emailAddressForm = $("#registerEmailAddress").val();
    let url = window.location.origin + "/api/register";
    if (passwordForm === confirmPasswordForm) {
      $.ajax({
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          username: usernameForm,
          password: passwordForm,
          emailAddress: emailAddressForm,
        },
        beforeSend: function () {
          addLoading();
        },
        success: function () {
          $("#navLoginTab").trigger("click");
          bootbox.alert("Please Login with new username and password");
        },
        error: function (response) {
          bootbox.alert(response.responseText);
          clearInput();
        },
        complete: function () {
          removeLoading();
        },
      });
    } else {
      bootbox.alert("Warning: Passwords Are Not Matching");
      $("#registerConfirmPassword").val("");
      $("#registerPassword").val("");
    }
  });

  function clearInput() {
    var InputElement = [
      "loginUsername",
      "loginPassword",
      "registerUsername",
      "registerEmailAddress",
      "registerPassword",
      "registerConfirmPassword",
    ];
    InputElement.forEach((id) => {
      $("#" + id).val("");
    });
  }
});
