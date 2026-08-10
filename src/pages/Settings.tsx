import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle } from '@ionic/react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  User, Bell, Trash2, Info, Shield, ShieldCheck, LogOut, 
  Activity, Sparkles, CheckCircle2, ChevronRight, X, 
  Target, Users, Headphones, Award, Check, Cpu
} from 'lucide-react';
import { fadeInUp, staggerContainer } from '../lib/motion-variants';
import Button from '../components/ui/Button';

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [notifsEnabled, setNotifsEnabled] = useState(() => {
    return localStorage.getItem('dentascan_notifications') === 'true';
  });

  const handleToggleNotifications = () => {
    const nextState = !notifsEnabled;
    setNotifsEnabled(nextState);
    localStorage.setItem('dentascan_notifications', String(nextState));

    if (nextState) {
      showToast('Notifications enabled (Browser notifications required for alerts)', 'success');
    } else {
      showToast('Notifications disabled.', 'info');
    }
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to delete all local data? This cannot be undone.')) {
      try {
        const dbNames = ['dentascan_db', 'firebaseLocalStorageDb'];
        dbNames.forEach(name => {
          window.indexedDB.deleteDatabase(name);
        });

        if (window.indexedDB.databases) {
          const dbs = await window.indexedDB.databases();
          dbs.forEach(db => {
            if (db.name) window.indexedDB.deleteDatabase(db.name);
          });
        }

        localStorage.clear();
        sessionStorage.clear();
        
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        showToast('Data cleared successfully.', 'success');
        setTimeout(() => {
          window.location.href = '/landing';
        }, 1000);
      } catch (error) {
        console.error('Failed to clear data', error);
        localStorage.clear();
        window.location.href = '/landing';
      }
    }
  };

  return (
    <IonPage>
      {/* Mobile Header (hidden on desktop) */}
      <IonHeader className="ion-no-border md:hidden">
        <IonToolbar className="px-4">
          <IonTitle className="font-black text-xl">Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
          
          {/* Desktop-Only Header Banner */}
          <div className="hidden md:flex flex-col border-b border-slate-200 pb-5 mb-4 select-none">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings Desk</h1>
            <p className="text-xs font-bold text-slate-400 mt-1">Configure profile thresholds, local alarm timelines, and privacy tables</p>
          </div>

          {/* Majestic Responsive grid layout */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            
            {/* Left Column (4 spans) - Profile details */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Profile Card component */}
              <motion.div variants={fadeInUp} className="bg-white p-6 rounded-[32px] border border-slate-150 shadow-xs flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-teal-50 border border-teal-500/20 rounded-[24px] flex items-center justify-center text-[#14B8A6] shadow-sm mb-4">
                  <User className="w-10 h-10" />
                </div>
                
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{user?.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 border border-slate-100 rounded-md px-2.5 py-1 bg-slate-50 select-none">{user?.email}</p>

                <div className="w-full grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-50">
                  <div className="text-center">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Storage Core</span>
                    <span className="block text-xs font-black text-[#14B8A6] mt-1">INDEXEDDB</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Client Policy</span>
                    <span className="block text-xs font-black text-emerald-500 mt-1">SANDBOX</span>
                  </div>
                </div>

                <div className="w-full mt-6 pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<LogOut className="w-4 h-4 text-red-500" />}
                    onClick={signOut}
                    className="w-full text-xs font-black uppercase text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Sign Out
                  </Button>
                </div>
              </motion.div>

            </div>

            {/* Right Column (8 spans) - Advanced Preferences switches */}
            <div className="lg:col-span-8 space-y-6">
              
              <motion.div variants={fadeInUp} className="bg-white p-6 rounded-[32px] border border-slate-150 shadow-xs">
                
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6 border-b border-slate-50 pb-3 select-none">Preference Switches</h3>

                <div className="space-y-3">
                  
                  {/* Reminders Row */}
                  <motion.button 
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    onClick={handleToggleNotifications}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl transition-all text-left cursor-pointer border border-slate-200/60"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Bell className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="block text-xs font-black text-slate-800 uppercase tracking-wide">Daily reminders</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Toggle morning & sleep intervals reminders</span>
                      </div>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-all relative shrink-0 select-none ${notifsEnabled ? 'bg-[#0EA5A8]' : 'bg-slate-200'}`}>
                      <motion.div 
                        animate={{ x: notifsEnabled ? 18 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </div>
                  </motion.button>

                  {/* About Row Button */}
                  <motion.button 
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    onClick={() => setIsAboutOpen(true)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-teal-50/80 via-blue-50/50 to-emerald-50/80 hover:from-teal-100/90 hover:to-emerald-100/90 rounded-2xl transition-all text-left cursor-pointer border border-teal-200/80 shadow-2xs group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 bg-gradient-to-tr from-[#14B8A6] via-[#2563EB] to-[#10B981] text-white rounded-xl shadow-xs group-hover:scale-105 transition-transform">
                        <Activity className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="block text-xs font-black text-slate-900 uppercase tracking-wide">About PerioCompliance AI</span>
                          <span className="text-[9px] font-black px-2 py-0.5 bg-[#14B8A6] text-white rounded-full uppercase tracking-wider">
                            Info
                          </span>
                        </div>
                        <span className="block text-[10px] font-bold text-teal-800/80 mt-0.5">Revolutionizing dental health monitoring & mission statistics</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#14B8A6] group-hover:translate-x-1 transition-transform shrink-0" />
                  </motion.button>

                  {/* Privacy Row */}
                  <motion.div 
                    whileHover={{ scale: 1.01, y: -1 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-left border border-slate-200/60"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                        <Shield className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="block text-xs font-black text-slate-800 uppercase tracking-wide">Privacy & Consent accepted</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Review local sandboxed storage logic specifications</span>
                      </div>
                    </div>
                    <Info className="w-4.5 h-4.5 text-slate-300" />
                  </motion.div>

                  {/* Danger Zone Row */}
                  <motion.button 
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    onClick={handleClearData}
                    className="w-full flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-50 border border-red-200/60 hover:border-red-300 group rounded-2xl transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all">
                        <Trash2 className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="block text-xs font-black text-slate-800 uppercase tracking-wide group-hover:text-red-600 transition-all">Clear All Sandbox Data</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Delete database, clear session tokens & delete cookies permanently</span>
                      </div>
                    </div>
                  </motion.button>

                </div>

              </motion.div>

              {/* About PerioCompliance AI Card trigger */}
              <motion.div variants={fadeInUp} className="bg-white p-6 rounded-[32px] border border-slate-150 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-tr from-[#14B8A6] via-[#2563EB] to-[#10B981] rounded-xl flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">About PerioCompliance AI</h3>
                      <p className="text-[10px] font-extrabold text-[#14B8A6] uppercase tracking-widest">Revolutionizing dental health monitoring</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="xs"
                    onClick={() => setIsAboutOpen(true)}
                    className="text-[11px] border-teal-200 text-[#14B8A6] hover:bg-teal-50 font-black uppercase"
                  >
                    Open About
                  </Button>
                </div>

                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  PerioCompliance AI combines cutting-edge computer vision with user-friendly design to make clinical-grade dental health monitoring accessible to everyone.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-2xl text-center">
                    <span className="block text-base font-black text-[#14B8A6]">50K+</span>
                    <span className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-tight mt-0.5">Active Users</span>
                  </div>
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-center">
                    <span className="block text-base font-black text-[#2563EB]">97%</span>
                    <span className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-tight mt-0.5">AI Precision</span>
                  </div>
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-center">
                    <span className="block text-base font-black text-[#10B981]">24/7</span>
                    <span className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-tight mt-0.5">Support</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    variant="primary"
                    glow={true}
                    onClick={() => setIsAboutOpen(true)}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                    className="w-full text-xs font-bold"
                  >
                    View Full About & Mission Details
                  </Button>
                </div>
              </motion.div>

              {/* Safe storage disclaimer */}
              <motion.div variants={fadeInUp} className="p-5 rounded-[24px] bg-slate-50 border border-slate-150 flex items-start space-x-3 text-[10px] font-bold text-slate-400 leading-relaxed uppercase select-none">
                <ShieldCheck className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span>Device Cryptography: Any data logged resides locked inside local web cache containers under active device sandboxing policies. PerioCompliance AI operates entirely offline.</span>
              </motion.div>

            </div>

          </motion.div>

        </div>

        {/* About Modal Overlay */}
        <AnimatePresence>
          {isAboutOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="relative p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shrink-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 bg-gradient-to-tr from-[#14B8A6] via-[#2563EB] to-[#10B981] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-widest text-[#14B8A6]">ℹ️ ABOUT SECTION</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">About PerioCompliance AI</h2>
                        <p className="text-xs font-bold text-slate-300 mt-0.5">Revolutionizing dental health monitoring</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsAboutOpen(false)}
                      className="p-2 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8 overflow-y-auto space-y-7 text-slate-800">
                  
                  {/* Our Mission */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-teal-50 text-[#14B8A6] rounded-xl border border-teal-200/50">
                        <Target className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Our Mission</h3>
                    </div>
                    
                    <div className="bg-gradient-to-br from-slate-50 via-teal-50/20 to-blue-50/20 p-5 rounded-2xl border border-slate-200/70 space-y-3">
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        At <strong className="text-slate-900 font-black">PerioCompliance AI</strong>, we believe everyone deserves access to advanced dental health monitoring technology. Our mission is to empower people to take control of their oral health through intelligent, easy-to-use technology.
                      </p>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        We combine cutting-edge artificial intelligence with user-friendly design to make dental health monitoring accessible to everyone, regardless of their technical expertise.
                      </p>
                    </div>
                  </div>

                  {/* Advanced Technology */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-blue-50 text-[#2563EB] rounded-xl border border-blue-200/50">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Advanced Technology 🦷</h3>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50/80 to-teal-50/80 rounded-2xl border border-blue-200/60 flex items-start gap-3.5">
                      <Sparkles className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                        Using state-of-the-art computer vision and machine learning for 97% accuracy in plaque detection.
                      </p>
                    </div>
                  </div>

                  {/* Key Statistics */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-50 text-[#10B981] rounded-xl border border-emerald-200/50">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Key Statistics</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 bg-white rounded-2xl border-2 border-teal-100 shadow-xs hover:border-[#14B8A6] transition-colors space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xl sm:text-2xl font-black text-[#14B8A6]">50K+</span>
                          <Users className="w-4 h-4 text-[#14B8A6]" />
                        </div>
                        <span className="block text-xs font-black text-slate-900">Active Users</span>
                        <span className="block text-[10px] text-slate-500 font-semibold">Trusted by thousands worldwide</span>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border-2 border-blue-100 shadow-xs hover:border-[#2563EB] transition-colors space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xl sm:text-2xl font-black text-[#2563EB]">97%</span>
                          <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                        </div>
                        <span className="block text-xs font-black text-slate-900">Accuracy Rate</span>
                        <span className="block text-[10px] text-slate-500 font-semibold">Industry-leading AI precision</span>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border-2 border-emerald-100 shadow-xs hover:border-[#10B981] transition-colors space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xl sm:text-2xl font-black text-[#10B981]">24/7</span>
                          <Headphones className="w-4 h-4 text-[#10B981]" />
                        </div>
                        <span className="block text-xs font-black text-slate-900">Support Available</span>
                        <span className="block text-[10px] text-slate-500 font-semibold">Help when you need it</span>
                      </div>
                    </div>
                  </div>

                  {/* Why Choose Us? */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-teal-50 text-[#14B8A6] rounded-xl border border-teal-200/50">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Why Choose Us? ✅</h3>
                    </div>

                    <div className="space-y-2.5">
                      <div className="p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/60 flex items-start gap-3 transition-colors">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 font-medium">
                          <strong className="text-slate-900 font-black">Scientifically Proven:</strong> Developed with input from dental professionals and backed by research
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/60 flex items-start gap-3 transition-colors">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 font-medium">
                          <strong className="text-slate-900 font-black">Privacy First:</strong> Your data is encrypted and never shared with third parties
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/60 flex items-start gap-3 transition-colors">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 font-medium">
                          <strong className="text-slate-900 font-black">Easy to Use:</strong> Intuitive interface that requires no technical knowledge
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/60 flex items-start gap-3 transition-colors">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 font-medium">
                          <strong className="text-slate-900 font-black">Personalized:</strong> AI adapts to your unique dental health patterns
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/60 flex items-start gap-3 transition-colors">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 font-medium">
                          <strong className="text-slate-900 font-black">Continuous Updates:</strong> Regular improvements powered by machine learning
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    PerioCompliance AI v1.2.0
                  </span>
                  <Button 
                    variant="primary" 
                    size="sm"
                    glow={true}
                    onClick={() => setIsAboutOpen(false)}
                    className="text-xs font-bold px-5"
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
