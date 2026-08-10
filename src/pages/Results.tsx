import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonBackButton, IonButtons } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { motion } from 'motion/react';
import { storage, Scan } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import PlaqueClassCard from '../components/PlaqueClassCard';
import { CheckCircle, Share2, ArrowRight, ShieldCheck } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleUp } from '../lib/motion-variants';
import Button from '../components/ui/Button';

const Results: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const { user } = useAuth();
  const history = useHistory();
  const [scan, setScan] = useState<Scan | null>(null);

  useEffect(() => {
    if (user && scanId) {
      loadScan();
    }
  }, [user, scanId]);

  const loadScan = async () => {
    const scans = await storage.getScans(user!.id);
    const found = scans.find(s => s.id === scanId);
    if (found) setScan(found);
  };

  if (!scan) return null;

  return (
    <IonPage>
      {/* Mobile-Only Header */}
      <IonHeader className="ion-no-border md:hidden">
        <IonToolbar className="px-4">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/dashboard" />
          </IonButtons>
          <IonTitle className="font-black text-xl">Analysis Result</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
          
          {/* Desktop-Only Header Banner */}
          <div className="hidden md:flex flex-col border-b border-slate-200 pb-5 mb-4 select-none">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Diagnostic Metrics</h1>
            <p className="text-xs font-bold text-slate-400 mt-1">Review finalized computer vision plaque severity classifications and clinical recommendations</p>
          </div>

          {/* Majestic Responsive Grid layout */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            
            {/* Left Column (6 spans): Scan Photo Media area */}
            <div className="lg:col-span-6 space-y-6">
              
              <motion.div variants={fadeInUp} className="flex flex-col items-center py-6 text-center space-y-3 bg-white p-6 border border-slate-150 rounded-[32px] shadow-xs">
                <motion.div 
                  variants={scaleUp}
                  className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-500/10 shadow-sm"
                >
                  <CheckCircle className="w-8 h-8" />
                </motion.div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Analysis Complete</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider max-w-xs">Matched locally inside current browser sandbox context</p>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="aspect-video rounded-[32px] overflow-hidden shadow-lg border-2 border-slate-150/60 bg-slate-900 relative group"
              >
                <img src={scan.imageUrl} alt="Oral Snapshot" className="w-full h-full object-cover" />
              </motion.div>

            </div>

            {/* Right Column (6 spans): Plaque Class & Clinical Guidance */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Plaque class scoring details */}
              <motion.div variants={fadeInUp}>
                <PlaqueClassCard 
                  level={scan.plaqueClass} 
                  confidence={scan.confidence}
                  lastScanDate={scan.date}
                  label={scan.label}
                  labelId={scan.labelId}
                  classNameLabel={scan.className}
                  modelType={scan.modelType}
                />
              </motion.div>

              {/* Clinical insights */}
              <motion.div variants={fadeInUp} className="bg-white p-6 rounded-[32px] border border-slate-154 border-slate-150 shadow-xs">
                <h3 className="font-black text-xs text-[#2563EB] uppercase tracking-widest mb-4 border-b border-slate-50 pb-3 select-none">Clinical Guidelines</h3>
                <p className="text-xs sm:text-sm text-slate-650 font-bold uppercase tracking-wide leading-relaxed text-slate-500">
                  {scan.plaqueClass === 'Low' && scan.confidence === 0 && "Your enamel index is healthy! Maintain your dual brush-floss loop to sustain high oral hygiene thresholds."}
                  {scan.plaqueClass === 'Low' && scan.confidence > 0 && "Mild plaque detected. Gently spend an additional 30 seconds on front teeth arches & adjust brushing pressure."}
                  {scan.plaqueClass === 'Medium' && "Moderate plaque biofilm detected. Focus brushing on molar lines & adjust flossing frequency to twice daily."}
                  {scan.plaqueClass === 'High' && "Severe plaque build-up detected. Spend dedicated efforts adapting standard 45-degree roll brush angles, and prioritize a dental cleaning checkup soon."}
                </p>
              </motion.div>

              {/* Navigation button columns */}
              <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  variant="accent"
                  size="lg"
                  glow={true}
                  leftIcon={<Share2 className="w-4 h-4" />}
                  className="text-xs font-black uppercase tracking-wider"
                  onClick={() => history.push('/app/report')}
                >
                  View Report
                </Button>
                <Button 
                  variant="primary"
                  size="lg"
                  glow={true}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="text-xs font-black uppercase tracking-wider"
                  onClick={() => history.push('/app/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </motion.div>

              {/* Sandbox disclaimer info */}
              <motion.div variants={fadeInUp} className="p-5 rounded-[24px] bg-slate-50 border border-slate-150 flex items-start space-x-3 text-[10px] font-bold text-slate-400 leading-relaxed uppercase select-none">
                <ShieldCheck className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span>Sandbox Security: Photo indexings and clinical scores remain stored strictly in device cache. All actions conform with secure offline sandbox rules.</span>
              </motion.div>

            </div>

          </motion.div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Results;
