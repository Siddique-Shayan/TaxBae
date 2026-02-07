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

const COLORS = ["#2563EB", "#EF4444"];
const formatCurrency = (v: number) =>
  v.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState<number | "">("");
  const [interestRate, setInterestRate] = useState<number | "">("");
  const [tenureYears, setTenureYears] = useState<number | "">("");

  const [result, setResult] = useState<any>(null);

  const calculateEMI = () => {
    if (!loanAmount || !interestRate || !tenureYears) return;

    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    const emi =
      (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    let balance = P;
    const amortizationData = [];

    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principal = emi - interest;
      balance -= principal;

      amortizationData.push({
        month: i,
        balance: Math.max(balance, 0),
      });

      if (balance <= 0) break;
    }

    setResult({
      emi,
      totalAmount,
      totalInterest,
      pie: [
        { name: "Principal", value: P },
        { name: "Interest", value: totalInterest },
      ],
      amortizationData,
    });
  };

  return (
    <CalculatorCard
      title="EMI Calculator"
      onCalculate={calculateEMI}
      showResults={!!result}
    >
      {/* Inputs */}
      <div className="grid grid-rows-3 gap-4">
        <input
          className="input px-2 py-3 rounded-md"
          placeholder="Loan Amount (₹)"
          type="number"
          value={loanAmount}
          onChange={(e) =>
            setLoanAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          className="input px-2 py-3 rounded-md"
          placeholder="Interest Rate (%)"
          type="number"
          value={interestRate}
          onChange={(e) =>
            setInterestRate(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          className="input px-2 py-3 rounded-md border-2"
          placeholder="Tenure (Years)"
          type="number"
          value={tenureYears}
          onChange={(e) =>
            setTenureYears(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="bg-muted rounded-lg p-4 text-center space-y-1">
            <p className="text-xl font-semibold">
              EMI: ₹{formatCurrency(result.emi)}
            </p>
            <p>Total Interest: ₹{formatCurrency(result.totalInterest)}</p>
            <p>Total Payable: ₹{formatCurrency(result.totalAmount)}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 bg-muted rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={result.pie} dataKey="value" outerRadius={80}>
                    {result.pie.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="h-72 bg-muted rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.amortizationData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke={COLORS[0]}
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

export default EMICalculator;
