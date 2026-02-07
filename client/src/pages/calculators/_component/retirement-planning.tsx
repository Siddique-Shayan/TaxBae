import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CalculatorCard from "./CalculatorCard.tsx";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const PIE_COLORS = ["#4F46E5", "#10B981"]; // Savings vs Investments

const RetirementPlanningCalculator: React.FC = () => {
  // ---------- Input States ----------
  const [currentAge, setCurrentAge] = useState<number | "">("");
  const [retirementAge, setRetirementAge] = useState<number | "">("");
  const [currentSalary, setCurrentSalary] = useState<number | "">("");
  const [currentSavings, setCurrentSavings] = useState<number | "">("");
  const [expectedInflation, setExpectedInflation] = useState<number | "">(6);
  const [expectedReturn, setExpectedReturn] = useState<number | "">(12);
  const [retirementExpenseRatio, setRetirementExpenseRatio] =
    useState<number | "">(0.8);

  // ---------- Result State ----------
  const [result, setResult] = useState<null | {
    yearsToRetirement: number;
    requiredCorpus: number;
    monthlyInvestmentNeeded: number;
    totalInvestmentNeeded: number;
    monthlyExpenseAtRetirement: number;
    yearlyData: { year: number; corpus: number; neededCorpus: number }[];
    pieData: { name: string; value: number }[];
  }>(null);

  // ---------- Calculate Handler ----------
  const calculateRetirementPlan = () => {
    if (!currentAge || !retirementAge || !currentSalary) return;

    const ageNow = currentAge as number;
    const ageRetire = retirementAge as number;
    const salary = currentSalary as number;
    const savingsNow = currentSavings ? (currentSavings as number) : 0;

    const inflation = (expectedInflation as number) / 100;
    const returns = (expectedReturn as number) / 100;
    const ratio = retirementExpenseRatio as number;

    const yearsToRetirement = ageRetire - ageNow;
    if (yearsToRetirement <= 0) return;

    // Monthly expense today
    const monthlyExpenseToday = (salary / 12) * ratio;

    // Inflate expense till retirement
    const monthlyExpenseAtRetirement =
      monthlyExpenseToday * Math.pow(1 + inflation, yearsToRetirement);

    // Required corpus (25x yearly expenses rule)
    const yearlyExpenseAtRetirement = monthlyExpenseAtRetirement * 12;
    const requiredCorpus = yearlyExpenseAtRetirement * 25;

    // SIP math
    const months = yearsToRetirement * 12;
    const monthlyRate = returns / 12;

    const futureValueSavings =
      savingsNow * Math.pow(1 + monthlyRate, months);

    const factor =
      monthlyRate === 0
        ? months
        : ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate);

    const corpusNeededFromSIP = Math.max(
      requiredCorpus - futureValueSavings,
      0
    );

    const monthlyInvestmentNeeded =
      factor === 0 ? 0 : corpusNeededFromSIP / factor;

    const totalInvestmentNeeded =
      monthlyInvestmentNeeded * months + savingsNow;

    // Yearly projection
    const yearlyData: {
      year: number;
      corpus: number;
      neededCorpus: number;
    }[] = [];

    let corpus = savingsNow;

    for (let y = 1; y <= yearsToRetirement; y++) {
      for (let m = 1; m <= 12; m++) {
        corpus = corpus * (1 + monthlyRate) + monthlyInvestmentNeeded;
      }

      yearlyData.push({
        year: y,
        corpus: parseFloat(corpus.toFixed(2)),
        neededCorpus: parseFloat(requiredCorpus.toFixed(2)),
      });
    }

    const pieData = [
      {
        name: "Covered by Current Savings",
        value: Math.min(futureValueSavings, requiredCorpus),
      },
      {
        name: "To be Funded via Investments",
        value: Math.max(requiredCorpus - futureValueSavings, 0),
      },
    ];

    setResult({
      yearsToRetirement,
      requiredCorpus: parseFloat(requiredCorpus.toFixed(2)),
      monthlyInvestmentNeeded: parseFloat(
        monthlyInvestmentNeeded.toFixed(2)
      ),
      totalInvestmentNeeded: parseFloat(totalInvestmentNeeded.toFixed(2)),
      monthlyExpenseAtRetirement: parseFloat(
        monthlyExpenseAtRetirement.toFixed(2)
      ),
      yearlyData,
      pieData,
    });
  };

  return (
    <CalculatorCard
      title="Retirement Planning Calculator"
      onCalculate={calculateRetirementPlan}
      showResults={!!result}
    >
      {/* ---------------- Inputs ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="input"
          placeholder="Current Age"
          type="number"
          value={currentAge}
          onChange={(e) =>
            setCurrentAge(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          className="input"
          placeholder="Retirement Age"
          type="number"
          value={retirementAge}
          onChange={(e) =>
            setRetirementAge(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="input"
          placeholder="Current Annual Salary (₹)"
          type="number"
          value={currentSalary}
          onChange={(e) =>
            setCurrentSalary(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="input"
          placeholder="Current Savings (₹)"
          type="number"
          value={currentSavings}
          onChange={(e) =>
            setCurrentSavings(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="input"
          placeholder="Expected Inflation (%)"
          type="number"
          value={expectedInflation}
          onChange={(e) =>
            setExpectedInflation(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="input"
          placeholder="Expected Return (%)"
          type="number"
          value={expectedReturn}
          onChange={(e) =>
            setExpectedReturn(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="input"
          placeholder="Retirement Expense Ratio (e.g. 0.8)"
          type="number"
          step="0.01"
          value={retirementExpenseRatio}
          onChange={(e) =>
            setRetirementExpenseRatio(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
      </div>

      {/* ---------------- Results ---------------- */}
      {result && (
        <>
          {/* Summary */}
          <div className="bg-muted rounded-lg p-4 grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Years to Retirement</p>
              <p className="text-lg font-semibold">
                {result.yearsToRetirement}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Required Corpus</p>
              <p className="text-lg font-semibold text-indigo-600">
                ₹{formatCurrency(result.requiredCorpus)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Monthly Investment Needed
              </p>
              <p className="text-lg font-semibold text-emerald-600">
                ₹{formatCurrency(result.monthlyInvestmentNeeded)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Investment</p>
              <p className="text-lg font-semibold">
                ₹{formatCurrency(result.totalInvestmentNeeded)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Monthly Expense at Retirement
              </p>
              <p className="text-lg font-semibold text-amber-600">
                ₹{formatCurrency(result.monthlyExpenseAtRetirement)}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-72 bg-muted rounded-xl p-4">
              <h4 className="text-center font-semibold mb-2">
                Corpus Coverage Breakdown
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={result.pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label={({ name, value }) =>
                      `${name}: ₹${formatCurrency(value)}`
                    }
                  >
                    {result.pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="h-72 bg-muted rounded-xl p-4">
              <h4 className="text-center font-semibold mb-2">
                Projected Corpus vs Required Corpus
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.yearlyData}>
                  <XAxis dataKey="year" tickFormatter={(v) => `Year ${v}`} />
                  <YAxis
                    tickFormatter={(v) =>
                      `${(v / 100000).toFixed(0)}L`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      `₹${formatCurrency(value)}`
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="corpus"
                    name="Projected Corpus"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="neededCorpus"
                    name="Required Corpus"
                    stroke="#F97316"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </CalculatorCard>
  );
};

export default RetirementPlanningCalculator;
