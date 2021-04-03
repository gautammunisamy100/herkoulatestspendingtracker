const mongoose = require("mongoose");

const CDTransactionsSchema = mongoose.Schema({
  userId: { type: String, required: true },
  transactionType: {
    type: String,
    required: true,
    enum: ["Credit", "Debt"],
  },
  person: { type: String, required: true },
  amount: { type: Number, required: true },
  createdDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true },
  note: { type: String },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Recieved", "Payed"],
    default: "Pending",
  },
  editable: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const CDTransactions = mongoose.model("CDTransactions", CDTransactionsSchema);

module.exports = CDTransactions;
