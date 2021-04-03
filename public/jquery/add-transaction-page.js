const incomeOptions = ["Salary", "Allowance", "Bonus", "Interest", "Other"];
const expenseOptions = [
  "Rent",
  "Emi",
  "Fuel",
  "Health",
  "Education",
  "Food",
  "Entertainment",
  "General",
  "Gifts",
  "Holiday",
  "Kids",
  "Shopping",
  "Travel",
  "Other",
];

$(document).ready(function () {
  let options = "";
  $.each(expenseOptions, function (i, option) {
    options += `<option id=${i} value=${option}> ${option}</option>`;
  });
  $("#selectCategory").empty().append(options);
  $("#addDate").val(getCurrentDate("-"));
  $("#addCDDate").val(getCurrentDate("-"));

  $("#selectType").on("change", function () {
    var selectVal = $("#selectType option:selected").val();
    if (selectVal === "Expense") {
      options = "";
      $.each(expenseOptions, function (i, option) {
        options += `<option id=${i} value=${option}> ${option}</option>`;
      });
      $("#selectCategory").empty().append(options);
    } else {
      options = "";
      $.each(incomeOptions, function (i, option) {
        options += `<option id=${i} value=${option}> ${option}</option>`;
      });
      $("#selectCategory").empty().append(options);
    }
  });

  $("#addTransactionForm").submit(function (event) {
    event.preventDefault();
    let amount = $("#addAmount").val();
    let note = $("#addNote").val() || "";
    let transactionType = $("#selectType option:selected").val();
    let category = $("#selectCategory option:selected").val();
    let date = $("#addDate").val() || "";

    if (date === "") {
      bootbox.alert("Please Select a Date");
      return;
    }
    let url = window.location.origin + "/addTransaction";
    $("body").addClass("wait");
    $("#navLoading").addClass("loading");
    $.ajax({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        amount: amount,
        transactionType: transactionType,
        category: category,
        note: note,
        date: date,
      },
      beforeSend: function () {
        addLoading();
      },
      success: function (response) {
        bootbox.alert(JSON.stringify(response));
        clearField();
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

  function clearField() {
    $("#addAmount").val("0");
    $("#addNote").val("");
    $("#addCDAmount").val("0");
    $("#addCDNote").val("");
  }

    $("#addCDTransactionForm").submit(function (event) {
    event.preventDefault();
    let amount = $("#addCDAmount").val();
    let note = $("#addCDNote").val() || "";
    let transactionType = $("#selectCDType option:selected").val();
    let person = $("#addCDPerson").val();
    let dueDate = $("#addCDDate").val() || "";

    if (dueDate === "") {
      bootbox.alert("Please Select a DueDate");
      return;
    }
    let url = window.location.origin + "/addCDTransaction";
    $("body").addClass("wait");
    $("#navLoading").addClass("loading");
    $.ajax({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        amount: amount,
        transactionType: transactionType,
        person: person,
        note: note,
        dueDate: dueDate,
      },
      beforeSend: function () {
        addLoading();
      },
      success: function (response) {
        bootbox.alert(JSON.stringify(response));
        clearField();
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

});

function getCurrentDate(datedelimiter) {
  var now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + datedelimiter + month + datedelimiter + day;
  return today;
}
