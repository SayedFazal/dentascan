import React, { useState } from 'react';
import { IonPage, IonContent, IonRouterLink } from '@ionic/react';
import { Mail, ArrowLeft, Send, CheckCircle2, KeyRound } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import FormLayout from '../components/auth/FormLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!isEmailValid) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <IonPage>
      <IonContent className="bg-slate-50 dark:bg-slate-950 font-sans">
        <AuthLayout
          badgeText="Account Recovery"
          title="Reset Your DentaScan Access"
          subtitle="We will send password recovery instructions directly to your verified email."
        >
          <FormLayout
            badge="Recovery Desk"
            badgeIcon={<KeyRound className="w-3.5 h-3.5 text-blue-500" />}
            title="Forgot Password?"
            subtitle="Enter the email address associated with your account to receive a reset link."
            onSubmit={handleSubmit}
            footer={
              <div className="text-center">
                <IonRouterLink routerLink="/login">
                  <button
                    type="button"
                    className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Login</span>
                  </button>
                </IonRouterLink>
              </div>
            }
          >
            {isSubmitted ? (
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Reset Link Sent!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  We've sent a password reset link to <strong className="text-emerald-700 dark:text-emerald-400">{email}</strong>. Please check your inbox or spam folder.
                </p>
                <div className="pt-2">
                  <IonRouterLink routerLink="/reset-password">
                    <Button variant="emerald" size="sm" fullWidth>
                      Proceed to Reset Password Page
                    </Button>
                  </IonRouterLink>
                </div>
              </div>
            ) : (
              <>
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="doctor@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  isValid={touched && isEmailValid}
                  error={touched && !isEmailValid ? 'Please enter a valid email address' : undefined}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading}
                  leftIcon={<Send className="w-4 h-4" />}
                  className="mt-2"
                >
                  Send Reset Link
                </Button>
              </>
            )}
          </FormLayout>
        </AuthLayout>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
