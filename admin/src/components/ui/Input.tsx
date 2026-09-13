import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-egypt-black"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          {...rest}
          className={[
            "w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all bg-white",
            "focus:outline-none focus:ring-2 focus:ring-pharaoh-gold/40 focus:border-pharaoh-gold",
            error
              ? "border-red-400 bg-red-50 focus:ring-red-500"
              : "border-sand-300 hover:border-pharaoh-gold/40",
            className,
          ].join(" ")}
        />
        {error && <p className="text-xs text-egypt-red font-medium">{error}</p>}
        {!error && hint && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;