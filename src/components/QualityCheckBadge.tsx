import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface QualityCheckBadgeProps {
  status: 'idle' | 'checking' | 'pass' | 'fail';
  reason?: string;
}

const QualityCheckBadge: React.FC<QualityCheckBadgeProps> = ({ status, reason }) => {
  if (status === 'idle') return null;

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 text-slate-500 font-bold text-xs animate-pulse">
        <AlertCircle className="w-4 h-4" />
        ANALYZING IMAGE QUALITY...
      </div>
    );
  }

  if (status === 'pass') {
    return (
      <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest bg-green-50 px-4 py-2 rounded-lg border border-green-100">
        <CheckCircle2 className="w-4 h-4" />
        Quality Check Passed
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4 bg-red-50 rounded-xl border border-red-100">
      <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest">
        <XCircle className="w-4 h-4" />
        Quality Check Failed
      </div>
      <p className="text-[11px] font-bold text-red-400">{reason}</p>
    </div>
  );
};

export default QualityCheckBadge;
