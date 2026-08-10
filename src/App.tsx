import React, { useState } from 'react';
import { Redirect, Route, useLocation, useHistory } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { 
  LayoutDashboard, 
  Camera, 
  FileText, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  Activity, 
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import SplashScreen from './components/SplashScreen';

/* Pages */
import SplashScreenPage from './pages/SplashScreenPage';
import Onboarding from './pages/Onboarding';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import Consent from './pages/Consent';
import Dashboard from './pages/Dashboard';
import Scan from './pages/Scan';
import Results from './pages/Results';
import Report from './pages/Report';
import Settings from './pages/Settings';
import History from './pages/History';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Redirect to="/login" />;
};

// Left Sidebar for Widescreen Layouts
const DesktopSidebar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Scan Teeth', path: '/app/scan', icon: Camera },
    { name: 'Health Report', path: '/app/report', icon: FileText },
    { name: 'History Logs', path: '/app/history', icon: HistoryIcon },
    { name: 'Settings Desk', path: '/app/settings', icon: SettingsIcon },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-200 h-screen sticky top-0 p-6 shadow-xl select-none shrink-0 z-50">
      {/* Branding Header Area */}
      <div 
        className="flex items-center space-x-3 mb-8 cursor-pointer self-start"
        onClick={() => history.push('/app/dashboard')}
      >
        <div className="w-9 h-9 bg-gradient-to-tr from-[#14B8A6] via-[#2563EB] to-[#10B981] rounded-xl flex items-center justify-center text-white shadow-md shadow-teal-500/20">
          <Activity className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-black text-white tracking-tight leading-none">DentaScan</span>
          <span className="text-[10px] font-extrabold text-[#14B8A6] uppercase tracking-widest mt-0.5">AI Healthcare</span>
        </div>
      </div>

      {/* Profile Card snippet */}
      {user && (
        <div className="mb-8 p-3.5 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0EA5A8] to-[#2563EB] flex items-center justify-center text-white font-black text-sm uppercase shrink-0">
            {user.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-black text-white truncate leading-tight">{user.name || 'User Profile'}</span>
            <span className="block text-[10px] text-slate-500 truncate mt-0.5 font-bold uppercase">{user.email ? user.email.split('@')[0] : 'Member'}</span>
          </div>
        </div>
      )}

      {/* Navigation menu list */}
      <nav className="flex-1 space-y-1.5 align-middle">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <motion.button
              key={item.name}
              whileHover={{ x: 3, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              onClick={() => history.push(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all leading-none cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-[#0EA5A8] to-[#2563EB] text-white shadow-md shadow-teal-500/20' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
            </motion.button>
          );
        })}
      </nav>

    </div>
  );
};

const MobileBottomBar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Scan', path: '/app/scan', icon: Camera },
    { name: 'Report', path: '/app/report', icon: FileText },
    { name: 'Logs', path: '/app/history', icon: HistoryIcon },
    { name: 'Settings', path: '/app/settings', icon: SettingsIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 text-slate-300 h-16 flex items-center justify-around px-2 z-55 shadow-2xl select-none">
      {menuItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        const Icon = item.icon;
        return (
          <motion.button
            key={item.name}
            whileTap={{ scale: 0.88 }}
            onClick={() => history.push(item.path)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 gap-1 transition-all cursor-pointer ${
              isActive ? 'text-[#0EA5A8] font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-[#0EA5A8] scale-110' : 'text-slate-400'}`} />
            <span className="text-[9px] uppercase tracking-wider font-extrabold leading-none">{item.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If user has not accepted consent, redirect to /app/consent
  if (user && !user.consentAccepted && location.pathname.startsWith('/app') && location.pathname !== '/app/consent') {
    return <Redirect to="/app/consent" />;
  }

  // If user has accepted consent but tries to visit /app/consent, redirect to dashboard
  if (user && user.consentAccepted && location.pathname === '/app/consent') {
    return <Redirect to="/app/dashboard" />;
  }

  const showNav = user?.consentAccepted && location.pathname.startsWith('/app') && location.pathname !== '/app/consent';

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-[#F8FAFC] font-sans">
      {/* Sidebar for Desktop Widescreen Laptop Layouts */}
      {showNav && <DesktopSidebar />}

      {/* Main App viewport container */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {children}
        {/* Bottom Tab Bar for Mobile Devices Only */}
        {showNav && <MobileBottomBar />}
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <IonReactRouter>
      <MainLayout>
        <IonRouterOutlet>
          {/* Public Authentication & Onboarding Routes */}
          <Route path="/splash" component={SplashScreenPage} exact />
          <Route path="/onboarding" component={Onboarding} exact />
          <Route path="/login" component={SignIn} exact />
          <Route path="/signin" component={SignIn} exact />
          <Route path="/register" component={SignUp} exact />
          <Route path="/signup" component={SignUp} exact />
          <Route path="/forgot-password" component={ForgotPassword} exact />
          <Route path="/reset-password" component={ResetPassword} exact />
          <Route path="/landing" render={() => <Redirect to="/login" />} exact />
          
          {/* Authenticated Routes wrapped individually with AuthGuard */}
          <Route path="/app/consent" render={() => <AuthGuard><Consent /></AuthGuard>} exact />
          <Route path="/app/dashboard" render={() => <AuthGuard><Dashboard /></AuthGuard>} exact />
          <Route path="/app/scan" render={() => <AuthGuard><Scan /></AuthGuard>} exact />
          <Route path="/app/results/:scanId" render={() => <AuthGuard><Results /></AuthGuard>} exact />
          <Route path="/app/report" render={() => <AuthGuard><Report /></AuthGuard>} exact />
          <Route path="/app/history" render={() => <AuthGuard><History /></AuthGuard>} exact />
          <Route path="/app/settings" render={() => <AuthGuard><Settings /></AuthGuard>} exact />
          
          <Route exact path="/app">
            <AuthGuard>
              {user?.consentAccepted ? <Redirect to="/app/dashboard" /> : <Redirect to="/app/consent" />}
            </AuthGuard>
          </Route>

          <Route exact path="/">
            <Redirect to="/splash" />
          </Route>

          {/* Legacy redirects */}
          <Route path="/dashboard" render={() => <Redirect to="/app/dashboard" />} exact />
          <Route path="/scan" render={() => <Redirect to="/app/scan" />} exact />
          <Route path="/report" render={() => <Redirect to="/app/report" />} exact />
          <Route path="/settings" render={() => <Redirect to="/app/settings" />} exact />
          <Route path="/consent" render={() => <Redirect to="/app/consent" />} exact />
        </IonRouterOutlet>
      </MainLayout>
    </IonReactRouter>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <IonApp>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </IonApp>
  );
};

export default App;
