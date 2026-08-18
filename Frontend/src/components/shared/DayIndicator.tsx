const dayLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

type DayIndicatorProps = {
  activeDays: string[];
};

const DayIndicator = ({ activeDays }: DayIndicatorProps) => {
  return (
    <div className="mt-6 flex items-end justify-center gap-2">
      {dayLabels.map((day) => {
        const isActive = activeDays.includes(day);

        return (
          <span
            key={day}
            aria-label={day}
            className={
              isActive
                ? "h-8 w-4 rounded-full bg-primary"
                : "h-2 w-4 rounded-full bg-surface-container-high"
            }
          />
        );
      })}
    </div>
  );
};

export default DayIndicator;
