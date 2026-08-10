import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';

interface AppShellProps {
  title: string;
  children: React.ReactNode;
  backButton?: boolean;
}

const AppShell: React.FC<AppShellProps> = ({ title, children, backButton }) => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="px-4">
          {backButton && (
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
          )}
          <IonTitle className="font-black text-xl text-slate-800">{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding bg-[#F8FAFC]">
        <div className="max-w-md mx-auto space-y-6 pb-24">
          {children}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AppShell;
