export function normalizeInvestments(rawData: any[]) {
  return rawData.map((item) => ({
    investorId: item.Investor_ID,
    age: Number(item.Age),
    riskProfile: item.Risk_Profile,
    financialGoal: item.Financial_Goal,
    annualIncome: item.Annual_Income,
    investmentHorizonYears: Number(item.Investment_Horizon_Years),
    investmentOption: item.Matched_Investment_Option,
    expectedReturnPercent: Number(item.Expected_Return_Percent),
    investmentPeriod: item.Investment_Period,
    otherInvestments: item.Other_Investments === "Yes",
  }));
}
