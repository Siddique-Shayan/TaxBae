import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import CalculatorCard from "./CalculatorCard.tsx";

const CURRENCY_LOCALE = "en-IN";
const COLORS = ["#3B82F6", "#10B981"]; // Invested, Returns

const formatCurrency = (value: number) =>
  value.toLocaleString(CURRENCY_LOCALE, {
    maximumFractionDigits: 0,
  });

const GoalPlannerCalculator: React.FC = () => {
  // ---------- Input States ----------
  const [goalAmount, setGoalAmount] = useState<number | "">("");
  const [timeInYears, setTimeInYears] = useState<number | "">("");
  const [expectedReturn, setExpectedReturn] = useState<number | "">("");

  // ---------- Result State ----------
  const [result, setResult] = useState<null | {
    monthlyInvestment: number;
    totalInvestment: number;
    returns: number;
    yearlyData: { year: number; value: number; invested: number }[];
  }>(null);

  // ---------- Calculate Handler ----------
  const calculateGoalPlan = () => {
    if (!goalAmount || !timeInYears || !expectedReturn) return;

    const target = goalAmount as number;
    const years = timeInYears as number;
    const annualRate = expectedReturn as number;

    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;

    // Reverse SIP Formula
    const factor =
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const monthlyInvestment = target / factor;
    const totalInvestment = monthlyInvestment * months;
    const returns = target - totalInvestment;

    // Yearly projection
    const yearlyData: { year: number; value: number; invested: number }[] = [];
    let amount = 0;
    let invested = 0;

    for (let m = 1; m <= months; m++) {
      amount = amount * (1 + monthlyRate) + monthlyInvestment;
      invested += monthlyInvestment;

      if (m % 12 === 0) {
        yearlyData.push({
          year: m / 12,
          value: parseFloat(amount.toFixed(2)),
          invested: parseFloat(invested.toFixed(2)),
        });
      }
    }

    setResult({
      monthlyInvestment: parseFloat(monthlyInvestment.toFixed(2)),
      totalInvestment: parseFloat(totalInvestment.toFixed(2)),
      returns: parseFloat(returns.toFixed(2)),
      yearlyData,
    });
  };

  const compositionData =
    result !== null
      ? [
          { name: "Total Investment", value: result.totalInvestment },
          { name: "Returns", value: result.returns },
        ]
      : [];

  return (
    <CalculatorCard
      title="Goal Planner"
      onCalculate={calculateGoalPlan}
      showResults={!!result}
    >
      {/* ---------------- Inputs ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="input"
          placeholder="Target Amount (₹)"
          type="number"
          value={goalAmount}
          onChange={(e) =>
            setGoalAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        <input
          className="input"
          placeholder="Time to Goal (Years)"
          type="number"
          value={timeInYears}
          onChange={(e) =>
            setTimeInYears(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        <input
          className="input"
          placeholder="Expected Annual Return (%)"
          type="number"
          value={expectedReturn}
          onChange={(e) =>
            setExpectedReturn(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
      </div>

      {/* ---------------- Results ---------------- */}
      {result && (
        <>
          {/* Summary */}
          <div className="bg-muted rounded-lg p-4 text-center space-y-1">
            <p className="text-xl font-semibold text-foreground">
              Monthly Investment Required: ₹
              {formatCurrency(result.monthlyInvestment)}
            </p>
            <p className="text-muted-foreground">
              Total Investment: ₹{formatCurrency(result.totalInvestment)}
            </p>
            <p className="text-emerald-600 font-semibold">
              Expected Returns: ₹{formatCurrency(result.returns)}
            </p>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-72 bg-muted rounded-xl p-4">
              <h4 className="text-center font-semibold mb-2">
                Goal Amount Composition
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={compositionData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label={({ name, value }) =>
                      `${name}: ₹${formatCurrency(value)}`
                    }
                  >
                    {compositionData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) =>
                      `₹${formatCurrency(value)}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="h-72 bg-muted rounded-xl p-4">
              <h4 className="text-center font-semibold mb-2">
                Projected Growth
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
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="invested"
                    name="Total Invested"
                    stroke={COLORS[0]}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Portfolio Value"
                    stroke={COLORS[1]}
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

export default GoalPlannerCalculator;
