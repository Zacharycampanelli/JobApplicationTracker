import Lightbulb from "../../assets/images/lightbulb.svg?react";
import { getDailyInsight } from "../../utils/dailyInsights";

const DailyInsight = () => {
  const insight = getDailyInsight();
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-surface-container p-6 min-w-[90%]">
      <h2 className="flex items-center gap-2 text-card-title text-on-surface">
        <Lightbulb fill="currentColor" aria-hidden="true" />
        Daily Insight
      </h2>
      <p className="text-body-lg text-on-surface-secondary">{insight}</p>
    </div>
  )
}

export default DailyInsight