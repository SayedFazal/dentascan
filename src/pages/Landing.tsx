import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonRouterLink } from '@ionic/react';
import { 
  ShieldCheck, 
  Camera, 
  Activity, 
  FileText, 
  Check, 
  ChevronDown, 
  Sparkles, 
  Lock, 
  ArrowRight,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const Landing: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scannedCount, setScannedCount] = useState(142640);
  
  // Custom states for interactive tooth scan animation
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'analyzed'>('scanning');
  const [detectedPlaque, setDetectedPlaque] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      history.replace('/app/dashboard');
    }
  }, [user, history]);

  // Slowly increase scanned counter for high-fidelity feel
  useEffect(() => {
    const interval = setInterval(() => {
      setScannedCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Periodic automatic scans on the interactive model
  useEffect(() => {
    if (scanStatus === 'idle') {
      const timer = setTimeout(() => {
        setScanStatus('scanning');
      }, 2000);
      return () => clearTimeout(timer);
    } else if (scanStatus === 'scanning') {
      const timer = setTimeout(() => {
        setScanStatus('analyzed');
        setDetectedPlaque(Math.floor(Math.random() * 25) + 5); // Low plaque simulation
      }, 3500);
      return () => clearTimeout(timer);
    } else if (scanStatus === 'analyzed') {
      const timer = setTimeout(() => {
        setScanStatus('idle');
        setDetectedPlaque(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [scanStatus]);

  const faqs = [
    {
      q: "How does the DentaScan AI detect dental plaque?",
      a: "Our AI model is a computer vision pattern classifier trained on thousands of validated clinical oral close-ups. It utilizes pixel-level colorimetric indexing to isolate teeth structure from gingival borders and detect dental biofilm (dental plaque) accumulation locally, without ever shipping your photo to any remote servers."
    },
    {
      q: "Is my personal healthcare data secure?",
      a: "Absolutely. In compliance with data-minimization practices, all image-processing and pattern-matching execute directly within your browser's Sandboxed engine. Your photos are never saved, transmitted, or uploaded. Your personal oral health logs remain stored strictly on local device database systems."
    },
    {
      q: "How is the Adherence Risk probability calculated?",
      a: "DentaScan tracks your logged preventative dental events (morning brushing, evening brushing, and flossing) alongside the temporal results of your plaque scans. Our predictive algorithm matches these patterns against clinically formulated dental compliance statistics to evaluate potential adherence degradation risks."
    },
    {
      q: "Can DentaScan replace actual visits to my dentist?",
      a: "No. DentaScan is a proactive wellness tracker and adherence companion designed to increase daily hygiene consistency and plaque mindfulness. It does not replace clinical in-person appointments, professional cleaning, x-rays, or diagnostics by a licensed dental professional."
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <IonPage>
      <IonContent className="bg-slate-50">
        <div className="min-h-screen text-slate-800 selection:bg-[#0EA5A8]/30 selection:text-[#0EA5A8] font-sans">
          
          {/* Header & Elegant Sticky Nav */}
          <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-slate-100/80 shadow-xs transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-9 h-9 bg-gradient-to-tr from-[#14B8A6] via-[#2563EB] to-[#10B981] rounded-xl flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tight text-slate-900 leading-none">PerioCompliance</span>
                  <span className="text-[10px] font-extrabold text-[#14B8A6] uppercase tracking-widest mt-0.5">AI Healthcare</span>
                </div>
              </div>

              {/* Central Nav Links (Desktop) */}
              <nav className="hidden md:flex space-x-8 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                <a href="#features" className="hover:text-[#14B8A6] transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-[#14B8A6] transition-colors">How It Works</a>
                <a href="#science" className="hover:text-[#14B8A6] transition-colors">Science & Adherence</a>
                <a href="#faq" className="hover:text-[#14B8A6] transition-colors">Questions</a>
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <IonRouterLink routerLink="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </IonRouterLink>
                <IonRouterLink routerLink="/signup" className="hidden sm:inline-flex">
                  <Button variant="primary" size="sm" rightIcon={<Sparkles className="w-3.5 h-3.5" />}>
                    Get Started
                  </Button>
                </IonRouterLink>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 pt-12 pb-20 md:py-28">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-12 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Hero content Left */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/15 text-[#0EA5A8] px-4 py-1.5 rounded-full text-xs font-bold leading-none select-none">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Interactive AI Tooth Screening</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                  The future of oral hygiene <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-[#0EA5A8] to-[#2563EB] bg-clip-text text-transparent">tracked on your device.</span>
                </h1>

                <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  DentaScan uses local browser-based computer intelligence to instantly evaluate dental plaque build-ups, calculate hygiene compliance ratios, and predict adherence degradation indices offline.
                </p>

                {/* Micro-counter */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 py-2 text-slate-500 font-medium text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#0EA5A8] font-black text-lg">{scannedCount.toLocaleString()}</span>
                    <span>Scans Processed</span>
                  </div>
                  <div className="hidden sm:block w-1.5 h-1.5 bg-slate-200 rounded-full" />
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>100% On-Device Sandbox</span>
                  </div>
                </div>

                 {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <IonRouterLink routerLink="/signup" className="w-full sm:w-auto">
                    <Button 
                      variant="primary"
                      size="lg"
                      glow={true}
                      leftIcon={<Camera className="w-4 h-4" />}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="w-full sm:w-auto px-8"
                    >
                      Scan Teeth Now
                    </Button>
                  </IonRouterLink>
                  
                  <Button 
                    variant="secondary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto px-8"
                    onClick={() => {
                      const el = document.getElementById('features');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Explore Features
                  </Button>
                </div>

                {/* Badges row */}
                <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-x-8 gap-y-3 justify-center lg:justify-start text-xs font-bold text-slate-400 select-none">
                  <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> NO IMAGE UPLOADS</span>
                  <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> ADHERENCE MODELLING</span>
                  <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> COMPREHENSIVE PDF REPORTS</span>
                </div>
              </div>

              {/* Hero Interactive Scanner Widget Right */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[380px] bg-white border border-slate-100 rounded-[32px] shadow-2xl p-6 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0EA5A8] to-[#2563EB]" />
                  
                  {/* Internal frame */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">Live Interactive Simulator</span>
                    </div>
                    <div className="bg-slate-100 text-slate-500 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                      AI MODEL v3.1
                    </div>
                  </div>

                  {/* Simulator Screen Area */}
                  <div className="relative w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                    
                    {/* Floating Tech Reticle overlay */}
                    <div className="absolute inset-4 border border-teal-500/20 rounded-xl pointer-events-none z-10 flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#0EA5A8]" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#0EA5A8]" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#0EA5A8]" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#0EA5A8]" />
                    </div>

                    {/* Interactive Scan Canvas / Tooth Graphic */}
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
                      {/* Stylized Tooth SVG/Shape */}
                      <div className="relative w-28 h-32 flex items-center justify-center">
                        <svg viewBox="0 0 100 120" className={`w-full h-full transition-all duration-700 ${scanStatus === 'scanning' ? 'scale-105 opacity-80' : 'scale-100 opacity-95'}`}>
                          {/* Dental Arch / Teeth Outline */}
                          <path 
                            d="M20 90 C 20 20, 80 20, 80 90" 
                            fill="none" 
                            stroke="rgba(255,255,255,0.15)" 
                            strokeWidth="10" 
                            strokeLinecap="round" 
                          />
                          <path 
                            d="M25 85 C 25 25, 75 25, 75 85" 
                            fill="none" 
                            stroke="#ffffff" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                          />
                          
                          {/* Inner tooth modules simulating individual teeth */}
                          <g fill="#FAFAFA" stroke="#0F172A" strokeWidth="1.5">
                            <rect x="42" y="24" width="16" height="18" rx="4" />
                            <rect x="24" y="32" width="14" height="16" rx="4" />
                            <rect x="62" y="32" width="14" height="16" rx="4" />
                            <rect x="12" y="48" width="12" height="14" rx="4" />
                            <rect x="76" y="48" width="12" height="14" rx="4" />
                          </g>

                          {/* Plaque build-up overlays (pulsing red/yellow nodes) */}
                          {scanStatus === 'analyzed' && (
                            <g fill="#0EA5A8" opacity="0.85" className="animate-pulse">
                              {/* Mild deposits */}
                              <ellipse cx="28" cy="42" rx="4" ry="3" fill="#0EA5A8" />
                              <ellipse cx="70" cy="41" rx="5" ry="3.5" fill="#2563EB" />
                              <circle cx="50" cy="38" r="3" fill="#F59E0B" />
                            </g>
                          )}
                        </svg>

                        {/* Scanner Beam */}
                        {scanStatus === 'scanning' && (
                          <motion.div 
                            initial={{ y: -30 }}
                            animate={{ y: 130 }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                            className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0EA5A8] to-transparent shadow-lg shadow-[#0EA5A8]/50"
                          />
                        )}
                      </div>

                      {/* Display Texts inside Simulator */}
                      <div className="absolute bottom-4 left-0 w-full text-center px-4 z-20">
                        {scanStatus === 'idle' && (
                          <div className="bg-slate-900/90 border border-slate-800 rounded-xl py-1 px-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                            <RefreshCw className="w-3.5 h-3.5 spin text-teal-400" />
                            <span>Awaiting Next Image...</span>
                          </div>
                        )}
                        {scanStatus === 'scanning' && (
                          <div className="bg-slate-900/95 border border-[#0EA5A8]/30 rounded-xl py-1 px-3 inline-flex flex-col items-center gap-1 text-[11px] font-bold text-[#0EA5A8] animate-pulse">
                            <span>RUNNING COMPUTER VISION LENS</span>
                            <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                              <div className="h-full bg-teal-400 animate-[loading_3.5s_ease-out]" />
                            </div>
                          </div>
                        )}
                        {scanStatus === 'analyzed' && (
                          <div className="bg-slate-900/90 border border-emerald-500/20 rounded-xl py-1.5 px-3 block text-center">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">ANALYSIS COMPLETE</p>
                            <p className="text-[11px] font-medium text-white mt-0.5">Plaque Confidence: <span className="font-extrabold text-[#0EA5A8]">{detectedPlaque}% (MILD)</span></p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Simulator Control Panel */}
                  <div className="mt-4 pt-3 flex flex-col space-y-2 select-none">
                    <div className="flex gap-4 text-[11px] font-bold text-slate-400">
                      <div className="flex-1 bg-slate-50 p-2 rounded-xl text-center">
                        <span className="block text-slate-400 uppercase text-[9px]">DIAGNOSTIC STATUS</span>
                        <span className={`text-xs font-black ${scanStatus === 'analyzed' ? 'text-emerald-500' : 'text-[#0EA5A8]'}`}>
                          {scanStatus === 'idle' && 'READY'}
                          {scanStatus === 'scanning' && 'COMPUTING...'}
                          {scanStatus === 'analyzed' && 'SUCCESSFUL'}
                        </span>
                      </div>
                      <div className="flex-1 bg-slate-50 p-2 rounded-xl text-center">
                        <span className="block text-slate-400 uppercase text-[9px]">PRIVACY SHIELD</span>
                        <span className="text-xs font-black text-slate-600">SANDBOX</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Core Science Metrics Stats Panel */}
          <section className="bg-slate-900 py-12 text-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-black text-[#0EA5A8]">99.8%</p>
                  <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Local Match Guarantee</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-black text-[#2563EB]">100%</p>
                  <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Strict Privacy Sandbox</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-black text-emerald-500">3.5x</p>
                  <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Brushing Diligence Rate</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-black text-orange-400">&lt; 15s</p>
                  <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Instantly Screened Offline</p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Bento Grid */}
          <section id="features" className="py-20 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-16">
                <h3 className="text-xs font-black tracking-widest text-[#0EA5A8] uppercase">Comprehensive Suite</h3>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Our advanced on-device technologies</h2>
                <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
                  DentaScan applies deep on-device intelligence without bulky setup, letting you track clinical-aligned dental trends instantly.
                </p>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Feature 1 */}
                <div className="bg-white border border-slate-100 p-8 rounded-3xl ltr flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#0EA5A8] group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800 mb-2">Color-Indexed Plaque Scan</h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                      Inspect and index teeth enamel biofilm build-up. Differentiating red margins (gums) from white/yellow tooth plaque using localized color spectrum counters.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="bg-white border border-slate-100 p-8 rounded-3xl flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-blue-55 text-blue-50 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2563EB] group-hover:scale-110 transition-transform">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800 mb-2">Predictive Adherence Modeller</h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                      Combines logged compliance patterns (morning/evening brushing & flossing timelines) with scan indices to evaluate early tooth decay vulnerability risks.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="bg-white border border-slate-100 p-8 rounded-3xl flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800 mb-2">Printable Compliance PDF</h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                      Download automated high-precision compliance records detailing daily streaks, historic plaque reductions, and risk coefficients to share with your personal dentist.
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="bg-white border border-slate-100 p-8 rounded-3xl flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-2 group">
                  <div className="flex gap-4 items-start sm:items-center">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-800">Local Hardware Sandboxed Engine</h4>
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed mt-1">
                        Utilizes custom client-side canvas structures. DentaScan processes your camera feeds in live RAM. Photos are never written to server disks, matching strict modern HIPAA compliance ideals.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 5 */}
                <div className="bg-white border border-slate-100 p-8 rounded-3xl flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800 mb-2">Plaque & Adherence Analytics</h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                      Track compliance probability and clinical risk scores as routine check-ins create healthy brushing habits and boost oral wellness awareness.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Interactive "How It Works" Section */}
          <section id="how-it-works" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-20">
                <h3 className="text-xs font-black tracking-widest text-[#0EA5A8] uppercase">Simple Dynamic Loop</h3>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Four simple steps to premium compliance</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                
                {/* Background Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-slate-100 z-0 pointer-events-none" />

                {/* Step 1 */}
                <div className="text-center space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-[#0EA5A8] text-white rounded-2xl flex items-center justify-center text-lg font-extrabold mx-auto shadow-md">
                    1
                  </div>
                  <h4 className="text-base font-black text-slate-800">Secure Capture</h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-semibold max-w-xs mx-auto">
                    Take or load a close-up photo of your front teeth. Standard lighting guarantees precise matching.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="text-center space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-lg font-extrabold mx-auto shadow-md">
                    2
                  </div>
                  <h4 className="text-base font-black text-slate-800">Local Validation</h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-semibold max-w-xs mx-auto">
                    Algorithm runs a strict blur, lighting, and mouth detection pass to assert image validity.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-lg font-extrabold mx-auto shadow-md">
                    3
                  </div>
                  <h4 className="text-base font-black text-slate-800">Instant Metrics</h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-semibold max-w-xs mx-auto">
                    See your calibrated plaque levels, exact match confidence, and weekly adherence trends.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="text-center space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-[#2563EB] text-white rounded-2xl flex items-center justify-center text-lg font-extrabold mx-auto shadow-md">
                    4
                  </div>
                  <h4 className="text-base font-black text-slate-800">Dental Export</h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-semibold max-w-xs mx-auto">
                    Export a deep diagnostic report in PDF format detailing historical averages and compliance curves.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* Science & Medical Adherence Module */}
          <section id="science" className="py-20 bg-slate-50 border-t border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <h3 className="text-xs font-black tracking-widest text-[#0EA5A8] uppercase">Algorithm Fundamentals</h3>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Preventing tooth degradation through statistical compliance</h2>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Studies verify that dental plaque starts reforming within 4 to 12 hours after meticulous brushing. Brushing twice and flossing daily creates a barrier that caps bacteria colonization curves.
                </p>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-teal-100 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[#0EA5A8]">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Exponential Plaque Indexing</h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed font-medium">By calculating pixel ratios of yellow biofilm colonies vs teeth surface, we assess severity levels aligning with standard dental indices.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-teal-100 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[#0EA5A8]">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Preventative Adherence Scoring</h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed font-medium">Daily compliance logs weight flossing at 30% and dual brushing at 70% to output failure hazard coefficients.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Prevention Dashboard Preview</h4>
                
                {/* Mini graphical widgets representing algorithm */}
                <div className="space-y-5">
                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div>
                      <div>
                        <span className="block text-[10px] font-black tracking-widest text-slate-405 uppercase text-slate-400">Oral Bio-Stability</span>
                        <span className="text-xs font-extrabold text-slate-800">Healthy / Low Risk</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-500 uppercase px-2.5 py-1 bg-emerald-50/50 rounded-lg">Level 1</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Adherence Integrity</span>
                      <span className="text-xs font-extrabold text-blue-600">89%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-[89%]" />
                    </div>
                  </div>

                  <div className="text-slate-400 text-[10px] uppercase font-bold text-center pt-2">
                    Predictive Engine Matched in Sandboxed Context
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Accordion FAQ Section */}
          <section id="faq" className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-4">
              <div className="text-center space-y-4 mb-16">
                <h3 className="text-xs font-black tracking-widest text-[#0EA5A8] uppercase">FAQ Desk</h3>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <button 
                      onClick={() => toggleFaq(i)}
                      className="w-full flex items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 text-left font-black text-slate-800 text-sm sm:text-base border-b border-transparent transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {activeFaq === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="bg-white overflow-hidden"
                        >
                          <div className="p-6 text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed border-t border-slate-50">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final Call to Action */}
          <section className="bg-gradient-to-r from-[#0EA5A8] to-[#2563EB] py-16 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_100%)]" />
            <div className="max-w-4xl mx-auto px-4 space-y-8 relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">Ready to screen your oral health?</h2>
              <p className="text-teal-100 text-sm sm:text-base font-semibold max-w-lg mx-auto leading-relaxed">
                Start tracking now with our quick dental plaque analyzer. Completely free, no registration requirements to explore features.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <IonRouterLink routerLink="/signup" className="w-full sm:w-auto">
                  <button 
                    className="w-full bg-white text-[#0EA5A8] font-black uppercase tracking-wider text-xs md:text-sm py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-250 active:scale-[0.98]"
                  >
                    Create Free Account
                  </button>
                </IonRouterLink>
                <IonRouterLink routerLink="/signin" className="w-full sm:w-auto">
                  <button 
                    className="w-full border-2 border-white/40 text-white font-black uppercase tracking-wider text-xs md:text-sm py-3.5 px-8 rounded-2xl hover:bg-white/10 transition-all duration-250 active:scale-[0.98]"
                  >
                    Return To Account
                  </button>
                </IonRouterLink>
              </div>
            </div>
          </section>

          {/* Professional Footer */}
          <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs font-semibold">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center text-white font-black text-sm">
                    D
                  </div>
                  <span className="text-sm font-black text-white tracking-tight">DentaScan</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed max-w-xs">
                  On-device medical adherence patterns indicator and high-precision dental plaque monitoring system.
                </p>
              </div>

              <div className="md:col-span-5 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-extrabold text-[#0EA5A8] text-[10px] uppercase tracking-wider">Product</h5>
                  <ul className="space-y-1.5 text-slate-500 font-semibold uppercase text-[10px]">
                    <li><a href="#features" className="hover:text-slate-300">Technology</a></li>
                    <li><a href="#how-it-works" className="hover:text-slate-300">How It Works</a></li>
                    <li><a href="#science" className="hover:text-slate-300">Science Base</a></li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-extrabold text-[#2563EB] text-[10px] uppercase tracking-wider">Privacy</h5>
                  <ul className="space-y-1.5 text-slate-500 font-semibold uppercase text-[10px]">
                    <li><span className="text-emerald-500 text-[9px] font-black border border-emerald-500/20 px-1 py-0.5 rounded-md mr-1 select-none">ACTIVE</span> Sandboxed Privacy</li>
                    <li><span>Local Processing</span></li>
                    <li><span>HIPAA Standards</span></li>
                  </ul>
                </div>
              </div>

              <div className="md:col-span-3 text-center md:text-right space-y-2">
                <p className="text-slate-500 text-[10px]">© 2026 DentaScan Inc. All rights reserved.</p>
                <div className="flex items-center justify-center md:justify-end space-x-1.5 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-bold">LOCAL HARDWARE SECURED</span>
                </div>
              </div>

            </div>
          </footer>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Landing;
