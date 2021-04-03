const asyncHandler = require("express-async-handler");
const cdTransactionService = require("../service/cdTransaction-service");
const sanitizer = require("sanitizer");
const dateService = require("../service/date-service");

module.exports = {
  addCDTransaction: asyncHandler(async function (req, res) {
    console.log("in");
    let parameter = {
      person: sanitizer.escape(req.body.person) || "",
      amount: sanitizer.escape(req.body.amount) || "",
      transactionType: sanitizer.escape(req.body.transactionType) || "",
      note: sanitizer.escape(req.body.note) || "",
      dueDate: sanitizer.escape(req.body.dueDate) || "",
      userId: req.userId || "",
    };
    console.log(parameter);

    await cdTransactionService.createCDTransaction(parameter);
    return res.status(201).send("Transaction Add Successfully");
  }),
  getCDTransaction: async function (req, res) {
    let startDate =
      dateService.addDay(sanitizer.escape(req.query.startDate), 0) || Date.now;
    let endDate =
      dateService.addDay(sanitizer.escape(req.query.endDate), 1) || Date.now;
    const userId = req.userId || "";
    let findquery = new Object({ userId: userId });
    if ("" !== startDate && "" !== endDate) {
      findquery = Object.assign(findquery, {
        dueDate: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      });
    }

    const dataResult = await cdTransactionService.getCDTransaction(
      findquery,
      userId
    );

    return res.status(200).json(dataResult);
  },
  deleteCDTransaction: asyncHandler(async function (req, res) {
    const id = sanitizer.escape(req.query.id) || "";
    await cdTransactionService.deletCDTransaction(id);
    return res.status(200).send("deleted");
  }),
  updateCDTransaction: async function (req, res) {
    const id = sanitizer.escape(req.body.id) || "";
    const status = sanitizer.escape(req.body.status) || "Pending";
    const editable = sanitizer.escape(req.body.editable) || true;
    await cdTransactionService.updateCDTransaction(id, {
      status: status,
      editable: editable,
    });
    return res.status(200).send("update");
  },
};
