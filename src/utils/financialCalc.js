import xirr from "xirr";

export const calculateFinancials = (transactions, currentNav) => {
  let unitsHeld = 0;
  let investedAmount = 0;
  const cashFlows = [];

  transactions.forEach((txn) => {
    if (txn.type === "PURCHASE") {
      investedAmount += txn.amount;
      unitsHeld += txn.units;
      cashFlows.push({
        amount: -Math.abs(txn.amount),
        when: new Date(txn.date),
      });
    } else if (txn.type === "REDEMPTION") {
      unitsHeld -= txn.units;
      cashFlows.push({
        amount: Math.abs(txn.amount),
        when: new Date(txn.date),
      });
    }
  });

  const currentValue = unitsHeld * currentNav;
  const gainLoss = currentValue - investedAmount;
  const absoluteReturn =
    investedAmount > 0 ? (gainLoss / investedAmount) * 100 : 0;

  if (currentValue > 0) {
    cashFlows.push({ amount: currentValue, when: new Date() });
  }

  let calculatedXirr = 0;
  try {
    if (cashFlows.length > 1) {
      calculatedXirr = xirr(cashFlows) * 100;
    }
  } catch (error) {
    calculatedXirr = 0; // Fallback for zero or highly irregular cashflows
  }

  return {
    investedAmount,
    currentValue,
    gainLoss,
    absoluteReturn,
    calculatedXirr,
    unitsHeld,
  };
};
