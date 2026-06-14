import Header from "../components/layout/Header";
import { useBreakpoint } from "../utils/useBreakpoint";

import {
  applicationCount,
  interviewRate,
  responseRate,
  offerRate
} from "../utils/getStats";

const Analytics = () => {
  const isTabletUp = useBreakpoint("md");
  const isMobile = !isTabletUp;
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col bg-surface px-6 py-4 relative">
      {isMobile && <Header />}
      <main className="flex flex-col pb-10 gap-6">
        <h2 className="mt-6 text-page-title text-on-surface">
          Performance Ledger
        </h2>
        <p className="mt-4 text-body-lg text-on-surface-secondary">
          Measuring your application journey with architectural precision.
        </p>

        <div className="flex flex-col justify-between gap-6">
          
        </div>
      </main>
    </div>
  );
};

export default Analytics;
