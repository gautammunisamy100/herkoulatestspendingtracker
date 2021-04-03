const Transaction = require("../models/transaction-model");
const userPreferenceService = require("./user-preference-service");
const datefunction = require("./date-service");

module.exports = {
  createTransaction: async function (parameter) {
    let errormessage = "";
    if ("" === parameter.userId) errormessage += `UserId is needed.\n`;
    if ("" === parameter.category) errormessage += `category is needed.\n`;
    if ("" === parameter.transactionType)
      errormessage += `transactionType is needed.\n`;
    if (isNaN(parameter.amount)) {
      errormessage += `amount tpe is not a number.\n`;
    } else if (parseInt(parameter.amount) <= 0) {
      errormessage += `amount should be greater than zero.\n`;
    }
    if (!datefunction.isValidDate(parameter.date)) {
      errormessage += `date is not valid.\n`;
    }
    if ("" === errormessage) {
      const newTransaction = new Transaction({
        userId: parameter.userId,
        transactionType: parameter.transactionType,
        category: parameter.category,
        amount: parameter.amount,
        note: parameter.note,
        date: datefunction.addDay(parameter.date, 0),
      });
      await newTransaction.save();
      return true;
    }
    throw { status: 400, message: errormessage };
  },
  getTransactionDataForCharts: async function (findquery, userId) {
    const transactionChartAggregate = await Transaction.aggregate([
      {
        $match: findquery,
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },
          expenseSum: {
            $sum: {
              $cond: [{ $eq: ["$transactionType", "Expense"] }, "$amount", 0],
            },
          },
          incomeSum: {
            $sum: {
              $cond: [{ $eq: ["$transactionType", "Income"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $group: {
          _id: null,
          dateArray: { $push: "$_id" },
          expenseSumArray: { $push: "$expenseSum" },
          incomeSumArray: { $push: "$incomeSum" },
          expenseTotal: { $sum: "$expenseSum" },
          incomeTotal: { $sum: "$incomeSum" },
        },
      },
    ]);

    const categoryChartAggregate = await Transaction.aggregate([
      {
        $match: findquery,
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $group: {
          _id: null,
          categoryArray: { $push: "$_id" },
          totalAmountArray: { $push: "$totalAmount" },
          totalCountArray: { $push: "$count" },
        },
      },
    ]);
    const currency = await userPreferenceService.getUserCurrency(userId);
    const result = {
      transactionData: transactionChartAggregate,
      categoryData: categoryChartAggregate,
      currency: currency,
    };
    return result;
  },
  getTransaction: async function (findquery, userId, limit = 1000, skip = 0) {
    const transactionRecord = await Transaction.aggregate([
      {
        $match: findquery,
      },
      { $unset: ["userId", "__v"] },
      {
        $set: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },
        },
      },
      {
        $limit: limit,
      },
      {
        $skip: skip,
      },
      {
        $sort: { date: 1 },
      },
    ]);
    const count = await Transaction.find(findquery).countDocuments();
    const currency = await userPreferenceService.getUserCurrency(userId);
    const result = {
      count: count,
      data: transactionRecord,
      currency: currency,
    };
    return result;
  },
  deletTransaction: async function (id) {
    var ObjectId = require("mongodb").ObjectID;
    await Transaction.findByIdAndDelete({ _id: ObjectId(id) });
    return true;
  },
};
