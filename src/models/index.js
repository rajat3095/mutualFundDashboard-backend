import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  folioNumber: { type: String, required: true },
  schemeName: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ["PURCHASE", "REDEMPTION"], required: true },
  amount: { type: Number, required: true },
  units: { type: Number, required: true },
  nav: { type: Number, required: true },
  currentNav: { type: Number, required: true },
});

const InvestorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  panNumber: { type: String, required: true, unique: true },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
});

export const Transaction = mongoose.model("Transaction", TransactionSchema);
export const Investor = mongoose.model("Investor", InvestorSchema);
