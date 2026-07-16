type ToggleProps = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  secondLabel?: string;
};

const Toggle = ({
  id,
  checked,
  onChange,
  disabled,
  label,
  description,
  secondLabel
}: ToggleProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
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
        aria-label={
          secondLabel ? `${label ?? 'First option'} / ${secondLabel}` : label ?? "Toggle setting"
        }
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative h-6 w-11 rounded-full 
          transition-colors duration-150
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary
          focus-visible:ring-offset-2
          focus-visible:ring-offset-surface 
          disabled:cursor-not-allowed
          disabled:opacity-50
           ${checked 
            ? "bg-primary enabled:hover:bg-primary-dim" 
            : "bg-outline-variant enabled:hover:bg-on-surface-variant"
          }
            `}
      >
        <span
          className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white 
            transition-transform duration-150
            ${checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>

      {secondLabel && (
        <span className="flex flex-col">
          {secondLabel && (
            <span className="text-body-md font-semibold text-on-surface">
              {secondLabel}
            </span>
          )}
        </span>
      )}
    </div>
  );  
};

export default Toggle;
