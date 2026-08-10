import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Check } from 'lucide-react';
import Button from '../components/ui/Button';

const Consent: React.FC = () => {
  const history = useHistory();
  const { updateConsent } = useAuth();

  const handleAccept = async () => {
    await updateConsent(true);
    history.push('/app/dashboard');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding bg-slate-50">
        <div className="max-w-md mx-auto h-full flex flex-col items-center justify-center space-y-8 p-8">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl border border-teal-500/20 flex items-center justify-center shadow-md shadow-teal-500/10">
            <ShieldCheck className="w-8 h-8 text-[#14B8A6]" />
          </div>
          
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Your Privacy Matters</h2>
            <p className="text-slate-500 text-xs font-semibold leading-relaxed">
              PerioCompliance AI uses your device's camera to analyze plaque levels locally. Your photos are processed strictly inside local browser memory and are never uploaded to remote servers. By continuing, you agree to our data processing policy.
            </p>
          </div>

          <div className="w-full space-y-3.5 pt-6">
            <Button 
              variant="primary"
              size="lg"
              glow={true}
              onClick={handleAccept}
              leftIcon={<Check className="w-5 h-5 stroke-[3]" />}
              className="w-full"
            >
              I Understand & Accept
            </Button>
            
            <Button 
              variant="ghost"
              size="md"
              onClick={() => history.push('/landing')}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Consent;
