const CDTransaction = require("../models/cdTransaction-model");
const userPreferenceService = require("./user-preference-service");
const datefunction = require("./date-service");

module.exports = {
  createCDTransaction: async function (parameter) {
    let errormessage = "";
    if ("" === parameter.userId) errormessage += `UserId is needed.\n`;
    if ("" === parameter.person) errormessage += `person is needed.`;
    if ("" === parameter.transactionType)
      errormessage += `transactionType is needed.\n`;
    if (isNaN(parameter.amount)) {
      errormessage += `amount tpe is not a number.\n`;
    } else if (parseInt(parameter.amount) <= 0) {
      errormessage += `amount should be greater than zero.\n`;
    }
    if (!datefunction.isValidDate(parameter.dueDate)) {
      errormessage += `dueDate is not valid.\n`;
    }
    if ("" === errormessage) {
      const newCDTransaction = new CDTransaction({
        userId: parameter.userId,
        transactionType: parameter.transactionType,
        person: parameter.person,
        amount: parameter.amount,
        note: parameter.note,
        dueDate: datefunction.addDay(parameter.dueDate, 0),
      });
      await newCDTransaction.save();
      return true;
    }
    throw { status: 400, message: errormessage };
  },
  getCDTransaction: async function (findquery, userId) {
    const CDTransactionRecord = await CDTransaction.aggregate([
      {
        $match: findquery,
      },
      { $unset: ["userId", "__v", "createdDate"] },
      {
        $set: {
          dueDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$dueDate",
            },
          },
        },
      },
      {
        $sort: { dueDate: 1 },
      },
    ]);
    const currency = await userPreferenceService.getUserCurrency(userId);
    const result = {
      cdTransactionData: CDTransactionRecord,
      currency: currency,
    };
    return result;
  },
  deletCDTransaction: async function (id) {
    var ObjectId = require("mongodb").ObjectID;
    await CDTransaction.findByIdAndDelete({ _id: ObjectId(id) });
    return true;
  },
  updateCDTransaction: async function (id, updateStatement) {
    var ObjectId = require("mongodb").ObjectID;
    await CDTransaction.findByIdAndUpdate(
      { _id: ObjectId(id) },
      updateStatement,
      {
        upsert: true,
        safe: true,
      }
    ).exec();
    return true;
  },
};
