import React, { useEffect, useState } from 'react';
import { useReducedMotion, motion, AnimatePresence } from 'motion/react';
import { Camera } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, shouldReduceMotion ? 1000 : 2000);

    return () => clearTimeout(timer);
  }, [onComplete, shouldReduceMotion]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden bg-white"
        >
          {/* Animated Gradient Background - Disabled if reduced motion is requested */}
          {!shouldReduceMotion && (
            <motion.div 
              animate={{
                background: [
                  'linear-gradient(45deg, #0EA5A8 0%, #2563EB 100%)',
                  'linear-gradient(45deg, #2563EB 0%, #0EA5A8 100%)',
                  'linear-gradient(45deg, #0EA5A8 0%, #2563EB 100%)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0"
            />
          )}

          {shouldReduceMotion && <div className="absolute inset-0 bg-[#0EA5A8]" />}
          
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              transition={{
                type: shouldReduceMotion ? "tween" : "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl mb-6"
            >
              <Camera className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-black text-white tracking-tighter"
            >
              DentaScan
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/60 text-xs font-bold uppercase tracking-[0.3em] mt-2"
            >
              Ai Dental Assistant
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
