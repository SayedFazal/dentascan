import React from 'react';
import { motion } from 'motion/react';
import CountUp from './ui/CountUp';

interface AdherenceCardProps {
  probability: number;
  risk: 'Low' | 'Medium' | 'High';
}

const AdherenceCard: React.FC<AdherenceCardProps> = ({ probability, risk }) => {
  const getRiskStyles = () => {
    switch (risk) {
      case 'Low': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'High': return 'text-rose-700 bg-rose-50 border-rose-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getBarColor = () => {
    if (probability >= 0.7) return 'bg-emerald-500';
    if (probability >= 0.4) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const percentage = Math.round(probability * 100);

  return (
    <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden text-slate-900">
      <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Weekly Adherence Probability</p>
      <div className="flex items-end justify-between mt-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-baseline gap-2"
        >
          <CountUp 
            to={percentage} 
            suffix="%"
            className="text-4xl font-black text-slate-900"
          />
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Rate</span>
        </motion.div>
        
        <motion.span 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-[10px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-wider ${getRiskStyles()}`}
        >
          {risk} RISK
        </motion.span>
      </div>
      
      <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className={`h-full rounded-full ${getBarColor()}`}
        />
      </div>
      
      <p className="text-[10px] text-slate-500 mt-3 font-extrabold uppercase tracking-wider">AI Analysis based on recent oral check-ins</p>
    </div>
  );
};

export default AdherenceCard;
