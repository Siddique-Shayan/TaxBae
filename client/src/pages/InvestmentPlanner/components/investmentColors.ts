export const investmentColorMap: Record<string, string> = {
  "PPF": "bg-blue-500 dark:bg-blue-400",
  "Fixed Deposit": "bg-green-500 dark:bg-green-400",
  "Balanced Mutual Fund": "bg-yellow-400 dark:bg-amber-400",
  "Equity Mutual Fund": "bg-purple-500 dark:bg-violet-400",
  "ELSS": "bg-red-500 dark:bg-rose-400",
};

export const getInvestmentColor = (name: string) => {
  return (
    investmentColorMap[name] ||
    "bg-gray-300 dark:bg-white"
  );
};
