const transactionService = require("../service/transaction-service.js");
const sanitizer = require("sanitizer");
const asyncHandler = require("express-async-handler");
const dateService = require("../service/date-service");

module.exports = {
  addTransaction: asyncHandler(async function (req, res) {
    let parameter = {
      category: sanitizer.escape(req.body.category) || "",
      amount: sanitizer.escape(req.body.amount) || "",
      transactionType: sanitizer.escape(req.body.transactionType) || "",
      note: sanitizer.escape(req.body.note) || "",
      date: sanitizer.escape(req.body.date) || "",
      userId: req.userId || "",
    };

    await transactionService.createTransaction(parameter);
    return res.status(201).send("Transaction Add Successfully");
  }),
  getTransaction: asyncHandler(async function (req, res) {
    const category = sanitizer.escape(req.query.category) || "";
    const amount = parseInt(req.query.amount) || 0;
    let startDate =
      dateService.addDay(sanitizer.escape(req.query.startDate), 0) || Date.now;
    let endDate =
      dateService.addDay(sanitizer.escape(req.query.endDate), 1) || Date.now;
    const transactionType = sanitizer.escape(req.query.transactionType) || "";
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 3000;
    const isChart = sanitizer.escape(req.query.isChart) || "false";
    const userId = req.userId || "";
    let findquery = new Object({ userId: userId });
    if ("" !== transactionType) {
      findquery = Object.assign(findquery, {
        transactionType: transactionType,
      });
    }
    if ("" !== category) {
      findquery = Object.assign(findquery, { category: category });
    }
    if (amount !== 0.0) {
      findquery = Object.assign(findquery, { amount: amount });
    }
    if ("" !== startDate && "" !== endDate) {
      findquery = Object.assign(findquery, {
        date: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      });
    }
    if (isChart === "false") {
      const transactionRecord = await transactionService.getTransaction(
        findquery,
        userId,
        limit,
        skip
      );
      return res.status(200).json(transactionRecord);
    } else {
      const chartRecord = await transactionService.getTransactionDataForCharts(
        findquery,
        userId
      );
      return res.status(200).json(chartRecord);
    }
  }),
  deleteTransaction: asyncHandler(async function (req, res) {
    const id = sanitizer.escape(req.query.id) || "";
    await transactionService.deletTransaction(id);
    return res.status(200).send("deleted");
  }),
};
