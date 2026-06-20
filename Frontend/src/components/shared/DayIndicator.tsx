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
  activeDay: string;
};

const DayIndicator = ({ activeDay }: DayIndicatorProps) => {
  return (
    <div className="mt-6 flex items-end justify-center gap-2">
      {dayLabels.map((day) => {
        const isActive = day === activeDay;

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
