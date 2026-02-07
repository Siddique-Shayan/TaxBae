interface CalculatorCardProps {
  title: string;
  onCalculate: () => void;
  showResults: boolean;
  children: React.ReactNode;
}

const CalculatorCard = ({
  title,
  onCalculate,
  showResults,
  children,
}: CalculatorCardProps) => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-card border border-border rounded-2xl shadow-sm">
      <div className="px-6 pt-6">
        <h3 className="text-2xl font-semibold text-center text-foreground">
          {title}
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {children}

        <button
          onClick={onCalculate}
          className="w-full h-11 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition"
        >
          Calculate
        </button>

        {showResults && <div className="border-t border-border pt-6" />}
      </div>
    </div>
  );
};

export default CalculatorCard;
