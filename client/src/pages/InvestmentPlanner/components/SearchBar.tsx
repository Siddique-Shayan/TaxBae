import { Search } from "lucide-react";

const SearchBar = ({ search, setSearch }: any) => {
  return (
    <div className="relative w-full">
      <Search
        className="
          absolute left-4 top-1/2 -translate-y-1/2
          w-4 h-4 text-muted-foreground
        "
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search investment options..."
        className="
          w-full pl-11 pr-4 py-3 rounded-lg
          bg-card border border-border
          text-foreground placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary
        "
      />
    </div>
  );
};

export default SearchBar;
