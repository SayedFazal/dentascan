import React, { useState } from 'react';
import { IonPage, IonContent, IonRouterLink } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Key, ArrowLeft, Check, Sparkles, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import FormLayout from '../components/auth/FormLayout';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';

const ResetPassword: React.FC = () => {
  const history = useHistory();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const passwordCriteria = {
    hasMinLength: newPassword.length >= 8,
    hasUpper: /[A-Z]/.test(newPassword),
    hasLower: /[a-z]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const doPasswordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isPasswordValid && doPasswordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ newPassword: true, confirmPassword: true });

    if (!isFormValid) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <IonPage>
      <IonContent className="bg-slate-50 dark:bg-slate-950 font-sans">
        <AuthLayout
          badgeText="Security Center"
          title="Create New Password"
          subtitle="Set a secure new password for your DentaScan AI clinical profile."
        >
          <FormLayout
            badge="Password Reset"
            badgeIcon={<Sparkles className="w-3.5 h-3.5 text-blue-500" />}
            title="Reset Password"
            subtitle="Your new password must be different from previously used credentials"
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
            {isSuccess ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Password Updated!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Your password has been successfully updated. You can now log in with your new credentials.
                </p>
                <Button
                  type="button"
                  variant="emerald"
                  size="lg"
                  fullWidth
                  onClick={() => history.push('/login')}
                  className="mt-2"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <>
                {/* New Password */}
                <div className="space-y-2">
                  <PasswordInput
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, newPassword: true }))}
                    placeholder="••••••••"
                    isValid={touched.newPassword && isPasswordValid}
                    error={touched.newPassword && !isPasswordValid ? 'Password does not meet requirements' : undefined}
                    required
                  />

                  {/* Password Strength Indicator Box */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-1.5 text-[11px]">
                    <span className="block font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[9px]">
                      Requirements Checklist:
                    </span>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-semibold">
                      <div className={`flex items-center space-x-1.5 ${passwordCriteria.hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {passwordCriteria.hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> : <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />}
                        <span>8+ Characters</span>
                      </div>
                      <div className={`flex items-center space-x-1.5 ${passwordCriteria.hasUpper ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {passwordCriteria.hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> : <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />}
                        <span>Uppercase Letter</span>
                      </div>
                      <div className={`flex items-center space-x-1.5 ${passwordCriteria.hasLower ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {passwordCriteria.hasLower ? <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> : <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />}
                        <span>Lowercase Letter</span>
                      </div>
                      <div className={`flex items-center space-x-1.5 ${passwordCriteria.hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {passwordCriteria.hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> : <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />}
                        <span>One Number</span>
                      </div>
                      <div className={`flex items-center space-x-1.5 col-span-2 ${passwordCriteria.hasSpecial ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {passwordCriteria.hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" /> : <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />}
                        <span>Special Symbol (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <PasswordInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                  placeholder="••••••••"
                  isValid={touched.confirmPassword && doPasswordsMatch}
                  error={touched.confirmPassword && !doPasswordsMatch ? 'Passwords do not match' : undefined}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading || !isFormValid}
                  leftIcon={<Key className="w-4 h-4" />}
                  className="mt-2"
                >
                  Reset Password
                </Button>
              </>
            )}
          </FormLayout>
        </AuthLayout>
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword;
