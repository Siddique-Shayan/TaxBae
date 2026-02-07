import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CalculatorCard from "./CalculatorCard.tsx";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const RentVsBuyCalculator: React.FC = () => {
  // ---------- Input States ----------
  const [homePrice, setHomePrice] = useState<number | "">("");
  const [downPayment, setDownPayment] = useState<number | "">("");
  const [loanInterest, setLoanInterest] = useState<number | "">("");
  const [loanTenure, setLoanTenure] = useState<number | "">("");
  const [monthlyRent, setMonthlyRent] = useState<number | "">("");
  const [annualRentIncrease, setAnnualRentIncrease] = useState<number | "">("");
  const [timeHorizon, setTimeHorizon] = useState<number | "">("");

  // ---------- Result State ----------
  const [result, setResult] = useState<null | {
    chartData: { year: number; Buying: number; Renting: number }[];
    totalBuyCost: number;
    totalRentCost: number;
    recommendation: "rent" | "buy";
    savings: number;
  }>(null);

  // ---------- Calculate Handler ----------
  const calculateRentVsBuy = () => {
    if (
      !homePrice ||
      !downPayment ||
      !loanInterest ||
      !loanTenure ||
      !monthlyRent ||
      !annualRentIncrease ||
      !timeHorizon
    ) {
      return;
    }

    const price = homePrice as number;
    const down = downPayment as number;
    const loanRate = loanInterest as number;
    const tenureYears = loanTenure as number;
    const rent0 = monthlyRent as number;
    const rentInc = annualRentIncrease as number;
    const years = timeHorizon as number;

    const loanAmount = price - down;
    const monthlyRate = loanRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    const emi =
      (loanAmount *
        monthlyRate *
        Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    let cumulativeBuy = down;
    let cumulativeRent = 0;
    let currentRent = rent0;

    const buyCosts: number[] = [];
    const rentCosts: number[] = [];

    for (let year = 1; year <= years; year++) {
      if (year <= tenureYears) {
        cumulativeBuy += emi * 12;
      }

      buyCosts.push(parseFloat(cumulativeBuy.toFixed(2)));

      cumulativeRent += currentRent * 12;
      rentCosts.push(parseFloat(cumulativeRent.toFixed(2)));

      currentRent *= 1 + rentInc / 100;
    }

    const chartData = Array.from({ length: years }, (_, i) => ({
      year: i + 1,
      Buying: buyCosts[i],
      Renting: rentCosts[i],
    }));

    const finalBuyCost = buyCosts[years - 1];
    const finalRentCost = rentCosts[years - 1];

    if (finalRentCost < finalBuyCost) {
      setResult({
        chartData,
        totalBuyCost: finalBuyCost,
        totalRentCost: finalRentCost,
        recommendation: "rent",
        savings: parseFloat((finalBuyCost - finalRentCost).toFixed(2)),
      });
    } else {
      setResult({
        chartData,
        totalBuyCost: finalBuyCost,
        totalRentCost: finalRentCost,
        recommendation: "buy",
        savings: parseFloat((finalRentCost - finalBuyCost).toFixed(2)),
      });
    }
  };

  return (
    <CalculatorCard
      title="Rent vs Buy Analyzer"
      onCalculate={calculateRentVsBuy}
      showResults={!!result}
    >
      {/* ---------------- Inputs ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="input"
          placeholder="Home Price (₹)"
          type="number"
          value={homePrice}
          onChange={(e) =>
            setHomePrice(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          className="input"
          placeholder="Down Payment (₹)"
          type="number"
          value={downPayment}
          onChange={(e) =>
            setDownPayment(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          className="input"
          placeholder="Loan Interest Rate (%)"
          type="number"
          value={loanInterest}
          onChange={(e) =>
            setLoanInterest(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="input"
          placeholder="Loan Tenure (Years)"
          type="number"
          value={loanTenure}
          onChange={(e) =>
            setLoanTenure(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          className="input"
          placeholder="Monthly Rent (₹)"
          type="number"
          value={monthlyRent}
          onChange={(e) =>
            setMonthlyRent(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="input"
          placeholder="Annual Rent Increase (%)"
          type="number"
          value={annualRentIncrease}
          onChange={(e) =>
            setAnnualRentIncrease(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
        <input
          className="input"
          placeholder="Time Horizon (Years)"
          type="number"
          value={timeHorizon}
          onChange={(e) =>
            setTimeHorizon(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
      </div>

      {/* ---------------- Results ---------------- */}
      {result && (
        <>
          {/* Summary */}
          <div className="bg-muted rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Cost of Buying
              </p>
              <p className="text-lg font-semibold">
                ₹{formatCurrency(result.totalBuyCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Cost of Renting
              </p>
              <p className="text-lg font-semibold">
                ₹{formatCurrency(result.totalRentCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recommendation</p>
              <p
                className={`text-lg font-bold ${
                  result.recommendation === "rent"
                    ? "text-emerald-600"
                    : "text-indigo-600"
                }`}
              >
                {result.recommendation.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Potential Savings
              </p>
              <p className="text-lg font-semibold text-emerald-600">
                ₹{formatCurrency(result.savings)}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-80 bg-muted rounded-xl p-4">
            <h4 className="text-center font-semibold mb-2">
              Cumulative Cost Over Time
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.chartData}>
                <XAxis dataKey="year" tickFormatter={(v) => `Year ${v}`} />
                <YAxis
                  tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
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
                  dataKey="Buying"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Renting"
                  stroke="#EC4899"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </CalculatorCard>
  );
};

export default RentVsBuyCalculator;
