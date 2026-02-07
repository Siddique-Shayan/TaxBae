import { Separator } from "@/components/ui/separator";

const Billing = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-sm text-muted-foreground">
          Manage your plan and unlock advanced financial insights
        </p>
      </div>
      <Separator />

      <div className="w-full">
        <div className="mt-0">
          <h1 className="text-lg font-medium mb-2">Upgrade to Taxbae Pro 🚀</h1>

          <p className="text-base mb-2">
            <strong>Taxbae</strong> is an AI-powered financial assistant built as
            a <strong>college major project</strong>, designed to simplify
            personal finance, tax planning, and investment decisions.
          </p>

          <p className="text-base mb-2">
            The Pro version unlocks advanced features developed through months
            of research, design, and real-world financial modeling.
          </p>

          <p className="text-base mb-2">
            With Taxbae Pro, you get access to:
          </p>

          <ul className="list-disc pl-5 text-base mb-2">
            <li>
              <strong>AI-Powered Financial Insights</strong> personalized to your
              data
            </li>
            <li>
              <strong>Monthly Financial Reports</strong> with clear breakdowns
              and trends
            </li>
            <li>
              <strong>CSV Import</strong> for bank statements & transactions
            </li>
            <li>
              <strong>Recurring Transaction Tracking</strong>
            </li>
            <li>
              <strong>Investment Planning & Forecasting</strong>
            </li>
            <li>
              <strong>Smart Financial Calculators</strong> (tax, savings, ROI,
              etc.)
            </li>
            <li>
              <strong>Advanced AI Models</strong> for predictions and planning
            </li>
          </ul>

          <p className="text-base mb-2">
            This project demonstrates how modern AI technology can transform
            personal finance management into a smarter, more automated
            experience.
          </p>

          <p className="text-base font-medium">
            🔓 <span className="text-green-600">Upgrade & explore:</span>
            <a
              className="text-blue-500 underline ml-1"
              href="#"
            >
              Enable Taxbae Pro
            </a>
          </p>

          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default Billing;
