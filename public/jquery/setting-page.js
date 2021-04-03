const currencyOptions = [
  { currency: "Rupee", Hexcode: "&#8377" },
  { currency: "Dollar", Hexcode: "&#x24" },
  { currency: "Euro", Hexcode: "&#8364" },
  { currency: "Pound", Hexcode: "&#163" },
  { currency: "Yen", Hexcode: "&#165" },
  { currency: "Yuan", Hexcode: "&#20803" },
];
$(document).ready(function () {
  let options;
  $.each(currencyOptions, function (i, option) {
    options += `<option id =${i} value = ${option.Hexcode}>${option.currency}</option>`;
  });
  $("#selectCurrency").empty().append(options);

  $("#currencyUpdateForm").submit(function (event) {
    event.preventDefault();
    let currency = $("#selectCurrency").val() || "";
    let url = `${window.location.origin}/updateCurrency`;
    $.ajax({
      method: "Post",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        currency: currency,
      },
      beforeSend: function () {
        addLoading();
      },
      success: function () {
        bootbox.alert(`Currency Updated to ${currency}`);
      },
      error: function (response) {
        if (response.status === 401) {
          window.location.href = window.location.origin + "/authpage";
        } else {
          bootbox.alert(JSON.stringify(response));
        }
      },
      complete: function () {
        removeLoading();
      },
    });
  });

  $("#emailUpdateForm").submit(function (event) {
    event.preventDefault();
    let password = $("#emailCurrentPassword").val().trim() || "";
    let emailAddress = $("#settingEmailAddress").val().trim() || "";
    let url = `${window.location.origin}/updateEmail`;
    $.ajax({
      method: "Post",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        password: password,
        emailAddress: emailAddress,
      },
      beforeSend: function () {
        addLoading();
      },
      success: function () {
        bootbox.alert(`Email Updated to ${emailAddress}`);
      },
      error: function (response) {
        if (response.status === 401) {
          window.location.href = window.location.origin + "/authpage";
        } else {
          bootbox.alert(JSON.stringify(response.responseText));
        }
      },
      complete: function () {
        removeLoading();
        $("#emailCurrentPassword").val("");
        $("#settingEmailAddress").val("");
      },
    });
  });

  $("#passwordUpdateForm").submit(function (event) {
    event.preventDefault();
    let currentPassword = $("#settingCurrentPassword").val().trim() || "";
    let newPassword = $("#settingNewPassword").val().trim() || "";
    let newPasswordConfirm = $("#settingConfirmNewPassword").val().trim() || "";
    let url = `${window.location.origin}/updatePassword`;
    if (newPassword === newPasswordConfirm) {
      $.ajax({
        method: "Post",
        url: url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          password: currentPassword,
          newPassword: newPassword,
        },
        beforeSend: function () {
          addLoading();
        },
        success: function () {
          bootbox.alert(`Password Updated`);
        },
        error: function (response) {
          if (response.status === 401) {
            bootbox.alert("Login to Update Password");
            window.location.href = window.location.origin + "/authpage";
          } else {
            bootbox.alert(JSON.stringify(response.responseText));
          }
        },
        complete: function () {
          removeLoading();
          $("#settingCurrentPassword").val("");
          $("#settingNewPassword").val("");
          $("#settingConfirmNewPassword").val("");
        },
      });
    } else {
      bootbox.alert(`New Password are Not Matching`);
      $("#settingNewPassword").val("");
      $("#settingConfirmNewPassword").val("");
    }
  });
});
