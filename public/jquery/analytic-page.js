let chartData = {},
  currency = "$";
$(document).ready(function () {
  SetUpDate();
  fetchDataByFilter();
  function fetchData(url) {
    $.ajax({
      type: "GET",
      url: url + "&isChart=true",
      mimeType: "json",
      beforeSend: function () {
        addLoading();
      },
      success: function (response) {
        chartData = response;
        currency = response.currency;
        drawCharts();
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
  }

  $("#filter").submit(function (event) {
    event.preventDefault();
    fetchDataByFilter();
  });

  function drawCharts() {
    // var barOptions = {
    // chart: {
    // height: 350,
    // type: "bar",
    // redrawOnWindowResize: false,
    // zoom: {
    // enabled: false,
    // },
    // },
    // series: [
    // {
    // name: "amount",
    // data:
    // chartData.categoryData.length === 1
    // ? chartData.categoryData[0].totalAmountArray
    // : [],
    // },
    // ],
    // xaxis: {
    // categories:
    // chartData.categoryData.length === 1
    // ? chartData.categoryData[0].categoryArray
    // : [],
    // },
    // title: {
    // text: `category-amount ${currency}`,
    // align: "left",
    // },
    // tooltip: {
    // y: {
    // title: {
    // formatter: function () {
    // return currency;
    // },
    // },
    // },
    // },
    // noData: {
    // text: "No Data Available",
    // },
    // };

    var barOptions = {
      series: [
        {
          data:
            chartData.categoryData.length === 1
              ? chartData.categoryData[0].totalAmountArray
              : [],
        },
      ],
      chart: {
        type: "bar",
        height: 380,
        redrawOnWindowResize: false,
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom",
          },
        },
      },
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"],
        },
        formatter: function (val, opt) {
          return (
            opt.w.globals.labels[opt.dataPointIndex] + ":  " + currency + val
          );
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories:
          chartData.categoryData.length === 1
            ? chartData.categoryData[0].categoryArray
            : [],
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      title: {
        text: `category-amount ${currency}`,
        align: "left",
      },
      subtitle: {
        text: "Category Names as DataLabels inside bars",
        align: "left",
      },
      tooltip: {
        theme: "dark",
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return currency;
            },
          },
        },
      },
      noData: {
        text: "No Data Available",
      },
    };

    var pieOptions = {
      series:
        chartData.categoryData.length === 1
          ? chartData.categoryData[0].totalCountArray
          : [],
      chart: {
        type: "pie",
        height: 350,
        redrawOnWindowResize: false,
        zoom: {
          enabled: false,
        },
      },
      labels:
        chartData.categoryData.length === 1
          ? chartData.categoryData[0].categoryArray
          : [],
      title: {
        text: `Category-Number `,
        align: "left",
      },
      noData: {
        text: "No Data Available",
      },
    };
    var lineOptions = {
      series: [
        {
          name: "Expense",
          data:
            chartData.transactionData.length === 1
              ? chartData.transactionData[0].expenseSumArray
              : [],
        },
        {
          name: "Income",
          data:
            chartData.transactionData.length === 1
              ? chartData.transactionData[0].incomeSumArray
              : [],
        },
      ],
      chart: {
        height: 350,
        type: "line",
        redrawOnWindowResize: false,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [5, 5],
        curve: "straight",
      },
      title: {
        text: `Total Expense = ${
          chartData.transactionData.length === 1
            ? chartData.transactionData[0].expenseTotal
            : 0
        }${currency} Income = ${
          chartData.transactionData.length === 1
            ? chartData.transactionData[0].incomeTotal
            : 0
        }${currency} `,
        align: "left",
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return (
            val +
            " = " +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            currency
          );
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        categories:
          chartData.transactionData.length === 1
            ? chartData.transactionData[0].dateArray
            : [],
      },

      grid: {
        borderColor: "#f1f1f1",
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + currency;
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val + currency;
              },
            },
          },
        ],
      },
      noData: {
        text: "No Data Available",
      },
    };

    $("#linechart").empty();
    $("#chart").empty();
    $("#piechart").empty();
    new ApexCharts(document.querySelector("#linechart"), lineOptions).render();
    new ApexCharts(document.querySelector("#chart"), barOptions).render();
    new ApexCharts(document.querySelector("#piechart"), pieOptions).render();
  }

  function fetchDataByFilter() {
    let urlQuery = GetfilterQuery();
    if (urlQuery !== "") {
      let url = `${window.location.origin}/getTransaction?${urlQuery}`;
      fetchData(url);
    }
  }
});
