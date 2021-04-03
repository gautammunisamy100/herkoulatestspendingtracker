$(document).ready(function () {
  $("#forgotForm").submit(function (event) {
    event.preventDefault();
    let usernameForm = $("#forgotUsername").val() || "";
    let emailAddressForm = $("#forgotEmailAddress").val() || "";
    let url = `${window.location.origin}/sendForgotMail`;
    if ("" !== usernameForm || "" !== emailAddressForm) {
      $("body").addClass("wait");
      $.ajax({
        method: "Post",
        url: url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          username: usernameForm,
          emailAddress: emailAddressForm,
        },
        success: function () {
          bootbox.alert(
            "Mail will be Sent to the registered Mail,you may receive it in 10 Mintues.Please Check Email in Inbox or spam Box"
          );
        },
        error: function (response) {
          bootbox.alert(response.responseText);
        },
        complete: function () {
          $("body").removeClass("wait");
        },
      });
    } else {
      bootbox.alert("Please Enter either Username or EmailAddress");
    }
  });
});
