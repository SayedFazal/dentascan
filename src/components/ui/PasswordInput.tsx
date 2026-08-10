import React, { useState, forwardRef } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  isValid?: boolean;
  fullWidth?: boolean;
  containerClassName?: string;
  showToggle?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label = 'Password',
      error,
      helperText,
      isValid,
      fullWidth = true,
      containerClassName = '',
      className = '',
      id,
      disabled,
      required,
      showToggle = true,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `password-input-${Math.random().toString(36).substring(2, 7)}`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none"
          >
            <span>
              {label} {required && <span className="text-rose-500">*</span>}
            </span>
            {isValid && !error && (
              <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black flex items-center gap-1 normal-case">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Lock className="w-4 h-4" />
          </div>

          <input
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            disabled={disabled}
            required={required}
            className={`
              w-full h-11 text-xs sm:text-sm font-semibold rounded-2xl transition-all duration-200 outline-none pl-10 pr-10
              bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500
              border ${
                error
                  ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : isValid
                  ? 'border-emerald-400 dark:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400'
              }
              disabled:opacity-60 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />

          {showToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 inset-y-0 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>

        {error ? (
          <p className="text-rose-500 dark:text-rose-400 text-[11px] font-bold flex items-center gap-1.5 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
