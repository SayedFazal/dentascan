import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'slate' | 'emerald';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorMap = {
    primary: 'text-blue-600 dark:text-blue-400',
    white: 'text-white',
    slate: 'text-slate-500 dark:text-slate-400',
    emerald: 'text-emerald-500'
  };

  return (
    <div className={`inline-flex items-center justify-center gap-2.5 ${className}`}>
      <Loader2 className={`${sizeMap[size]} ${colorMap[color]} animate-spin stroke-[2.5]`} />
      {text && (
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide uppercase">
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
