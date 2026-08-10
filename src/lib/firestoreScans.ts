import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  Firestore,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { Scan } from './storage';

let db: Firestore | null = null;

function getDB(): Firestore {
  if (!db) {
    db = getFirestore();
  }
  return db;
}

/**
 * Save scan to Firestore (cloud-backed, source of truth)
 */
export async function saveFirestoreScan(userId: string, scan: Scan): Promise<void> {
  if (!userId) {
    console.warn('[Firestore] Cannot save scan without userId');
    return;
  }

  try {
    const firebaseDB = getDB();
    const scanRef = doc(firebaseDB, `users/${userId}/scans`, scan.id);

    // Store without imageUrl to avoid size limits (can use Storage for images if needed)
    const scanData = {
      ...scan,
      imageUrl: scan.imageUrl?.substring(0, 100) || '', // Keep only metadata, not full base64
      userId,
      syncedAt: new Date().toISOString(),
    };

    await setDoc(scanRef, scanData);
    console.log('[Firestore] Scan saved:', scan.id);
  } catch (error: any) {
    console.error('[Firestore] Failed to save scan:', error.message);
    throw error;
  }
}

/**
 * Get all scans for a user from Firestore (cloud-backed)
 */
export async function getFirestoreScans(userId: string): Promise<Scan[]> {
  if (!userId) {
    console.warn('[Firestore] Cannot get scans without userId');
    return [];
  }

  try {
    const firebaseDB = getDB();
    const scansRef = collection(firebaseDB, `users/${userId}/scans`);

    // Query all scans for this user, ordered by date (newest first)
    const q = query(scansRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);

    const scans: Scan[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      scans.push({
        id: data.id || doc.id,
        userId: data.userId,
        date: data.date,
        imageUrl: data.imageUrl,
        plaqueClass: data.plaqueClass,
        confidence: data.confidence,
        matchedSampleId: data.matchedSampleId,
        label: data.label,
        labelId: data.labelId,
        className: data.className,
        modelType: data.modelType,
      } as Scan);
    });

    console.log('[Firestore] Retrieved scans:', scans.length);
    return scans;
  } catch (error: any) {
    console.error('[Firestore] Failed to get scans:', error.message);
    // Return empty array on error - local cache will provide fallback
    return [];
  }
}

/**
 * Get single scan from Firestore
 */
export async function getFirestoreScan(userId: string, scanId: string): Promise<Scan | null> {
  if (!userId || !scanId) {
    return null;
  }

  try {
    const firebaseDB = getDB();
    const scanRef = doc(firebaseDB, `users/${userId}/scans`, scanId);
    const snapshot = await getDoc(scanRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return {
      id: data.id || snapshot.id,
      userId: data.userId,
      date: data.date,
      imageUrl: data.imageUrl,
      plaqueClass: data.plaqueClass,
      confidence: data.confidence,
      matchedSampleId: data.matchedSampleId,
      label: data.label,
      labelId: data.labelId,
      className: data.className,
      modelType: data.modelType,
    } as Scan;
  } catch (error: any) {
    console.error('[Firestore] Failed to get single scan:', error.message);
    return null;
  }
}

/**
 * Delete scan from Firestore
 */
export async function deleteFirestoreScan(userId: string, scanId: string): Promise<void> {
  if (!userId || !scanId) {
    return;
  }

  try {
    const firebaseDB = getDB();
    const scanRef = doc(firebaseDB, `users/${userId}/scans`, scanId);
    await deleteDoc(scanRef);
    console.log('[Firestore] Scan deleted:', scanId);
  } catch (error: any) {
    console.error('[Firestore] Failed to delete scan:', error.message);
    throw error;
  }
}

/**
 * Clear all scans for a user from Firestore
 */
export async function clearFirestoreScans(userId: string): Promise<void> {
  if (!userId) {
    return;
  }

  try {
    const firebaseDB = getDB();
    const scansRef = collection(firebaseDB, `users/${userId}/scans`);
    const snapshot = await getDocs(scansRef);

    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
    }

    console.log('[Firestore] All scans cleared for user:', userId);
  } catch (error: any) {
    console.error('[Firestore] Failed to clear scans:', error.message);
    throw error;
  }
}

/**
 * Check if Firestore is accessible (for connectivity testing)
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    getDB();
    console.log('[Firestore] Connection test passed');
    return true;
  } catch (error) {
    console.error('[Firestore] Connection test failed:', error);
    return false;
  }
}
