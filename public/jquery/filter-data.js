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
  $("#selectTypeFilter").on("change", function () {
    let selectVal = $("#selectTypeFilter option:selected").val();
    options = `<option id=1 value=""> All </option>`;
    if (selectVal === "Expense") {
      $.each(expenseOptions, function (i, option) {
        options += `<option id=${i} value=${option}> ${option}</option>`;
      });
    } else if (selectVal === "Income") {
      $.each(incomeOptions, function (i, option) {
        options += `<option id=${i} value=${option}> ${option}</option>`;
      });
    }

    $("#selectCategoryFilter").empty().append(options);
  });
});

function SetUpDate() {
  $("#endDateFilter").val(getCurrentDate("-"));
  $("#startDateFilter").val(getCurrentDate("-"));
}

function GetfilterQuery() {
  let enddate = $("#endDateFilter").val().replaceAll("-", "/") || "";
  let startdate = $("#startDateFilter").val().replaceAll("-", "/") || "";
  let type = $("#selectTypeFilter option:selected").val() || "";
  let category = $("#selectCategoryFilter option:selected").val() || "";
  let filter = "";
  if ("" !== enddate && "" !== startdate) {
    var dateDifference = getDateDifference(startdate, enddate);
    if ("" === dateDifference) {
      if (type === "") {
        filter = `startDate=${startdate}&endDate=${enddate}`;
      } else {
        filter = `startDate=${startdate}&endDate=${enddate}&transactionType=${type}&category=${category}`;
      }
    } else {
      bootbox.alert(dateDifference);
    }
  } else {
    bootbox.alert("Please set StartDate and EndDate");
  }
  return filter;
}

function getCurrentDate(datedelimiter) {
  var now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + datedelimiter + month + datedelimiter + day;
  return today;
}
function getDateDifference(startdate, enddate) {
  let errormessage = "";
  const date1 = new Date(startdate);
  const date2 = new Date(enddate);
  const diffTime = date2 - date1;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (days < 0) {
    errormessage += `please select the Startdate less than Enddate`;
  }
  if (Math.abs(days) > 61) {
    errormessage += `Difference between date can not be more than 60 days`;
  }
  return errormessage;
}
