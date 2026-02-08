import {
  Percent,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { getInvestmentColor } from "./investmentColors";

const InvestmentCard = ({ item }: any) => {
  return (
    <div
      className="
        relative bg-card border border-border
        rounded-2xl p-5
        shadow-sm hover:shadow-md
        transition
      "
    >
      {/* Colored Dot */}
      <div
        className={`
          absolute top-4 left-4
          h-4 w-4 rounded-full
          ${getInvestmentColor(item.investmentOption)}
        `}
      />

      {/* Title */}
      <div className="ml-6 mb-4">
        <h4 className="font-semibold text-lg leading-tight">
          {item.investmentOption}
        </h4>
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm">
        {/* Expected Return */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Percent className="w-4 h-4" />
            <span>Expected Return</span>
          </div>
          <span className="font-medium">
            {item.expectedReturnPercent}%
          </span>
        </div>

        {/* Risk */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="w-4 h-4" />
            <span>Risk</span>
          </div>
          <span className="font-medium">
            {item.riskProfile}
          </span>
        </div>

        {/* Time Horizon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Time Horizon</span>
          </div>
          <span className="font-medium">
            {item.investmentHorizonYears} yrs
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;
