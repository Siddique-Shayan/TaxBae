import { useMemo, useState } from "react";
import rawInvestments from "@/data/investments.json";
import { normalizeInvestments } from "./utils/normalizeInvestment";
import FiltersPanel from "./components/FiltersPanel";
import SearchBar from "./components/SearchBar";
import InvestmentGrid from "./components/InvestmentGrid";
import { DEFAULT_FILTERS } from "./utils/filterInvestments";
import { applyInvestmentFilters } from "./utils/filterInvestments";

const InvestmentPlanner = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const normalizedData = useMemo(() => {
    return normalizeInvestments(rawInvestments as any[]);
  }, []);

  const filteredData = useMemo(() => {
    return applyInvestmentFilters(normalizedData, filters, search);
  }, [normalizedData, filters, search]);

  return (
    <div className="w-full h-full px-6 py-6 bg-background text-foreground">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3">
          <FiltersPanel filters={filters} setFilters={setFilters} />
        </div>

        <div className="col-span-12 md:col-span-9 space-y-4">
          <SearchBar search={search} setSearch={setSearch} />
          <InvestmentGrid data={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default InvestmentPlanner;
