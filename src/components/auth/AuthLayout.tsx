import React from 'react';
import { Activity, ShieldCheck, HeartPulse, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthLayoutProps {
  children: React.ReactNode;
  badgeText?: string;
  title?: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  badgeText = 'AI Healthcare Suite',
  title = 'DentaScan',
  subtitle = 'Clinical oral health diagnostics & biofilm tracking'
}) => {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:grid lg:grid-cols-12 font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* Healthcare AI Illustration Side Panel (Desktop Only) */}
      <div className="hidden lg:col-span-5 lg:flex flex-col justify-between bg-slate-900 text-white p-10 xl:p-12 relative overflow-hidden select-none border-r border-slate-800">
        
        {/* Ambient Background Glows */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header Branding */}
        <div className="flex items-center space-x-3.5 z-10">
          <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 via-teal-500 to-emerald-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/25">
            <Activity className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white leading-none">DentaScan</span>
            <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-widest mt-1">{badgeText}</span>
          </div>
        </div>

        {/* Diagnostic Feature Visual Box */}
        <div className="my-auto py-6 z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full max-w-sm bg-gradient-to-b from-slate-800/80 to-slate-900/90 rounded-3xl p-6 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-5"
          >
            {/* Simulated Diagnostic Scanner Visual */}
            <div className="relative h-44 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:12px_12px] opacity-25" />
              
              {/* Central Heartbeat / Scan Icon */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-teal-500/20 border border-teal-500/40 flex items-center justify-center animate-pulse">
                  <HeartPulse className="w-10 h-10 text-teal-400" />
                </div>
                <span className="mt-3 text-[10px] font-black uppercase tracking-widest text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30">
                  AI Biofilm Diagnostics
                </span>
              </div>

              {/* Scanning Glow Effect */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_12px_#14b8a6] animate-bounce top-12" />
            </div>

            {/* Feature highlights */}
            <div className="space-y-2.5 pt-1">
              {[
                'Instant Plaque Classification & Density Rating',
                '7-Day Brushing & Flossing Routine Tracking',
                'Clinical PDF Health Report Generation'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2.5 text-xs text-slate-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-2 text-center lg:text-left max-w-sm mx-auto">
            <h2 className="text-2xl xl:text-3xl font-black leading-tight tracking-tight text-white">
              {title}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Footer Trust Badges */}
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between border-t border-slate-800/80 pt-4 z-10">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit Encrypted Platform
          </span>
          <span className="text-slate-500">HIPAA Compliant</span>
        </div>
      </div>

      {/* Main Authentication Content Panel */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center min-h-screen px-4 sm:px-8 py-10 lg:p-16 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Header Branding */}
          <div className="flex lg:hidden items-center justify-between mb-8">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">DentaScan</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Medical Suite
            </span>
          </div>

          {children}
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
