import React, { useState } from 'react';
import { IonPage, IonContent, IonRouterLink } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { User, Mail, Shield, Sparkles, UserPlus, X } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import FormLayout from '../components/auth/FormLayout';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SignUp: React.FC = () => {
  const history = useHistory();
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false
  });

  // Validation rules
  const isNameValid = name.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Firebase handles password requirements server-side
  const isPasswordValid = password.length >= 6; // Firebase minimum
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const isFormValid = isNameValid && isEmailValid && isPasswordValid && doPasswordsMatch && acceptTerms;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true
    });

    if (!isFormValid) return;

    setIsLoading(true);

    try {
      await signUp(name, email, password);
      showToast('Account created successfully! Welcome to DentaScan.', 'success');
      history.push('/app/dashboard');
    } catch (err: any) {
      const msg = err?.message || 'Registration failed. Please try again.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="bg-slate-50 dark:bg-slate-950 font-sans">
        <AuthLayout
          badgeText="DentaScan Suite"
          title="Create Your Dental Profile"
          subtitle="Join thousands of users tracking oral hygiene and biofilm risk scores."
        >
          <FormLayout
            badge="New Account"
            badgeIcon={<Sparkles className="w-3.5 h-3.5 text-blue-500" />}
            title="Register Account"
            subtitle="Fill in your details below to activate your DentaScan AI profile"
            onSubmit={handleRegister}
            footer={
              <div className="space-y-4 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <span>Already have an account? </span>
                  <IonRouterLink routerLink="/login">
                    <button className="text-blue-600 dark:text-blue-400 font-black hover:underline cursor-pointer ml-1">
                      Sign In
                    </button>
                  </IonRouterLink>
                </div>
              </div>
            }
          >
            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              placeholder="Dr. Sarah Connor"
              leftIcon={<User className="w-4 h-4" />}
              isValid={touched.name && isNameValid}
              error={touched.name && !isNameValid ? 'Full name must be at least 2 characters long' : undefined}
              required
            />

            {/* Email Address */}
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              placeholder="name@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              isValid={touched.email && isEmailValid}
              error={touched.email && !isEmailValid ? 'Please enter a valid email address' : undefined}
              required
            />

            {/* Password */}
            <div className="space-y-2">
              <PasswordInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                placeholder="••••••••"
                isValid={touched.password && isPasswordValid}
                error={touched.password && !isPasswordValid ? 'Password does not meet requirements' : undefined}
                required
              />

              {/* Password requirement info */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <span className="block font-semibold text-slate-600 dark:text-slate-300 text-sm">
                  Password must be at least 6 characters
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
              placeholder="••••••••"
              isValid={touched.confirmPassword && doPasswordsMatch}
              error={touched.confirmPassword && !doPasswordsMatch ? 'Passwords do not match' : undefined}
              required
            />

            {/* Accept Terms & Privacy Policy Checkbox */}
            <div className="pt-1">
              <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-snug">
                  I accept the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTermsModal(true);
                    }}
                    className="text-blue-600 dark:text-blue-400 font-bold underline hover:text-blue-700 cursor-pointer"
                  >
                    Privacy Policy & Terms of Service
                  </button>
                </span>
              </label>
              {touched.terms && !acceptTerms && (
                <p className="text-rose-500 text-[11px] font-bold mt-1">
                  You must accept the terms to create an account
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading || !isFormValid}
              leftIcon={<UserPlus className="w-4 h-4" />}
              className="mt-2"
            >
              Create Account
            </Button>

          </FormLayout>
        </AuthLayout>

        {/* Terms Modal */}
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Privacy Policy & Terms</h3>
                </div>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium pr-1">
                <p>
                  Welcome to <strong>DentaScan</strong>. By registering an account, you agree to our privacy guidelines and data processing standards designed for digital oral health tracking.
                </p>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider">1. Privacy & Data Security</h4>
                <p>
                  All scan uploads and medical logs processed via DentaScan adhere to strict security protocols. Photos are evaluated in-browser or securely without public disclosure.
                </p>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider">2. Medical Disclaimer</h4>
                <p>
                  DentaScan is an AI-assisted oral hygiene tracking tool designed to encourage daily brushing, flossing, and biofilm awareness. It is not a substitute for professional dental diagnosis.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button
                  onClick={() => {
                    setAcceptTerms(true);
                    setShowTermsModal(false);
                  }}
                  variant="primary"
                  size="sm"
                >
                  I Accept Terms
                </Button>
              </div>
            </div>
          </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default SignUp;
