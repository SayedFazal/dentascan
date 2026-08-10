import React, { useState } from 'react';
import { IonPage, IonContent, IonRouterLink } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Mail, Sparkles, LogIn } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import FormLayout from '../components/auth/FormLayout';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SignIn: React.FC = () => {
  const history = useHistory();
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isFormValid) return;

    setIsLoading(true);

    try {
      await signIn(email, password);
      showToast('Signed in successfully', 'success');
      history.push('/app/dashboard');
    } catch (err: any) {
      const msg = err?.message || 'Failed to sign in. Please verify your credentials.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="bg-slate-50 dark:bg-slate-950 font-sans">
        <AuthLayout
          badgeText="DentaScan Portal"
          title="Welcome Back to DentaScan"
          subtitle="Access your personal oral health dashboard, plaque scans, and dental logs."
        >
          <FormLayout
            badge="Healthcare Auth"
            badgeIcon={<Sparkles className="w-3.5 h-3.5 text-blue-500" />}
            title="Sign In"
            subtitle="Enter your credentials to manage your dental diagnostic records"
            onSubmit={handleSignIn}
            footer={
              <div className="space-y-4 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <span>Don't have an account? </span>
                  <IonRouterLink routerLink="/register">
                    <button className="text-blue-600 dark:text-blue-400 font-black hover:underline cursor-pointer ml-1">
                      Create Account
                    </button>
                  </IonRouterLink>
                </div>
              </div>
            }
          >
            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              placeholder="doctor@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              isValid={touched.email && isEmailValid}
              error={touched.email && !isEmailValid ? 'Please enter a valid email address' : undefined}
              required
            />

            {/* Password Field */}
            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              placeholder="••••••••"
              isValid={touched.password && isPasswordValid}
              error={touched.password && !isPasswordValid ? 'Password must be at least 6 characters' : undefined}
              required
            />

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="font-semibold text-slate-600 dark:text-slate-300">Remember me</span>
              </label>

              <IonRouterLink routerLink="/forgot-password">
                <button
                  type="button"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </IonRouterLink>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
              leftIcon={<LogIn className="w-4 h-4" />}
              className="mt-2"
            >
              Sign In
            </Button>

          </FormLayout>
        </AuthLayout>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
