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

const COLORS = ["#FACC15", "#16A34A"]; // Invested, Returns

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const SIPCalculator: React.FC = () => {
  // ---------- Input States ----------
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | "">("");
  const [annualReturn, setAnnualReturn] = useState<number | "">("");
  const [tenureYears, setTenureYears] = useState<number | "">("");
  const [stepUpPercentage, setStepUpPercentage] = useState<number | "">("");

  // ---------- Result State ----------
  const [result, setResult] = useState<null | {
    maturityAmount: number;
    investedAmount: number;
    returns: number;
    yearlyData: { year: number; value: number; invested: number }[];
  }>(null);

  // ---------- Calculate Handler ----------
  const calculateSIP = () => {
    if (!monthlyInvestment || !annualReturn || !tenureYears) return;

    const months = (tenureYears as number) * 12;
    const monthlyRate = (annualReturn as number) / 12 / 100;
    const stepUp = stepUpPercentage ? (stepUpPercentage as number) / 100 : 0;

    let amount = 0;
    let invested = 0;
    const yearlyData: { year: number; value: number; invested: number }[] = [];

    for (let m = 1; m <= months; m++) {
      const currentYear = Math.floor((m - 1) / 12);
      const currentMonthlyInvestment =
        (monthlyInvestment as number) * Math.pow(1 + stepUp, currentYear);

      amount = amount * (1 + monthlyRate) + currentMonthlyInvestment;
      invested += currentMonthlyInvestment;

      if (m % 12 === 0) {
        yearlyData.push({
          year: m / 12,
          value: parseFloat(amount.toFixed(2)),
          invested: parseFloat(invested.toFixed(2)),
        });
      }
    }

    const maturityAmount = parseFloat(amount.toFixed(2));
    const investedAmount = parseFloat(invested.toFixed(2));
    const returns = parseFloat(
      (maturityAmount - investedAmount).toFixed(2)
    );

    setResult({
      maturityAmount,
      investedAmount,
      returns,
      yearlyData,
    });
  };

  const compositionData =
    result !== null
      ? [
          { name: "Invested Amount", value: result.investedAmount },
          { name: "Returns", value: result.returns },
        ]
      : [];

  return (
    <CalculatorCard
      title="SIP Calculator"
      onCalculate={calculateSIP}
      showResults={!!result}
    >
      {/* ---------------- Inputs ---------------- */}
      <div className="grid grid-rows-3 gap-4">
        <input
          className="input"
          placeholder="Monthly Investment (₹)"
          type="number"
          value={monthlyInvestment}
          onChange={(e) =>
            setMonthlyInvestment(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />

        <input
          className="input"
          placeholder="Expected Annual Return (%)"
          type="number"
          value={annualReturn}
          onChange={(e) =>
            setAnnualReturn(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />

        <input
          className="input"
          placeholder="Investment Period (Years)"
          type="number"
          value={tenureYears}
          onChange={(e) =>
            setTenureYears(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />

        <input
          className="input"
          placeholder="Annual Step-up (%) – Optional"
          type="number"
          value={stepUpPercentage}
          onChange={(e) =>
            setStepUpPercentage(
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
              Maturity Amount: ₹{formatCurrency(result.maturityAmount)}
            </p>
            <p className="text-muted-foreground">
              Total Invested: ₹{formatCurrency(result.investedAmount)}
            </p>
            <p className="text-emerald-600 font-semibold">
              Total Returns: ₹{formatCurrency(result.returns)}
            </p>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-72 bg-muted rounded-xl p-4">
              <h4 className="text-center font-semibold mb-2">
                Investment Breakdown
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
                Portfolio Growth Over Time
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
                    name="Invested Amount"
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

export default SIPCalculator;
