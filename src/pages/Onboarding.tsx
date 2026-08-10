import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Activity, FileText, ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

interface OnboardingSlide {
  id: number;
  badge: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  features: string[];
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    badge: 'Step 01 / 03',
    title: 'AI Tooth & Plaque Scanning',
    description: 'Capture or upload oral snapshots to perform computer-vision plaque detection in seconds.',
    icon: <Camera className="w-12 h-12 text-blue-600 dark:text-blue-400" />,
    gradient: 'from-blue-500/20 via-teal-500/10 to-transparent',
    features: ['Instant camera photo capture', 'Automatic lighting & angle guide', 'In-browser local photo analysis']
  },
  {
    id: 2,
    badge: 'Step 02 / 03',
    title: 'Real-Time Biofilm Classification',
    description: 'Get precise plaque severity scores, risk density ratings, and targeted arch brushing tips.',
    icon: <Activity className="w-12 h-12 text-teal-600 dark:text-teal-400" />,
    gradient: 'from-teal-500/20 via-emerald-500/10 to-transparent',
    features: ['Low / Moderate / Severe classification', 'Tooth arch density mapping', 'Personalized cleaning guidelines']
  },
  {
    id: 3,
    badge: 'Step 03 / 03',
    title: 'Clinical Reports & Routine Tracking',
    description: 'Monitor morning/evening brushing adherence, log flossing, and export shareable PDF reports.',
    icon: <FileText className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />,
    gradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',
    features: ['7-day compliance habit tracking', 'Historical scan timeline', 'Clinical PDF export for your dentist']
  }
];

const Onboarding: React.FC = () => {
  const history = useHistory();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = slides[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      history.push('/login');
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    history.push('/login');
  };

  return (
    <IonPage>
      <IonContent className="bg-slate-50 dark:bg-slate-950 font-sans">
        <div className="min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 max-w-lg mx-auto relative overflow-hidden select-none">
          
          {/* Top Bar with Skip */}
          <div className="flex items-center justify-between z-10 pt-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">DentaScan</span>
            </div>

            <button
              onClick={handleSkip}
              className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800"
            >
              Skip
            </button>
          </div>

          {/* Animated Slide Card */}
          <div className="my-auto py-8 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, x: 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.98 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-500/5 space-y-6 relative overflow-hidden"
              >
                {/* Background Gradient Blob */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${currentSlide.gradient} rounded-full blur-2xl pointer-events-none`} />

                {/* Badge Tag */}
                <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span>{currentSlide.badge}</span>
                </div>

                {/* Illustration Icon */}
                <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-inner my-2">
                  {currentSlide.icon}
                </div>

                {/* Header & Body */}
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {currentSlide.title}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold leading-relaxed">
                    {currentSlide.description}
                  </p>
                </div>

                {/* Bullet Points */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {currentSlide.features.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls & Pagination */}
          <div className="z-10 space-y-6 pb-4">
            
            {/* Pagination Dots */}
            <div className="flex items-center justify-center space-x-2">
              {slides.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentSlideIndex
                      ? 'w-8 bg-gradient-to-r from-blue-600 to-teal-500'
                      : 'w-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-3">
              {currentSlideIndex > 0 && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handlePrev}
                  className="px-4"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-5 h-5" />}
              >
                {currentSlideIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
              </Button>
            </div>

          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
