import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';

export interface User {
  id: string; // Firebase UID
  email: string;
  name: string;
  consentAccepted: boolean;
}

/**
 * Adapter: Convert Firebase User to DentaScan User format
 */
export function firebaseUserToAppUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    consentAccepted: true,
  };
}

/**
 * Register new user with Firebase Authentication
 */
export async function registerWithFirebase(
  email: string,
  password: string,
  fullName: string
): Promise<User> {
  console.log('[FIREBASE] Registering user:', email);

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    console.log('[FIREBASE] Account created, UID:', firebaseUser.uid);

    // Set display name
    await updateProfile(firebaseUser, {
      displayName: fullName,
    });

    console.log('[FIREBASE] Display name set:', fullName);

    // Return adapted user
    const appUser = firebaseUserToAppUser(firebaseUser);
    console.log('[FIREBASE] Registration successful');

    return appUser;
  } catch (error: any) {
    console.error('[FIREBASE] Registration error:', error.code, error.message);

    // Map Firebase errors to user-friendly messages
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use a stronger password.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address. Please check and try again.');
    }

    throw new Error(error.message || 'Registration failed. Please try again.');
  }
}

/**
 * Login user with Firebase Authentication
 */
export async function loginWithFirebase(email: string, password: string): Promise<User> {
  console.log('[FIREBASE] Logging in user:', email);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    console.log('[FIREBASE] Login successful, UID:', firebaseUser.uid);

    return firebaseUserToAppUser(firebaseUser);
  } catch (error: any) {
    console.error('[FIREBASE] Login error:', error.code, error.message);

    // Map Firebase errors to user-friendly messages
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Invalid email or password. Please verify your credentials and try again.');
    }
    if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many login attempts. Please try again later.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address. Please check and try again.');
    }

    throw new Error(error.message || 'Login failed. Please try again.');
  }
}

/**
 * Logout user
 */
export async function logoutWithFirebase(): Promise<void> {
  console.log('[FIREBASE] Logging out user');

  try {
    await signOut(auth);
    console.log('[FIREBASE] Logout successful');
  } catch (error: any) {
    console.error('[FIREBASE] Logout error:', error.message);
    throw new Error(error.message || 'Logout failed.');
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    return null;
  }
  return firebaseUserToAppUser(firebaseUser);
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      callback(firebaseUserToAppUser(firebaseUser));
    } else {
      callback(null);
    }
  });
}
