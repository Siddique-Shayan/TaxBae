import {
  AlertTriangle,
  Calendar,
  IndianRupee,
  Percent,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { DEFAULT_FILTERS } from "../utils/filterInvestments";

const FiltersPanel = ({ filters, setFilters }: any) => {
  const toggleRisk = (risk: string) => {
    setFilters((prev: any) => ({
      ...prev,
      riskProfiles: prev.riskProfiles.includes(risk)
        ? prev.riskProfiles.filter((r: string) => r !== risk)
        : [...prev.riskProfiles, risk],
    }));
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="
            flex items-center gap-1 text-xs
            text-muted-foreground hover:text-foreground
            transition
          "
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear all
        </button>
      </div>

      {/* RISK */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-medium">Risk</p>
        </div>

        <div className="flex gap-4">
          {["Low", "Medium", "High"].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.riskProfiles.includes(r)}
                onChange={() => toggleRisk(r)}
              />
              {r}
            </label>
          ))}
        </div>
      </div>

      {/* AGE */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-medium">Age (minimum)</p>
        </div>

        <input
          type="number"
          min={18}
          placeholder="e.g. 25"
          className="w-full px-3 py-2 rounded-md bg-background border border-border"
          value={filters.minAge ?? ""}
          onChange={(e) =>
            setFilters((f: any) => ({
              ...f,
              minAge: e.target.value ? Number(e.target.value) : null,
            }))
          }
        />
      </div>

      {/* EXPECTED RETURN */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Percent className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-medium">Expected Return (min)</p>
        </div>

        <input
          type="number"
          step="0.1"
          placeholder="e.g. 7"
          className="w-full px-3 py-2 rounded-md bg-background border border-border"
          value={filters.minExpectedReturn ?? ""}
          onChange={(e) =>
            setFilters((f: any) => ({
              ...f,
              minExpectedReturn: e.target.value
                ? Number(e.target.value)
                : null,
            }))
          }
        />
      </div>

      {/* ANNUAL INCOME */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-medium">Annual Income (minimum)</p>
        </div>

        <select
          className="w-full px-3 py-2 rounded-md bg-background border border-border"
          value={filters.minIncomeIndex ?? ""}
          onChange={(e) =>
            setFilters((f: any) => ({
              ...f,
              minIncomeIndex:
                e.target.value === "" ? null : Number(e.target.value),
            }))
          }
        >
          <option value="">Any</option>
          <option value={0}>0–2 Lakhs</option>
          <option value={1}>2–5 Lakhs</option>
          <option value={2}>5–10 Lakhs</option>
          <option value={3}>10–25 Lakhs</option>
          <option value={4}>25–50 Lakhs</option>
          <option value={5}>50 Lakhs–1 Crore</option>
          <option value={6}>1 Crore+</option>
        </select>
      </div>

      {/* PERIOD */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-medium">Period</p>
        </div>

        <div className="flex flex-col gap-2">
          {[
            { label: "Any", value: null },
            { label: "Short", value: "Short" },
            { label: "Long", value: "Long" },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="period"
                checked={filters.investmentPeriod === opt.value}
                onChange={() =>
                  setFilters((f: any) => ({
                    ...f,
                    investmentPeriod: opt.value,
                  }))
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
