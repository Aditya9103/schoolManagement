import React, { forwardRef } from 'react';

/**
 * Reusable high-contrast Form Input component.
 * Synced design with crisp borders, accessible contrast, and clear focus states.
 */
const Input = forwardRef(function Input(
    {
        label,
        error,
        helperText,
        leftIcon: LeftIcon,
        rightIcon: RightIcon,
        required,
        id,
        className = '',
        containerClassName = '',
        ...props
    },
    ref
) {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs sm:text-sm font-bold text-slate-800 tracking-tight"
                >
                    {label}
                    {required && <span className="text-red-500 font-bold ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {LeftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <LeftIcon size={16} strokeWidth={2} />
                    </div>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    required={required}
                    className={`w-full h-11 py-2.5 text-sm font-medium text-slate-900 bg-white border rounded-xl outline-none shadow-2xs placeholder:text-slate-400 focus:ring-3 transition-all duration-150 ${
                        LeftIcon ? 'pl-10' : 'pl-3.5'
                    } ${RightIcon ? 'pr-10' : 'pr-3.5'} ${
                        error
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
                            : 'border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-600/15'
                    } ${className}`}
                    {...props}
                />

                {RightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500">
                        <RightIcon size={16} strokeWidth={2} />
                    </div>
                )}
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

export default Input;
