import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, useIonViewWillEnter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { storage, Scan, CheckIn } from '../lib/storage';
import PlaqueClassCard from '../components/PlaqueClassCard';
import AdherenceCard from '../components/AdherenceCard';
import RecentCheckins from '../components/RecentCheckins';
import { ShieldCheck, History as HistoryIcon, ArrowRight, Camera, Sparkles } from 'lucide-react';
import { staggerContainer } from '../lib/motion-variants';
import Button from '../components/ui/Button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [latestScan, setLatestScan] = useState<Scan | null>(null);
  const [todayCheckIn, setTodayCheckIn] = useState<CheckIn | null>(null);
  const [adherenceStats, setAdherenceStats] = useState({ probability: 0, risk: 'High' as 'Low' | 'Medium' | 'High' });

  useEffect(() => {
    loadData();
  }, [user]);

  useIonViewWillEnter(() => {
    loadData();
  });

  const loadData = async () => {
    const currentUserId = user?.id || 'guest_dentist_session';
    const scans = await storage.getScans(currentUserId);
    const sortedScans = scans.sort((a, b) => b.date.localeCompare(a.date));
    setLatestScan(sortedScans[0] || null);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayCI = await storage.getCheckInByDate(currentUserId, todayStr);
    setTodayCheckIn(todayCI || null);

    calculateAdherence(currentUserId);
  };

  const calculateAdherence = async (userId: string) => {
    const checkins = await storage.getCheckInsRecent(userId, 7);
    if (checkins.length === 0) {
      setAdherenceStats({ probability: 0, risk: 'High' });
      return;
    }

    const totalActions = checkins.length * 3;
    const completedActions = checkins.reduce((acc, ci) => {
      return acc + (ci.brushingAM ? 1 : 0) + (ci.brushingPM ? 1 : 0) + (ci.flossing ? 1 : 0);
    }, 0);

    const exactRate = completedActions / totalActions;
    const roundedProb = Math.round(exactRate * 100) / 100;
    
    let risk: 'Low' | 'Medium' | 'High' = 'High';
    if (exactRate >= 0.7) {
      risk = 'Low';
    } else if (exactRate >= 0.4) {
      risk = 'Medium';
    } else {
      risk = 'High';
    }

    setAdherenceStats({
      probability: roundedProb,
      risk
    });
  };

  const handleToggleCheckIn = async (type: 'AM' | 'PM' | 'Floss') => {
    const currentUserId = user?.id || 'guest_dentist_session';
    const todayStr = new Date().toISOString().split('T')[0];
    const current = todayCheckIn ? { ...todayCheckIn } : {
      id: crypto.randomUUID(),
      userId: currentUserId,
      date: todayStr,
      brushingAM: false,
      brushingPM: false,
      flossing: false
    };

    if (type === 'AM') current.brushingAM = !current.brushingAM;
    if (type === 'PM') current.brushingPM = !current.brushingPM;
    if (type === 'Floss') current.flossing = !current.flossing;

    await storage.saveCheckIn(current);
    setTodayCheckIn(current);
    await calculateAdherence(currentUserId);
  };

  return (
    <IonPage>
      {/* Mobile Top Header (hidden on desktop) */}
      <IonHeader className="ion-no-border md:hidden">
        <IonToolbar className="px-4 bg-white">
          <IonTitle className="font-black text-xl text-slate-800">Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="bg-[#F8FAFC]">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24"
        >
          {/* Header Banner - Desktop Only */}
          <div className="hidden md:flex items-center justify-between border-b border-slate-200 pb-5 mb-4 select-none">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Compliance Workspace</span>
                <span className="text-[10px] font-black tracking-widest bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-500/10">ACTIVE PREVIEW</span>
              </h1>
              <p className="text-xs font-bold text-slate-400 mt-1">AI plaque tracking diagnostics and preventative adherence trends</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="primary"
                size="md"
                glow={true}
                leftIcon={<Camera className="w-4 h-4" />}
                rightIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-300" />}
                onClick={() => history.push('/app/scan')}
              >
                Scan Teeth
              </Button>

              {user && (
                <div className="flex items-center space-x-3 text-right border-l border-slate-200 pl-4">
                  <div>
                    <span className="block text-xs font-black text-slate-800 leading-none">Welcome, {user.name}</span>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Profile Level A</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Grid Wrapper */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Primary Columns (8 spans) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Plaque level and adherence calculations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PlaqueClassCard 
                  level={latestScan?.plaqueClass || 'No Data'} 
                  confidence={latestScan?.confidence}
                  lastScanDate={latestScan?.date}
                  label={latestScan?.label}
                  labelId={latestScan?.labelId}
                  classNameLabel={latestScan?.className}
                  modelType={latestScan?.modelType}
                />
                <AdherenceCard 
                  probability={adherenceStats.probability} 
                  risk={adherenceStats.risk} 
                />
              </div>

              {/* Comprehensive logs redirection */}
              <div>
                <Button 
                  variant="secondary"
                  size="lg"
                  leftIcon={<HistoryIcon className="w-4 h-4" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full text-xs font-black uppercase tracking-wider"
                  onClick={() => history.push('/app/history')}
                >
                  View Full Scan History
                </Button>
              </div>

            </div>

            {/* Sidebar Columns (4 spans) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Daily Routine Check-in card */}
              <RecentCheckins 
                checkIn={todayCheckIn} 
                onToggle={handleToggleCheckIn} 
              />

              {/* Embedded Report Prompt */}
              <div className="bg-[#2563EB]/5 p-5 rounded-3xl border border-[#2563EB]/10 flex items-center justify-between shadow-xs">
                <div className="mr-3">
                  <p className="text-xs font-black text-[#2563EB] uppercase tracking-wider">Weekly Report Ready</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold">Your latest clinical-aligned reports are compiled.</p>
                </div>
                <Button 
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => history.push('/app/report')}
                  className="shrink-0 text-[10px] font-black uppercase tracking-wider"
                >
                  View
                </Button>
              </div>

              {/* Local safety alert note */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-150 flex items-start space-x-3 text-[10px] font-bold text-slate-400 leading-relaxed uppercase select-none">
                <ShieldCheck className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span>Sandbox Security: Images processed locally remain stored on current workspace storage indices. No logs leave your current hardware sandbox.</span>
              </div>

            </div>

          </div>

        </motion.div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
