type ToggleProps = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
};

const Toggle = ({
  id,
  checked,
  onChange,
  disabled,
  label,
  description
}: ToggleProps) => {
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-4">
      {(label || description) && (
        <span className="flex flex-col">
          {label && (
            <span className="text-body-md font-semibold text-on-surface">
              {label}
            </span>
          )}
          {description && (
            <span className="text-label-md text-on-surface-secondary">
              {description}
            </span>
          )}
        </span>
      )}

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-primary" : "bg-outline-variant"} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </label>
  );
};

export default Toggle;
