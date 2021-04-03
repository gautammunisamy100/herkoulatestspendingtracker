$(document).ready(function () {
  SetUpDate();
  GetDataByFilter();

  function loadTable(url) {
    $("body").addClass("wait");
    $.ajax({
      type: "GET",
      url: url,
      mimeType: "json",
      success: function (response) {
        let currency = response.currency;
        $("#transactionTable").DataTable({
          ordering: true,
          data: response.data,
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
                if (data === "Expense") {
                  $(td).css("color", "Red");
                } else {
                  $(td).css("color", "Green");
                }
              },
            },
            { data: "date" },
            {
              data: "amount",
              mRender: function (data) {
                return `<span>${data}  ${currency}</span>`;
              },
            },
            { data: "category" },
            { data: "note" },
            {
              data: "_id",
              mRender: function (data) {
                return `<a id= ${data} href="#" class="editor_remove" >Delete</a>`;
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
        $("body").removeClass("wait");
      },
    });
  }

  $("#transactionTable").on("click", "a.editor_remove", function (e) {
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
      let url = `${window.location.origin}/getTransaction?${filterquery}`;
      loadTable(url);
    }
  }

  function deleteTransactionByID(id = "") {
    let url = window.location.origin + `/deleteTransaction?id=${id}`;
    var result = true;
    $("body").addClass("wait");
    $.ajax({
      method: "DELETE",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (response) {
        bootbox.alert(JSON.stringify(response));
        GetDataByFilter();
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
        $("body").removeClass("wait");
      },
    });
    return result;
  }
});
