import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import CalculatorCard from "./CalculatorCard.tsx";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", { maximumFractionDigits: 0 });

type TaxRegime = "OLD_REGIME" | "NEW_REGIME";

const TAX_COLORS = ["#22C55E", "#EF4444"]; // Take-home, Tax
const BAR_COLOR = "#F97316";

// ---------------- TAX CALCULATION LOGIC ----------------
const calculateTaxForRegime = (
  taxableIncome: number,
  regime: TaxRegime
): number => {
  if (taxableIncome <= 0) return 0;

  let tax = 0;

  if (regime === "OLD_REGIME") {
    if (taxableIncome > 250000) {
      tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
    }
    if (taxableIncome > 500000) {
      tax += Math.min(taxableIncome - 500000, 500000) * 0.2;
    }
    if (taxableIncome > 1000000) {
      tax += (taxableIncome - 1000000) * 0.3;
    }
  } else {
    if (taxableIncome > 300000) {
      tax += Math.min(taxableIncome - 300000, 400000) * 0.05;
    }
    if (taxableIncome > 700000) {
      tax += Math.min(taxableIncome - 700000, 300000) * 0.1;
    }
    if (taxableIncome > 1000000) {
      tax += Math.min(taxableIncome - 1000000, 200000) * 0.15;
    }
    if (taxableIncome > 1200000) {
      tax += Math.min(taxableIncome - 1200000, 300000) * 0.2;
    }
    if (taxableIncome > 1500000) {
      tax += (taxableIncome - 1500000) * 0.3;
    }
  }

  return parseFloat(tax.toFixed(2));
};

// ---------------- COMPONENT ----------------
const TaxBenefitsCalculator: React.FC = () => {
  // ---------- Inputs ----------
  const [income, setIncome] = useState<number | "">("");
  const [taxRegime, setTaxRegime] = useState<TaxRegime>("OLD_REGIME");
  const [section80C, setSection80C] = useState<number | "">("");
  const [section80D, setSection80D] = useState<number | "">("");
  const [nps, setNps] = useState<number | "">("");

  // ---------- Result ----------
  const [result, setResult] = useState<null | {
    taxableIncome: number;
    totalTax: number;
    taxSavings: number;
    totalDeductions: number;
    effectiveTaxRate: number;
    taxBeforeDeductions: number;
  }>(null);

  // ---------- Calculate ----------
  const calculateTax = () => {
    if (!income || income <= 0) return;

    const grossIncome = income as number;

    let eligible80C = 0;
    let eligible80D = 0;
    let eligibleNps = 0;

    if (taxRegime === "OLD_REGIME") {
      eligible80C = section80C ? Math.min(section80C as number, 150000) : 0;
      eligible80D = section80D ? Math.min(section80D as number, 25000) : 0;
      eligibleNps = nps ? Math.min(nps as number, 50000) : 0;
    }

    const totalDeductions = eligible80C + eligible80D + eligibleNps;
    const taxableIncome = Math.max(grossIncome - totalDeductions, 0);

    const taxBeforeDeductions = calculateTaxForRegime(
      grossIncome,
      taxRegime
    );
    const totalTax = calculateTaxForRegime(
      taxableIncome,
      taxRegime
    );

    const taxSavings = taxBeforeDeductions - totalTax;
    const effectiveTaxRate = (totalTax / grossIncome) * 100;

    setResult({
      taxableIncome,
      totalTax,
      taxSavings,
      totalDeductions,
      effectiveTaxRate: parseFloat(effectiveTaxRate.toFixed(2)),
      taxBeforeDeductions,
    });
  };

  const pieData =
    result && income
      ? [
          {
            name: "Take Home (After Tax)",
            value: (income as number) - result.totalTax,
          },
          {
            name: "Tax Outgo",
            value: result.totalTax,
          },
        ]
      : [];

  const barData =
    result !== null
      ? [
          { label: "Before Deductions", Tax: result.taxBeforeDeductions },
          { label: "After Deductions", Tax: result.totalTax },
        ]
      : [];

  return (
    <CalculatorCard
      title="Tax Benefits Calculator"
      onCalculate={calculateTax}
      showResults={!!result}
    >
      {/* ---------------- Inputs ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="input"
          placeholder="Annual Income (₹)"
          type="number"
          value={income}
          onChange={(e) =>
            setIncome(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        {/* Regime Toggle */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Tax Regime
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-semibold ${
                taxRegime === "OLD_REGIME"
                  ? "bg-primary text-white border-primary"
                  : "bg-muted text-muted-foreground"
              }`}
              onClick={() => setTaxRegime("OLD_REGIME")}
            >
              Old
            </button>
            <button
              type="button"
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-semibold ${
                taxRegime === "NEW_REGIME"
                  ? "bg-primary text-white border-primary"
                  : "bg-muted text-muted-foreground"
              }`}
              onClick={() => setTaxRegime("NEW_REGIME")}
            >
              New
            </button>
          </div>
        </div>

        <input
          className="input"
          placeholder="Section 80C (₹)"
          type="number"
          value={section80C}
          onChange={(e) =>
            setSection80C(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />

        <input
          className="input"
          placeholder="Section 80D (₹)"
          type="number"
          value={section80D}
          onChange={(e) =>
            setSection80D(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />

        <input
          className="input"
          placeholder="NPS Contribution (₹)"
          type="number"
          value={nps}
          onChange={(e) =>
            setNps(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
      </div>

      {/* ---------------- Results ---------------- */}
      {result && (
        <>
          {/* Summary */}
          <div className="bg-muted rounded-lg p-4 grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Taxable Income</p>
              <p className="text-lg font-semibold">
                ₹{formatCurrency(result.taxableIncome)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tax</p>
              <p className="text-lg font-semibold text-red-600">
                ₹{formatCurrency(result.totalTax)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tax Savings</p>
              <p className="text-lg font-semibold text-emerald-600">
                ₹{formatCurrency(result.taxSavings)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Deductions</p>
              <p className="text-lg font-semibold text-indigo-600">
                ₹{formatCurrency(result.totalDeductions)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Effective Tax Rate
              </p>
              <p className="text-lg font-semibold">
                {result.effectiveTaxRate}%
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="h-72 bg-muted rounded-xl p-4">
              <h4 className="text-center font-semibold mb-2">
                Impact of Deductions
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="label" />
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
                  <Bar
                    dataKey="Tax"
                    name="Tax Amount"
                    fill={BAR_COLOR}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="h-72 bg-muted rounded-xl p-4">
              <h4 className="text-center font-semibold mb-2">
                Take-home vs Tax
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label={({ name, value }) =>
                      `${name}: ₹${formatCurrency(value)}`
                    }
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={TAX_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </CalculatorCard>
  );
};

export default TaxBenefitsCalculator;
