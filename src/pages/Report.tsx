import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle } from '@ionic/react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storage, Scan, CheckIn } from '../lib/storage';
import { reportGenerator } from '../lib/report-generator';
import { 
  FileText, Download, ShieldCheck, CheckCircle2, 
  Activity, Calendar, Eye, Camera, Award, Clock
} from 'lucide-react';
import { fadeInUp, staggerContainer } from '../lib/motion-variants';
import Button from '../components/ui/Button';

const Report: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [scans, setScans] = useState<Scan[]>([]);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    const currentUserId = user?.id || 'guest_dentist_session';
    const s = await storage.getScans(currentUserId);
    const ci = await storage.getCheckInsRecent(currentUserId, 7);
    setScans(s.sort((a, b) => b.date.localeCompare(a.date)));
    setCheckins(ci);
  };

  const handleDownload = async () => {
    if (!user) return;
    setIsGenerating(true);
    try {
      const doc = reportGenerator.generatePDF(user.name, scans, checkins);
      reportGenerator.download(doc, `dentascan-report-${user.name.replace(/\s/g, '-')}.pdf`);
      showToast('Report downloaded successfully', 'success');
    } catch (e) {
      showToast('Export failed', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const latestScan = scans[0] || null;

  const getPlaqueBadge = (plaqueClass: string) => {
    switch (plaqueClass) {
      case 'Low':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
          label: 'Low Plaque Density'
        };
      case 'Medium':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500',
          label: 'Moderate Plaque Risk'
        };
      case 'High':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500',
          label: 'Elevated Plaque Density'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: plaqueClass || 'Recorded Scan'
        };
    }
  };

  return (
    <IonPage>
      {/* Mobile-Only Header */}
      <IonHeader className="ion-no-border md:hidden">
        <IonToolbar className="px-4">
          <IonTitle className="font-black text-xl">Clinical Report</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
          
          {/* Desktop-Only Header Banner */}
          <div className="hidden md:flex flex-col border-b border-slate-200 pb-5 mb-4 select-none">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Report Deck</h1>
            <p className="text-xs font-bold text-slate-400 mt-1">Compile comprehensive oral health metrics and share secure PDF compilations with your dentist</p>
          </div>

          {/* Majestic Responsive Grid layout */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            
            {/* Left Column (6 spans) - Visual Summary & Live Report Preview */}
            <div className="lg:col-span-6 space-y-6">
              
              <motion.div variants={fadeInUp} className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-150 shadow-xs space-y-6">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#14B8A6] via-[#2563EB] to-[#10B981] rounded-2xl flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 tracking-tight">Your Health Summary</h2>
                      <p className="text-[10px] font-extrabold text-[#14B8A6] uppercase tracking-wider">PDF Report Live Preview</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-slate-200/60">
                    <Eye className="w-3 h-3 text-[#14B8A6]" /> Live Document
                  </span>
                </div>

                {/* Patient Meta row */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</span>
                    <span className="font-black text-slate-800">{user?.name || 'Guest Patient'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report Date</span>
                    <span className="font-black text-slate-800">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Latest Scan Details Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#14B8A6]" /> Latest Scan Diagnostics
                    </h3>
                    {latestScan && (
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(latestScan.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {latestScan ? (
                    <div className="p-4 bg-gradient-to-br from-slate-50 via-teal-50/20 to-blue-50/20 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="flex items-start gap-4">
                        {/* Scan Image Thumbnail */}
                        {latestScan.imageUrl ? (
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0 group">
                            <img 
                              src={latestScan.imageUrl} 
                              alt="Latest Oral Scan" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-slate-900/10" />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-slate-200/80 border border-slate-300/60 flex flex-col items-center justify-center text-slate-400 shrink-0">
                            <Camera className="w-6 h-6 mb-1" />
                            <span className="text-[9px] font-bold">No Image</span>
                          </div>
                        )}

                        {/* Scan Metrics */}
                        <div className="flex-1 space-y-2">
                          {(() => {
                            const badge = getPlaqueBadge(latestScan.plaqueClass);
                            return (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${badge.bg}`}>
                                  <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                                  {badge.label}
                                </span>
                                <span className="text-[10px] font-black px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-lg">
                                  {(latestScan.confidence * 100).toFixed(0)}% AI Precision
                                </span>
                              </div>
                            );
                          })()}

                          <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
                            <div className="flex justify-between text-[11px] font-bold text-slate-600">
                              <span>Classification:</span>
                              <span className="text-slate-900 font-black">{latestScan.className || `Plaque Class ${latestScan.plaqueClass}`}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold text-slate-600">
                              <span>Recorded Time:</span>
                              <span className="text-slate-700 font-semibold flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {new Date(latestScan.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                      <Camera className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-600">No oral scans recorded yet</p>
                      <p className="text-[10px] text-slate-400 font-medium max-w-xs mx-auto">Perform a scan in the Scan tab to generate detailed plaque diagnostics for your clinical report.</p>
                    </div>
                  )}
                </div>

                {/* 7-Day Adherence Snapshot */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#10B981]" /> 7-Day Brushing & Flossing Snapshot
                    </h3>
                    <span className="text-[10px] font-extrabold text-[#10B981]">
                      {checkins.length}/7 Days Logged
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">AM Brushing</span>
                      <span className="block text-sm font-black text-slate-800 mt-0.5">
                        {checkins.filter(c => c.brushingAM).length} <span className="text-[10px] text-slate-400 font-medium">/ 7</span>
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">PM Brushing</span>
                      <span className="block text-sm font-black text-slate-800 mt-0.5">
                        {checkins.filter(c => c.brushingPM).length} <span className="text-[10px] text-slate-400 font-medium">/ 7</span>
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">Flossing</span>
                      <span className="block text-sm font-black text-slate-800 mt-0.5">
                        {checkins.filter(c => c.flossing).length} <span className="text-[10px] text-slate-400 font-medium">/ 7</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Scan History Mini Log (Up to 3) */}
                {scans.length > 1 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Previous Scans in Report History</span>
                    <div className="space-y-1.5">
                      {scans.slice(1, 4).map((s, idx) => {
                        const b = getPlaqueBadge(s.plaqueClass);
                        return (
                          <div key={s.id || idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-100">
                            <span className="text-slate-600 font-bold">{new Date(s.date).toLocaleDateString()}</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${b.bg}`}>
                              Plaque {s.plaqueClass} ({(s.confidence * 100).toFixed(0)}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </motion.div>

              {/* Contents index checklist */}
              <motion.div variants={fadeInUp} className="bg-white p-6 rounded-[32px] border border-slate-150 shadow-xs">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-3 select-none">PDF Report Features Index</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Latest Plaque Classifications',
                    '7-Day Adherence Percentage',
                    'AI Biofilm Predictions',
                    'Biometric Guidance Log'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0" />
                      <span className="text-xs font-black tracking-wide text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

            </div>

            {/* Right Column (6 spans) - Interactive export controls */}
            <div className="lg:col-span-6 space-y-6">
              
              <motion.div variants={fadeInUp} className="bg-white p-8 rounded-[32px] border border-slate-150 shadow-xs space-y-6">
                
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider select-none">Export Control Center</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Generate and download a comprehensive clinical PDF report containing plaque diagnostics, confidence scores, and 7-day adherence logs.
                  </p>
                </div>

                <div className="pt-2">
                  <Button 
                    variant="emerald"
                    onClick={handleDownload}
                    isLoading={isGenerating}
                    size="lg"
                    glow={true}
                    leftIcon={<Download className="w-5 h-5" />}
                    className="w-full text-xs font-black uppercase tracking-wider py-4"
                  >
                    Download PDF Report
                  </Button>
                </div>

              </motion.div>

              {/* Info Disclaimer Badge */}
              <motion.div variants={fadeInUp} className="p-5 rounded-[24px] bg-slate-50 border border-slate-150 flex items-start space-x-3 text-[10px] font-bold text-slate-400 leading-relaxed uppercase select-none">
                <ShieldCheck className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span>Notice: Automated summaries align with dental indicators. These summaries do not replace in-person professional dental checkups or cleaning.</span>
              </motion.div>

            </div>

          </motion.div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Report;

