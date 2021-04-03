const mongoose = require("mongoose");

const TransactionsSchema = mongoose.Schema({
  userId: { type: String, required: true },
  transactionType: {
    type: String,
    required: true,
    enum: ["Expense", "Income"],
  },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  note: { type: String },
});

const Transactions = mongoose.model("Transactions", TransactionsSchema);

module.exports = Transactions;
