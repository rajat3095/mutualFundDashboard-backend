import xirr from "xirr";

export const calculateFinancials = (transactions) => {
  // 1. Group transactions by Scheme and Folio
  const groupedData = transactions.reduce((acc, txn) => {
    const key = `${txn.schemeName}_${txn.folioNumber}`;

    if (!acc[key]) {
      acc[key] = {
        scheme: txn.schemeName,
        folio: txn.folioNumber,
        currentNav: txn.currentNav,
        transactions: [],
      };
    }
    acc[key].transactions.push(txn);
    return acc;
  }, {});

  // 2. Calculate financials for each grouped scheme/folio
  const schemeDetails = Object.values(groupedData).map((group) => {
    let unitsHeld = 0;
    let investedAmount = 0;
    const cashFlows = [];

    // Sort transactions chronologically to ensure accurate running balances
    const sortedTxns = group.transactions.sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    sortedTxns.forEach((txn) => {
      if (txn.type === "PURCHASE") {
        investedAmount += txn.amount;
        unitsHeld += txn.units;

        cashFlows.push({
          amount: -Math.abs(txn.amount),
          when: new Date(txn.date),
        });
      } else if (txn.type === "REDEMPTION") {
        // Calculate the proportional original cost of the units being redeemed
        const averageCostPerUnit =
          unitsHeld > 0 ? investedAmount / unitsHeld : 0;
        const costOfRedeemedUnits = averageCostPerUnit * txn.units;

        // Reduce the invested amount by the original cost, NOT the market value withdrawal
        investedAmount -= costOfRedeemedUnits;
        unitsHeld -= txn.units;

        cashFlows.push({
          amount: Math.abs(txn.amount),
          when: new Date(txn.date),
        });
      }
    });

    // Ensure we don't end up with floating point weirdness if units hit zero
    if (unitsHeld <= 0.001) {
      investedAmount = 0;
      unitsHeld = 0;
    }

    const currentValue = unitsHeld * group.currentNav;
    const gainLoss = currentValue - investedAmount;
    const avgPurchaseNav = investedAmount > 0 ? investedAmount / unitsHeld : 0;
    const absoluteReturn =
      investedAmount > 0 ? (gainLoss / investedAmount) * 100 : 0;

    if (currentValue > 0) {
      cashFlows.push({ amount: currentValue, when: new Date() });
    }

    let calculatedXirr = 0;
    try {
      const hasNegative = cashFlows.some((cf) => cf.amount < 0);
      const hasPositive = cashFlows.some((cf) => cf.amount > 0);

      if (cashFlows.length > 1 && hasNegative && hasPositive) {
        calculatedXirr = xirr(cashFlows) * 100;
      }
    } catch (error) {
      calculatedXirr = 0;
    }

    return {
      scheme: group.scheme,
      folio: group.folio,
      currentNav: group.currentNav,
      investedAmount,
      currentValue,
      gainLoss,
      absoluteReturn,
      avgPurchaseNav,
      calculatedXirr,
      unitsHeld,
    };
  });

  // 3. Calculate Overall Portfolio Totals
  const portfolioSummary = schemeDetails.reduce(
    (acc, curr) => {
      acc.totalInvestedAmount += curr.investedAmount;
      acc.totalCurrentValue += curr.currentValue;
      return acc;
    },
    { totalInvestedAmount: 0, totalCurrentValue: 0 },
  );

  portfolioSummary.totalGainLoss =
    portfolioSummary.totalCurrentValue - portfolioSummary.totalInvestedAmount;

  portfolioSummary.totalAbsoluteReturn =
    portfolioSummary.totalInvestedAmount > 0
      ? (portfolioSummary.totalGainLoss /
          portfolioSummary.totalInvestedAmount) *
        100
      : 0;

  // 4. Calculate Overall Portfolio XIRR
  const overallCashFlows = [];

  transactions.forEach((txn) => {
    if (txn.type === "PURCHASE") {
      overallCashFlows.push({
        amount: -Math.abs(txn.amount),
        when: new Date(txn.date),
      });
    } else if (txn.type === "REDEMPTION") {
      overallCashFlows.push({
        amount: Math.abs(txn.amount),
        when: new Date(txn.date),
      });
    }
  });

  if (portfolioSummary.totalCurrentValue > 0) {
    overallCashFlows.push({
      amount: portfolioSummary.totalCurrentValue,
      when: new Date(),
    });
  }

  let totalCalculatedXirr = 0;
  try {
    const hasNegative = overallCashFlows.some((cf) => cf.amount < 0);
    const hasPositive = overallCashFlows.some((cf) => cf.amount > 0);

    if (overallCashFlows.length > 1 && hasNegative && hasPositive) {
      totalCalculatedXirr = xirr(overallCashFlows) * 100;
    }
  } catch (error) {
    totalCalculatedXirr = 0;
  }

  portfolioSummary.totalXirr = totalCalculatedXirr;

  return {
    schemeDetails,
    portfolioSummary,
  };
};

// import xirr from "xirr";

// export const calculateFinancials = (transactions, currentNav) => {
//   let unitsHeld = 0;
//   let investedAmount = 0;
//   const cashFlows = [];

//   transactions.forEach((txn) => {
//     if (txn.type === "PURCHASE") {
//       investedAmount += txn.amount;
//       unitsHeld += txn.units;
//       cashFlows.push({
//         amount: -Math.abs(txn.amount),
//         when: new Date(txn.date),
//       });
//     } else if (txn.type === "REDEMPTION") {
//       unitsHeld -= txn.units;
//       cashFlows.push({
//         amount: Math.abs(txn.amount),
//         when: new Date(txn.date),
//       });
//     }
//   });

//   const currentValue = unitsHeld * currentNav;
//   const gainLoss = currentValue - investedAmount;
//   const absoluteReturn =
//     investedAmount > 0 ? (gainLoss / investedAmount) * 100 : 0;

//   if (currentValue > 0) {
//     cashFlows.push({ amount: currentValue, when: new Date() });
//   }

//   let calculatedXirr = 0;
//   try {
//     if (cashFlows.length > 1) {
//       calculatedXirr = xirr(cashFlows) * 100;
//     }
//   } catch (error) {
//     calculatedXirr = 0; // Fallback for zero or highly irregular cashflows
//   }

//   return {
//     investedAmount,
//     currentValue,
//     gainLoss,
//     absoluteReturn,
//     calculatedXirr,
//     unitsHeld,
//   };
// };
