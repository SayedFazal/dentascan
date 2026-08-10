import React, { useState, useRef } from 'react';
import { motion, HTMLMotionProps, AnimatePresence } from 'motion/react';
import { Loader2, Check, AlertCircle } from 'lucide-react';

export interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: 'primary' | 'secondary' | 'accent' | 'emerald' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  status?: 'idle' | 'loading' | 'success' | 'error';
  loadingText?: string;
  successText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  glow?: boolean;
  enableRipple?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isSuccess = false,
      isError = false,
      status,
      loadingText,
      successText,
      errorText,
      disabled = false,
      children,
      leftIcon,
      rightIcon,
      fullWidth = false,
      glow = true,
      enableRipple = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    // Derive current status
    const currentStatus = status || (isLoading ? 'loading' : isSuccess ? 'success' : isError ? 'error' : 'idle');

    // Handle ripple generation
    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!enableRipple || disabled || currentStatus === 'loading') return;

      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.8;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const newRipple: Ripple = {
        id: Date.now() + Math.random(),
        x,
        y,
        size,
      };

      setRipples((prev) => [...prev.slice(-3), newRipple]);
    };

    const removeRipple = (id: number) => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    };

    // Variant style maps
    const variantStyles = {
      primary: `
        bg-gradient-to-r from-[#2563EB] via-[#14B8A6] to-[#0EA5A8] 
        hover:from-[#1D4ED8] hover:via-[#0D9488] hover:to-[#0B8E91]
        text-white font-black
        ${glow ? 'shadow-lg shadow-[#2563EB]/25 hover:shadow-xl hover:shadow-[#14B8A6]/35' : 'shadow-md'}
        border border-white/20 dark:border-white/10
      `,
      accent: `
        bg-gradient-to-r from-[#14B8A6] to-[#0EA5A8]
        hover:from-[#0D9488] hover:to-[#0B8E91]
        text-white font-black
        ${glow ? 'shadow-lg shadow-[#14B8A6]/30 hover:shadow-xl hover:shadow-[#14B8A6]/45' : 'shadow-md'}
        border border-teal-300/30
      `,
      emerald: `
        bg-gradient-to-r from-[#10B981] to-[#059669]
        hover:from-[#059669] hover:to-[#047857]
        text-white font-black
        ${glow ? 'shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40' : 'shadow-md'}
        border border-emerald-300/30
      `,
      secondary: `
        bg-white dark:bg-slate-900 
        text-slate-800 dark:text-slate-100 
        border-2 border-slate-200/90 dark:border-slate-800 
        hover:border-[#14B8A6] dark:hover:border-[#14B8A6] 
        hover:text-[#2563EB] dark:hover:text-[#14B8A6] 
        hover:bg-slate-50 dark:hover:bg-slate-800/80
        shadow-xs hover:shadow-md
      `,
      outline: `
        bg-transparent 
        text-[#2563EB] dark:text-[#14B8A6] 
        border-2 border-[#2563EB] dark:border-[#14B8A6] 
        hover:bg-[#2563EB]/10 dark:hover:bg-[#14B8A6]/10 
        hover:border-[#1D4ED8] dark:hover:border-[#0EA5A8]
      `,
      ghost: `
        bg-transparent 
        text-slate-700 dark:text-slate-200 
        hover:bg-slate-100/90 dark:hover:bg-slate-800/90 
        hover:text-slate-900 dark:hover:text-white
        border border-transparent
      `,
      danger: `
        bg-gradient-to-r from-rose-500 to-red-600 
        hover:from-rose-600 hover:to-red-700 
        text-white font-black
        ${glow ? 'shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/35' : 'shadow-md'}
        border border-white/20
      `,
    };

    const sizeStyles = {
      xs: 'px-3 py-1.5 text-[10px] min-h-[32px] rounded-lg gap-1.5',
      sm: 'px-4 py-2 text-xs min-h-[38px] rounded-xl gap-2',
      md: 'px-5 py-2.5 text-xs min-h-[44px] rounded-2xl gap-2.5',
      lg: 'px-6 py-3.5 text-sm min-h-[50px] rounded-2xl gap-3',
      xl: 'px-8 py-4 text-base min-h-[56px] rounded-2xl gap-3.5',
    };

    return (
      <motion.button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        whileHover={!disabled && currentStatus === 'idle' ? { scale: 1.02, y: -2 } : {}}
        whileTap={!disabled && currentStatus === 'idle' ? { scale: 0.96, y: 0 } : {}}
        transition={{ type: 'spring', stiffness: 450, damping: 22 }}
        onPointerDown={handlePointerDown}
        onClick={(e) => {
          if (disabled || currentStatus === 'loading') return;
          if (onClick) onClick(e);
        }}
        aria-busy={currentStatus === 'loading'}
        aria-disabled={disabled || currentStatus === 'loading'}
        role="button"
        className={`
          group relative inline-flex items-center justify-center 
          font-extrabold uppercase tracking-wider select-none overflow-hidden
          transition-all duration-300 cursor-pointer text-center
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none
          ${fullWidth ? 'w-full' : ''}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        disabled={disabled || currentStatus === 'loading'}
        {...props}
      >
        {/* Shimmer light reflection effect on hover */}
        {!disabled && currentStatus === 'idle' && (
          <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
        )}

        {/* Dynamic Ripples */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            onAnimationComplete={() => removeRipple(ripple.id)}
            style={{
              top: ripple.y,
              left: ripple.x,
              width: ripple.size,
              height: ripple.size,
            }}
            className="absolute bg-white/40 rounded-full pointer-events-none z-0"
          />
        ))}

        {/* Status Content */}
        <AnimatePresence mode="wait">
          {currentStatus === 'loading' ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="relative z-10 inline-flex items-center justify-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin shrink-0 stroke-[2.5]" />
              <span>{loadingText || 'Processing...'}</span>
            </motion.span>
          ) : currentStatus === 'success' ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="relative z-10 inline-flex items-center justify-center gap-2 text-white"
            >
              <Check className="w-4 h-4 shrink-0 stroke-[3]" />
              <span>{successText || 'Completed!'}</span>
            </motion.span>
          ) : currentStatus === 'error' ? (
            <motion.span
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="relative z-10 inline-flex items-center justify-center gap-2 text-white"
            >
              <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>{errorText || 'Error Occurred'}</span>
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 inline-flex items-center justify-center gap-2 w-full"
            >
              {leftIcon && (
                <span className="shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3">
                  {leftIcon}
                </span>
              )}
              <span className="truncate">{children as React.ReactNode}</span>
              {rightIcon && (
                <span className="shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:translate-x-0.5">
                  {rightIcon}
                </span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
