import type { SelectHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const sizeStyles = {
  sm: "h-9 rounded-control text-body-md",
  md: "h-10 rounded-control text-body-md",
  lg: "h-12 rounded-control text-body-lg"
};

type SelectOption = {
    label: string;
    value: string;
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
    label?: string;
    error?: string;
    placeholder?: string;
    size?: keyof typeof sizeStyles;
    options: SelectOption[];
}

const Select = ({ 
    label, 
    error, 
    placeholder, 
    size = "md",
    options,
    disabled = false,
    className = "",
    id,
    ...props 
}: SelectProps) => {
    const baseSelectStyles =
 "w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2";
    const classes = twMerge(
    baseSelectStyles,
    sizeStyles[size],
    error ? "bg-error-container text-on-error" : "",
    className
  );
    
  return (
   <div className="flex w-full flex-col gap-2">
     {label && (
            <label htmlFor="status" className="text-label-md text-on-surface">
                STATUS
            </label>
     )}
   <div className="relative">  
     <select
         id={id}
         className={classes}
         disabled={disabled}
         aria-invalid={Boolean(error)}
         aria-describedby={error && id ? `${id}-error` : undefined}
         {...props}
     >
        <option value="" disabled >{placeholder}</option>
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
     </select>
     </div>
     {error && (
        <p id={id ? `${id}-error` : undefined} className="text-label-md text-error">
            {error}
        </p>
     )}
      
    </div>
  )
}

export default Select
