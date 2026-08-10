import React from 'react';
import { motion } from 'motion/react';
import Card from '../ui/Card';

interface FormLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  footer?: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  title,
  subtitle,
  badge,
  badgeIcon,
  footer,
  onSubmit,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`w-full ${className}`}
    >
      <Card variant="glass" className="shadow-2xl shadow-blue-500/5 dark:shadow-none p-6 sm:p-8">
        
        {/* Header Section */}
        <div className="space-y-2 mb-6">
          {badge && (
            <div className="inline-flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/80 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              {badgeIcon}
              <span>{badge}</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Form or Content */}
        {onSubmit ? (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {children}
          </form>
        ) : (
          <div className="space-y-4">{children}</div>
        )}

        {/* Footer Links / Content */}
        {footer && (
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            {footer}
          </div>
        )}

      </Card>
    </motion.div>
  );
};

export default FormLayout;
