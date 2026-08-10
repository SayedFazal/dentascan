import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonButtons, IonBackButton, useIonViewWillEnter } from '@ionic/react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storage, Scan } from '../lib/storage';
import { Calendar, ChevronRight, Info, Camera, Trash2, AlertTriangle, X } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from '../components/ui/Button';

const ScanHistory: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const history = useHistory();
  const [scans, setScans] = useState<Scan[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [user]);

  useIonViewWillEnter(() => {
    loadHistory();
  });

  const loadHistory = async () => {
    const currentUserId = user?.id || 'guest_dentist_session';
    const allScans = await storage.getScans(currentUserId);
    setScans(allScans.sort((a, b) => b.date.localeCompare(a.date)));
  };

  const handleDeleteSingle = async (scanId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const currentUserId = user?.id || 'guest_dentist_session';
      await storage.deleteScan(scanId, currentUserId);
      setScans((prev) => prev.filter((s) => s.id !== scanId));
      showToast('Scan history record deleted', 'success');
    } catch (err) {
      showToast('Failed to delete scan record', 'error');
    }
  };

  const handleClearAll = async () => {
    setIsDeleting(true);
    try {
      const currentUserId = user?.id || 'guest_dentist_session';
      await storage.clearAllScans(currentUserId);
      setScans([]);
      setShowConfirmClear(false);
      showToast('All scan history cleared successfully', 'success');
    } catch (err) {
      showToast('Failed to clear scan history', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getScanBadgeInfo = (scan: Scan) => {
    const lbl = scan.label || '';
    const clsName = (scan.className || '').toLowerCase();
    
    if (lbl === 'LABEL_0' || clsName.includes('healthy') || (scan.plaqueClass === 'Low' && scan.confidence === 0)) {
      return { text: 'HEALTHY', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300' };
    }
    if (lbl === 'LABEL_1' || clsName.includes('mild') || scan.plaqueClass === 'Low') {
      return { text: 'MILD PLAQUE', badgeClass: 'bg-sky-50 text-sky-700 border-sky-300' };
    }
    if (lbl === 'LABEL_2' || clsName.includes('moderate') || scan.plaqueClass === 'Medium') {
      return { text: 'MODERATE PLAQUE', badgeClass: 'bg-amber-50 text-amber-700 border-amber-300' };
    }
    if (lbl === 'LABEL_3' || clsName.includes('severe') || scan.plaqueClass === 'High') {
      return { text: 'SEVERE PLAQUE', badgeClass: 'bg-rose-50 text-rose-700 border-rose-300' };
    }
    return { text: 'NO DATA', badgeClass: 'bg-slate-100 text-slate-700 border-slate-300' };
  };

  return (
    <IonPage className="bg-[#F8FAFC]">
      {/* Mobile-Only Header */}
      <IonHeader className="ion-no-border md:hidden">
        <IonToolbar className="px-4">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/dashboard" />
          </IonButtons>
          <IonTitle className="font-black text-xl text-slate-900">History Logs</IonTitle>
          {scans.length > 0 && (
            <IonButtons slot="end">
              <button 
                onClick={() => setShowConfirmClear(true)}
                className="p-2 text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1"
                title="Clear All History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#F8FAFC', '--color': '#0F172A' } as React.CSSProperties}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 text-slate-900">
          
          {/* Desktop-Only Header Banner */}
          <div className="hidden md:flex items-center justify-between border-b border-slate-200 pb-5 mb-4 select-none">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Diagnostic Logs</h1>
              <p className="text-xs font-bold text-slate-600 mt-1">Review historical scanning cards and localized biofilm indices</p>
            </div>
            <div className="flex items-center gap-3">
              {scans.length > 0 && (
                <Button 
                  variant="danger"
                  size="md"
                  onClick={() => setShowConfirmClear(true)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Clear History
                </Button>
              )}
              <Button 
                variant="primary"
                glow={true}
                onClick={() => history.push('/app/scan')}
                leftIcon={<Camera className="w-4 h-4" />}
              >
                Scan Teeth
              </Button>
            </div>
          </div>

          {scans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-white rounded-full border border-slate-300 shadow-sm flex items-center justify-center text-slate-500">
                <Calendar className="w-8 h-8" />
              </div>
              <p className="text-slate-800 font-bold">No dental scans found in your log history yet.</p>
              <Button 
                variant="primary"
                glow={true}
                onClick={() => history.push('/app/scan')}
                size="lg"
                leftIcon={<Camera className="w-5 h-5" />}
              >
                Scan Teeth Now
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 md:hidden">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {scans.length} {scans.length === 1 ? 'Scan Record' : 'Scan Records'}
                </span>
                <Button 
                  variant="danger"
                  size="xs"
                  onClick={() => setShowConfirmClear(true)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Clear All
                </Button>
              </div>

              {/* Responsive Grid display */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scans.map((scan) => {
                  const badge = getScanBadgeInfo(scan);
                  const displayLabel = scan.label || (scan.plaqueClass === 'Low' ? (scan.confidence === 0 ? 'LABEL_0' : 'LABEL_1') : scan.plaqueClass === 'Medium' ? 'LABEL_2' : 'LABEL_3');
                  return (
                    <div 
                      key={scan.id}
                      onClick={() => history.push(`/app/results/${scan.id}`)}
                      className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm hover:border-[#14B8A6] hover:shadow-lg transition-all cursor-pointer active:scale-[0.99] group text-slate-900 relative"
                    >
                      <div className="flex gap-4 pr-6">
                        {/* Photo Thumbnail */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border-2 border-slate-200 shadow-sm relative">
                          <img src={scan.imageUrl} alt="Oral Snapshot" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 text-white text-[9px] font-black text-center py-0.5 uppercase tracking-tighter">
                            {displayLabel}
                          </div>
                        </div>

                        {/* Diagnostic details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">
                                {new Date(scan.date).toLocaleDateString(undefined, { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <span className={`font-black text-[9px] uppercase px-2 py-0.5 rounded-md border shrink-0 ${badge.badgeClass}`}>
                                {badge.text}
                              </span>
                              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider select-none">
                                {new Date(scan.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 text-[#14B8A6]" />
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-800">
                                {Math.round(scan.confidence * 100)}% Confidence
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#14B8A6] transition-colors" />
                          </div>
                        </div>

                        {/* Individual Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSingle(scan.id, e)}
                          title="Delete scan record"
                          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-75 hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modal Overlay for Clear All Confirmation */}
          <AnimatePresence>
            {showConfirmClear && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <button 
                      onClick={() => setShowConfirmClear(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Clear Scan History?</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1.5 leading-relaxed">
                      Are you sure you want to delete all {scans.length} diagnostic scan log records? This action cannot be undone.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button 
                      variant="ghost" 
                      size="md"
                      onClick={() => setShowConfirmClear(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="danger" 
                      size="md"
                      glow={true}
                      isLoading={isDeleting}
                      onClick={handleClearAll}
                      className="flex-1"
                    >
                      Delete All
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default ScanHistory;
