import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Brain, Sparkles } from 'lucide-react';

interface ScanningOverlayProps {
  stage: 'quality' | 'matching' | 'finalizing';
  onComplete?: () => void;
}

const ScanningOverlay: React.FC<ScanningOverlayProps> = ({ stage }) => {
  const stages = {
    quality: { icon: Shield, label: 'Verifying Quality', color: 'text-cyan-500' },
    matching: { icon: Brain, label: 'Matching Datasets', color: 'text-blue-500' },
    finalizing: { icon: Sparkles, label: 'Finalizing Results', color: 'text-emerald-500' },
  };

  const CurrentIcon = stages[stage].icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-[#0EA5A8] shadow-lg shadow-[#0EA5A8]/10"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentIcon className={`w-8 h-8 ${stages[stage].color}`} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]"
          >
            {stages[stage].label}
          </motion.p>
        </AnimatePresence>
        <div className="flex items-center justify-center gap-1 mt-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${i === Object.keys(stages).indexOf(stage) ? 'bg-[#0EA5A8]' : 'bg-slate-200'}`}
              animate={i === Object.keys(stages).indexOf(stage) ? { scale: [1, 1.5, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanningOverlay;
