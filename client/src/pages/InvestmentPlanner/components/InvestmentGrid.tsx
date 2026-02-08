import InvestmentCard from "./InvestmentCard";

const InvestmentGrid = ({ data }: any) => {
  if (!data.length) {
    return (
      <div className="text-muted-foreground text-center py-10">
        No investments found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item: any, idx: number) => (
        <InvestmentCard key={idx} item={item} />
      ))}
    </div>
  );
};

export default InvestmentGrid;
