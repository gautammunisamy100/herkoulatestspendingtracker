$(document).ready(function () {
  SetUpDate();
  GetDataByFilter();
  function loadTable(url) {
    $.ajax({
      type: "GET",
      url: url,
      mimeType: "json",
      beforeSend: function () {
        addLoading();
      },
      success: function (response) {
        let currency = response.currency;
        $("#cdTransactionTable").DataTable({
          ordering: true,
          data: response.cdTransactionData,
          searching: true,
          stateSave: true,
          bDestroy: true,
          scrollX: true,
          autoWidth: true,
          deferRender: true,
          order: [[3, "asc"]],
          dom: "Blfrtip",
          buttons: [
            {
              extend: "copyHtml5",
              text: `<button class ="btn btn-sm"> Copy </button>`,
              titleAttr: "Copy",
            },
            {
              extend: "csvHtml5",
              text: `<button class ="btn btn-sm"> CSV </button>`,
              titleAttr: "Csv",
            },
          ],
          columns: [
            {
              data: "transactionType",
              fnCreatedCell: function (td, data) {
                if (data === "Credit") {
                  $(td).css("color", "Green");
                } else {
                  $(td).css("color", "Red");
                }
              },
            },
            {
              data: "amount",
              mRender: function (data) {
                return `<span>${data}  ${currency}</span>`;
              },
            },
            { data: "person" },
            { data: "dueDate" },
            { data: "note" },
            { data: "status" },
            {
              data: {
                _id: "_id",
                editable: "editable",
                transactionType: "transactionType",
              },
              mRender: function (data, type, full) {
                if (data.editable === true) {
                  return `<a id=${
                    data._id + "|" + data.transactionType
                  } href="#" class="editor_status" >Edit</a> ||
                 <a id= ${data._id} href="#" class="editor_delete">Delete</a>`;
                } else {
                  return "";
                }
              },
            },
          ],
        });
      },
      error: function (response) {
        if (response.status === 401) {
          window.location.href = window.location.origin + "/authpage";
        } else {
          bootbox.alert("Failed To Load!");
        }
      },
      complete: function () {
        removeLoading();
      },
    });
  }

  $("#cdTransactionTable").on("click", "a.editor_status", function (e) {
    e.preventDefault();
    let id = $(this).attr("id");
    let idArray = id.split("|");
    var formHtml = `<form id='edit_form' action=''>`;
    if (idArray[1] === "Debt") {
      formHtml += `<h4>Edit Debit</h4> <label>Select Debt Payment Status </label>`;
    } else {
      formHtml += `<h4>Edit Credit</h4> <label>Select Credit Payment Status </label>`;
    }
    formHtml += `
     <select name="type" id="selectStatus" class="custom-select">
     <option value="Pending">Pending</option> `;
    if (idArray[1] === "Debt") {
      formHtml += `<option value="Payed">Payed</option>`;
    } else {
      formHtml += `<option value="Recieved">Recieved</option>`;
    }
    formHtml += ` </select>
     <label>Make Changes Permanent!!  </label>
     <input id="permanentRecord" type="checkbox" value="permanentRecord" name="permanent" >
     </form>`;
    var form = $(formHtml);
    bootbox.confirm(form, function (result) {
      if (result) {
        let status = $("#selectStatus option:selected").val() || "";
        var permanent = !$("#permanentRecord").prop("checked");
        console.log(status + permanent);
        if (status) {
          updateCDTransaction(idArray[0], status, permanent);
        }
      }
    });
  });

  $("#cdTransactionTable").on("click", "a.editor_delete", function (e) {
    e.preventDefault();
    let id = $(this).attr("id");
    bootbox.confirm("Do you want Delete?", function (result) {
      if (result === true && deleteTransactionByID(id)) {
        GetDataByFilter();
      }
    });
  });

  $("#filter").submit(function (event) {
    event.preventDefault();
    GetDataByFilter();
  });

  function GetDataByFilter() {
    let filterquery = GetfilterQuery();
    if ("" !== filterquery) {
      let url = `${window.location.origin}/getCDTransaction?${filterquery}`;
      loadTable(url);
    }
  }

  function updateCDTransaction(id = "", status = "Pending", permanent = false) {
    let url = window.location.origin + "/updateCDTransaction";
    $("body").addClass("wait");
    $("#navLoading").addClass("loading");
    $.ajax({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        id: id,
        status: status,
        editable: permanent,
      },
      beforeSend: function () {
        addLoading();
      },
      success: function () {
        bootbox.alert("Updated Successfully");
        GetDataByFilter();
      },
      error: function (response) {
        if (response.status === 401) {
          window.location.href = window.location.origin + "/authpage";
        } else {
          bootbox.alert("Internal Error");
        }
      },
      complete: function () {
        removeLoading();
      },
    });
  }

  function deleteTransactionByID(id = "") {
    let url = window.location.origin + `/deleteCDTransaction?id=${id}`;
    var result = true;
    $.ajax({
      method: "DELETE",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      beforeSend: function () {
        addLoading();
      },
      success: function () {
        bootbox.alert("Deleted Successfully");
      },
      error: function (response) {
        if (response.status === 401) {
          window.location.href = window.location.origin + "/authpage";
        } else {
          bootbox.alert("Server Error!! Failed to Delete");
        }
        result = false;
      },
      complete: function () {
        removeLoading();
      },
    });
    return result;
  }
});
