import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { fadeInUp } from '../../lib/motion-variants';

export interface CardProps extends HTMLMotionProps<"div"> {
  noPadding?: boolean;
  variant?: 'default' | 'glass' | 'elevated' | 'outlined';
  hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, noPadding = false, variant = 'default', hoverEffect = false, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm',
      glass: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800/80 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50',
      elevated: 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-500/5 dark:shadow-black/40',
      outlined: 'bg-transparent border-2 border-slate-200 dark:border-slate-800',
    };

    return (
      <motion.div
        ref={ref}
        variants={fadeInUp}
        whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : undefined}
        className={`
          rounded-3xl transition-all duration-300
          ${variantClasses[variant]}
          ${!noPadding ? 'p-6 sm:p-8' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
