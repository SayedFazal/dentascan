import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, User } from '../lib/storage';
import {
  registerWithFirebase,
  loginWithFirebase,
  logoutWithFirebase,
  onAuthStateChanged,
} from '../lib/firebaseAuth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateConsent: (accepted: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthContext] Setting up Firebase auth state listener');

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      console.log('[AuthContext] Auth state changed:', firebaseUser?.email || 'logged out');
      if (firebaseUser) {
        setUser(firebaseUser);
        storage.saveUser(firebaseUser).catch(err => console.error('Failed to cache user:', err));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('[AuthContext] Unsubscribing from auth state listener');
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('[AuthContext] Signing in:', email);
    const loggedInUser = await loginWithFirebase(email, password);
    setUser(loggedInUser);
    await storage.saveUser(loggedInUser);
  };

  const signUp = async (name: string, email: string, password: string) => {
    console.log('[AuthContext] Signing up:', email);
    const registeredUser = await registerWithFirebase(email, password, name);
    setUser(registeredUser);
    await storage.saveUser(registeredUser);
  };

  const signInWithGoogle = async () => {
    throw new Error('Google Sign-In is not yet implemented. Please use email and password to sign in.');
  };

  const signOut = async () => {
    console.log('[AuthContext] Signing out');
    try {
      await logoutWithFirebase();
      setUser(null);
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
      throw error;
    }
  };

  const updateConsent = async (accepted: boolean) => {
    if (user) {
      const updatedUser = { ...user, consentAccepted: accepted };
      await storage.saveUser(updatedUser);
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut, updateConsent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
