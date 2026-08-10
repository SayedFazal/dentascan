import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, useIonViewWillEnter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import MouthCapture from '../components/MouthCapture';
import QualityCheckBadge from '../components/QualityCheckBadge';
import ScanningOverlay from '../components/ScanningOverlay';
import { imageUtils } from '../lib/image-utils';
import { datasetMatcher } from '../lib/dataset-matcher';
import { storage } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Video, HelpCircle, Activity, Sparkles } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../lib/motion-variants';
import Button from '../components/ui/Button';

const Scan: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [capturedFileName, setCapturedFileName] = useState<string>('');
  const [qualityStatus, setQualityStatus] = useState<'idle' | 'checking' | 'pass' | 'fail'>('idle');
  const [errorReason, setErrorReason] = useState<string | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<'quality' | 'matching' | 'finalizing'>('quality');
  const [scanKey, setScanKey] = useState(0);

  useIonViewWillEnter(() => {
    setImageSrc(null);
    setCapturedFileName('');
    setQualityStatus('idle');
    setErrorReason(undefined);
    setIsAnalyzing(false);
    setAnalysisStage('quality');
    setScanKey(prev => prev + 1);
  });

  const handleCapture = async (src: string, filename?: string) => {
    setImageSrc(src);
    setCapturedFileName(filename || '');
    setQualityStatus('checking');
    setErrorReason(undefined);

    try {
      const quality = await imageUtils.checkQuality(src, filename);
      if (quality.isValid) {
        setQualityStatus('pass');
      } else {
        setQualityStatus('fail');
        setErrorReason(quality.reason);
      }
    } catch (e) {
      setQualityStatus('fail');
      setErrorReason('Could not analyze image. Please try again.');
    }
  };

  const handleAnalyze = async () => {
    if (!imageSrc) return;
    const currentUserId = user?.id || 'guest_dentist_session';
    setIsAnalyzing(true);
    setAnalysisStage('quality');
    
    try {
      await new Promise(r => setTimeout(r, 800));
      setAnalysisStage('matching');
      
      const match = await datasetMatcher.findMatch(imageSrc, capturedFileName);
      
      await new Promise(r => setTimeout(r, 1200));
      setAnalysisStage('finalizing');
      await new Promise(r => setTimeout(r, 600));

      if (match) {
        const scanId = crypto.randomUUID();
        const compressedImage = await imageUtils.compressImage(imageSrc, 800, 0.75);
        await storage.saveScan({
          id: scanId,
          userId: currentUserId,
          date: new Date().toISOString(),
          imageUrl: compressedImage,
          plaqueClass: match.plaqueClass,
          confidence: match.confidence,
          matchedSampleId: match.sampleId,
          label: match.label,
          labelId: match.labelId,
          className: match.className,
          modelType: 'ViTForImageClassification (224x224)'
        });
        history.push(`/app/results/${scanId}`);
      } else {
        setQualityStatus('fail');
        setIsAnalyzing(false);
        setErrorReason('No dataset match found. Please retake with front teeth centered.');
      }
    } catch (e) {
      setIsAnalyzing(false);
      setErrorReason('Analysis failed. Please try again.');
    }
  };

  return (
    <IonPage>
      {/* Mobile Header (hidden on desktop) */}
      <IonHeader className="ion-no-border md:hidden">
        <IonToolbar className="px-4">
          <IonTitle className="font-black text-xl">Capture Scan</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
          
          {/* Desktop header banner */}
          <div className="hidden md:flex flex-col border-b border-slate-200 pb-5 mb-4 select-none">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Scanning Suite</h1>
            <p className="text-xs font-bold text-slate-400 mt-1">Capture or upload an oral photo to parse plaque biofilm build-ups locally</p>
          </div>

          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex items-center justify-center min-h-[50vh] bg-white border border-slate-150 rounded-[32px] p-12 shadow-sm"
              >
                <ScanningOverlay stage={analysisStage} />
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                
                {/* Left Column: Capture Canvas (7 spans) */}
                <motion.div variants={fadeInUp} className="lg:col-span-7 bg-white p-6 rounded-[32px] border border-slate-150 shadow-xs">
                  <div className="flex items-center space-x-2.5 mb-4 select-none border-b border-slate-50 pb-3">
                    <div className="w-8 h-8 bg-teal-50 text-[#0EA5A8] rounded-lg flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Step 1: Focus Capture</h3>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">Use camera feed or drop direct dental snapshots</p>
                    </div>
                  </div>
                  
                  <MouthCapture key={scanKey} onCapture={handleCapture} />
                </motion.div>

                {/* Right Column: Indicators and Controls (5 spans) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Quality assessment card */}
                  <motion.div variants={fadeInUp}>
                    <QualityCheckBadge status={qualityStatus} reason={errorReason} />
                  </motion.div>

                  {/* Dynamic Action Trigger Panel */}
                  <AnimatePresence>
                    {qualityStatus === 'pass' && (
                      <motion.div 
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="bg-white p-6 rounded-[32px] border-2 border-[#0EA5A8]/20 shadow-xl shadow-teal-500/5"
                      >
                        <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider mb-2">Step 2: Start Diagnostics</h3>
                        <p className="text-[11px] text-slate-500 mb-6 font-semibold leading-relaxed">
                          The image passes all local quality indicators. Start our local sandbox network parameters comparison match pass.
                        </p>
                        <Button 
                          onClick={handleAnalyze} 
                          variant="primary"
                          size="lg"
                          glow={true}
                          leftIcon={<Activity className="w-5 h-5" />}
                          rightIcon={<Sparkles className="w-4 h-4 text-emerald-300" />}
                          className="w-full text-xs font-black uppercase tracking-wider"
                        >
                          Analyze Oral Photo Now
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Helpful diagnostics instructions */}
                  <motion.div variants={fadeInUp} className="p-6 bg-slate-50 rounded-[32px] border border-slate-150 relative">
                    <div className="absolute top-6 right-6 text-slate-300">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 select-none">Quality checklist guidelines</p>
                    <ul className="text-[11px] text-slate-500 space-y-2.5 font-bold uppercase tracking-wide list-inside list-none select-none">
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-teal-500 rounded-full" /> Use bright, direct, indirect sunlight.</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-teal-500 rounded-full" /> Center your front teeth on viewport grid.</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-teal-500 rounded-full" /> Retain 10cm bounds to prevent camera blur.</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-teal-500 rounded-full" /> Clean your hardware lens with standard microfibres.</li>
                    </ul>
                  </motion.div>

                  {/* Local sandboxing disclaimer */}
                  <motion.div variants={fadeInUp} className="p-5 rounded-[24px] bg-[#2563EB]/5 border border-[#2563EB]/10 flex items-start space-x-3 text-[10px] font-bold text-slate-400 leading-relaxed uppercase select-none">
                    <ShieldCheck className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                    <span>In-Memory Safe: Image analysis execute entirely inside local runtime thread partitions. Your image details never exit browser context records.</span>
                  </motion.div>

                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Scan;
