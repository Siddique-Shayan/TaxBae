const CalculatorSummary = ({ activeCalculator, setActiveCalculator }) => {
  const calculators = [
    { id: "emi", label: "EMI" },
    { id: "sip", label: "SIP" },
    { id: "rent-vs-buy", label: "Rent vs Buy" },
    { id: "goal", label: "Goal Planner" },
    { id: "tax", label: "Tax Benefits" },
    { id: "retirement", label: "Retirement" },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {calculators.map((calc) => (
        <button
          key={calc.id}
          onClick={() => setActiveCalculator(calc.id)}
          className={`px-5 py-2 rounded-full border text-sm font-semibold transition
            ${
              activeCalculator === calc.id
                ? "bg-primary text-white border-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
        >
          {calc.label}
        </button>
      ))}
    </div>
  );
};

export default CalculatorSummary;
