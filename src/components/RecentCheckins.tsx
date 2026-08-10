import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { CheckIn } from '../lib/storage';

interface RecentCheckinsProps {
  checkIn: CheckIn | null;
  onToggle: (type: 'AM' | 'PM' | 'Floss') => void;
}

const RecentCheckins: React.FC<RecentCheckinsProps> = ({ checkIn, onToggle }) => {
  const items = [
    {
      key: 'AM' as const,
      title: 'AM Brushing',
      subtitle: checkIn?.brushingAM ? 'Completed today at 8:00 AM' : '8:00 AM Daily Schedule',
      isDone: !!checkIn?.brushingAM,
    },
    {
      key: 'PM' as const,
      title: 'PM Brushing',
      subtitle: checkIn?.brushingPM ? 'Completed today at 9:00 PM' : '9:00 PM Daily Schedule',
      isDone: !!checkIn?.brushingPM,
    },
    {
      key: 'Floss' as const,
      title: 'Flossing Routine',
      subtitle: checkIn?.flossing ? 'Completed today at 9:30 PM' : '9:30 PM Daily Schedule',
      isDone: !!checkIn?.flossing,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">Daily Routine Check-in</h3>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-50 text-[#0EA5A8] border border-teal-200">
          Today
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.key}
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
              item.isDone
                ? 'bg-emerald-50/60 border-emerald-200/80'
                : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  item.isDone
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                <Check className={`w-5 h-5 transition-transform ${item.isDone ? 'stroke-[3]' : 'stroke-2'}`} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">{item.title}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">{item.subtitle}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onClick={() => onToggle(item.key)}
              className={`relative overflow-hidden text-[10px] font-black px-4 py-2 rounded-xl border uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs ${
                item.isDone
                  ? 'text-emerald-800 bg-emerald-100 border-emerald-300 hover:bg-emerald-200'
                  : 'text-white bg-gradient-to-r from-[#0EA5A8] to-[#2563EB] border-teal-400/30 hover:shadow-md hover:shadow-teal-500/20'
              }`}
            >
              <span className="flex items-center gap-1">
                {item.isDone ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>DONE</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>MARK</span>
                  </>
                )}
              </span>
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCheckins;
