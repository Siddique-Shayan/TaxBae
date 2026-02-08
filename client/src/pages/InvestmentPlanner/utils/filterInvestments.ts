export type InvestmentFilters = {
  minAge: number | null;
  minExpectedReturn: number | null;
  minIncomeIndex: number | null;

  riskProfiles: string[];
  investmentPeriod: "Short" | "Long" | null;
};


export const DEFAULT_FILTERS: InvestmentFilters = {
  minAge: null,
  minExpectedReturn: null,
  minIncomeIndex: null,

  riskProfiles: [],
  investmentPeriod: null,
};


const INCOME_ORDER = [
  "0-2 Lakhs",
  "2-5 Lakhs",
  "5-10 Lakhs",
  "10-25 Lakhs",
  "25-50 Lakhs",
  "50 Lakhs-1 Crore",
  "1 Crore+",
];



export function applyInvestmentFilters(
  data: any[],
  filters: InvestmentFilters,
  search: string
) {
  return data.filter((item) => {
    // 🔍 Search
    if (
      search &&
      !(
        item.investmentOption.toLowerCase().includes(search.toLowerCase()) ||
        item.financialGoal.toLowerCase().includes(search.toLowerCase()) ||
        item.riskProfile.toLowerCase().includes(search.toLowerCase())
      )
    ) {
      return false;
    }

    // 🎂 Minimum Age
    if (filters.minAge !== null && item.age < filters.minAge) {
      return false;
    }

    // 📈 Minimum Expected Return
    if (
      filters.minExpectedReturn !== null &&
      item.expectedReturnPercent < filters.minExpectedReturn
    ) {
      return false;
    }

    // 💰 Minimum Income
    if (filters.minIncomeIndex !== null) {
      const itemIndex = INCOME_ORDER.indexOf(item.annualIncome);
      if (itemIndex < filters.minIncomeIndex) return false;
    }

    // ⚠️ Risk (multi)
    if (
      filters.riskProfiles.length &&
      !filters.riskProfiles.includes(item.riskProfile)
    ) {
      return false;
    }

    // ⏳ Period (radio)
    if (
      filters.investmentPeriod &&
      item.investmentPeriod !== filters.investmentPeriod
    ) {
      return false;
    }

    return true;
  });
}
