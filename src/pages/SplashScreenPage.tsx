import React, { useEffect, useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { motion } from 'motion/react';
import { Activity, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';

const SplashScreenPage: React.FC = () => {
  const history = useHistory();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    history.push('/onboarding');
  };

  return (
    <IonPage>
      <IonContent className="bg-slate-900 text-white font-sans">
        <div className="min-h-screen w-full flex flex-col items-center justify-between p-6 sm:p-10 relative overflow-hidden bg-slate-950 text-white select-none">
          
          {/* Ambient Lighting FX */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-teal-500/20 to-emerald-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          {/* Top Brand Tag */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6 z-10 flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-300">
              DentaScan Clinical Platform v2.4
            </span>
          </motion.div>

          {/* Center Branding Content */}
          <div className="my-auto z-10 flex flex-col items-center text-center space-y-6 max-w-sm">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-tr from-blue-600 via-teal-500 to-emerald-400 rounded-3xl p-0.5 shadow-2xl shadow-teal-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-teal-500/20" />
                  <Activity className="w-14 h-14 text-teal-400 animate-pulse" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-xl border-2 border-slate-950 shadow-lg">
                <ShieldCheck className="w-4 h-4 stroke-[3]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                DentaScan
              </h1>
              <p className="text-teal-400 text-xs font-extrabold uppercase tracking-widest">
                AI Oral Diagnostics & Biofilm Suite
              </p>
              <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-xs pt-1">
                Precision tooth scanning, real-time plaque analysis, and clinical dental reporting.
              </p>
            </motion.div>

            {/* Progress indicator */}
            <div className="w-full space-y-2 pt-4">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>SYSTEM INIT</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-sm pb-6 z-10 space-y-4 text-center"
          >
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleContinue}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started
            </Button>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              HIPAA Compliant &bull; Encrypted Storage
            </p>
          </motion.div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default SplashScreenPage;
