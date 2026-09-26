import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable high-contrast Select dropdown component.
 * Synced height (44px / h-11), crisp border, and clean typography.
 */
const Select = forwardRef(function Select(
    {
        label,
        error,
        helperText,
        options = [],
        children,
        required,
        id,
        className = '',
        containerClassName = '',
        ...props
    },
    ref
) {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-xs sm:text-sm font-bold text-slate-800 tracking-tight"
                >
                    {label}
                    {required && <span className="text-red-500 font-bold ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <select
                    ref={ref}
                    id={selectId}
                    required={required}
                    className={`w-full h-11 pl-3.5 pr-9 py-2 text-sm font-semibold text-slate-900 bg-white border rounded-xl outline-none shadow-2xs appearance-none cursor-pointer focus:ring-3 transition-all duration-150 ${
                        error
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
                            : 'border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-600/15'
                    } ${className}`}
                    {...props}
                >
                    {options && options.length > 0
                        ? options.map((opt) => {
                              const val = typeof opt === 'object' ? opt.value : opt;
                              const lbl = typeof opt === 'object' ? opt.label : opt;
                              return (
                                  <option key={val} value={val} className="text-slate-900 py-1">
                                      {lbl}
                                  </option>
                              );
                          })
                        : children}
                </select>

                <ChevronDown
                    size={16}
                    strokeWidth={2.2}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
            </div>

            {error && (
                <p className="text-xs font-semibold text-red-600 pl-0.5">{error}</p>
            )}

            {helperText && !error && (
                <p className="text-xs text-slate-600 pl-0.5">{helperText}</p>
            )}
        </div>
    );
});

export default Select;
