import { openDB, IDBPDatabase } from 'idb';
import { imageUtils } from './image-utils';
import {
  saveFirestoreScan,
  getFirestoreScans,
  deleteFirestoreScan,
  clearFirestoreScans,
} from './firestoreScans';

export interface User {
  id: string;
  name: string;
  email: string;
  consentAccepted: boolean;
}

export interface Scan {
  id: string;
  userId: string;
  date: string;
  imageUrl: string;
  plaqueClass: 'Low' | 'Medium' | 'High';
  confidence: number;
  matchedSampleId: string;
  label?: 'LABEL_0' | 'LABEL_1' | 'LABEL_2' | 'LABEL_3';
  labelId?: number;
  className?: string;
  modelType?: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  date: string;
  brushingAM: boolean;
  brushingPM: boolean;
  flossing: boolean;
}

const DB_NAME = 'dentascan_db';
const DB_VERSION = 2;
const SCANS_LS_KEY = 'dentascan_scans_v2';
const CHECKINS_LS_KEY = 'dentascan_checkins_v2';

function getLocalScans(): Scan[] {
  try {
    const raw = localStorage.getItem(SCANS_LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalScans(scans: Scan[]) {
  try {
    localStorage.setItem(SCANS_LS_KEY, JSON.stringify(scans));
  } catch (e) {
    console.warn("localStorage save failed:", e);
  }
}

function getLocalCheckIns(): CheckIn[] {
  try {
    const raw = localStorage.getItem(CHECKINS_LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalCheckIns(checkins: CheckIn[]) {
  try {
    localStorage.setItem(CHECKINS_LS_KEY, JSON.stringify(checkins));
  } catch (e) {
    console.warn("localStorage save checkins failed:", e);
  }
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('users_by_email')) {
          db.createObjectStore('users_by_email', { keyPath: 'email' });
        }
        if (!db.objectStoreNames.contains('scans')) {
          const scanStore = db.createObjectStore('scans', { keyPath: 'id' });
          scanStore.createIndex('by_user', 'userId');
          scanStore.createIndex('by_date', 'date');
        }
        if (!db.objectStoreNames.contains('checkins')) {
          const checkinStore = db.createObjectStore('checkins', { keyPath: 'id' });
          checkinStore.createIndex('by_user', 'userId');
          checkinStore.createIndex('by_date', 'date');
        }
      },
    });
  }
  return dbPromise;
}

export const storage = {
  async saveUser(user: User): Promise<void> {
    try {
      const db = await getDB();
      await db.put('users', user);
      await db.put('users_by_email', user);
    } catch (e) {
      console.warn("saveUser IDB failed:", e);
    }
  },
  async getUser(id: string): Promise<User | null> {
    try {
      const db = await getDB();
      return (await db.get('users', id)) || null;
    } catch (e) {
      return null;
    }
  },
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const db = await getDB();
      return (await db.get('users_by_email', email)) || null;
    } catch (e) {
      return null;
    }
  },
  async saveScan(scan: Scan): Promise<void> {
    // 1. Compress image to prevent quota issues
    if (scan.imageUrl && scan.imageUrl.length > 100000) {
      try {
        scan.imageUrl = await imageUtils.compressImage(scan.imageUrl, 800, 0.75);
      } catch (e) {
        console.warn("Image compression failed before scan save:", e);
      }
    }

    // 2. Save to Firestore (CLOUD - source of truth)
    try {
      if (scan.userId) {
        await saveFirestoreScan(scan.userId, scan);
        console.log('[Storage] Scan saved to Firestore:', scan.id);
      } else {
        console.warn('[Storage] Cannot save to Firestore without userId');
      }
    } catch (error) {
      console.error('[Storage] Firestore save failed:', error);
      // Continue to local backup even if Firestore fails
    }

    // 3. Local cache backup (fallback if offline/Firestore fails)
    try {
      const existing = getLocalScans();
      const updated = [scan, ...existing.filter(s => s.id !== scan.id)];
      saveLocalScans(updated);
    } catch (e) {
      console.warn("Failed to backup scan to localStorage:", e);
    }

    // 4. IndexedDB backup
    try {
      const db = await getDB();
      await db.put('scans', scan);
    } catch (e) {
      console.warn("IndexedDB saveScan failed:", e);
    }
  },
  async getScans(userId: string): Promise<Scan[]> {
    console.log('[Storage] Getting scans for user:', userId);

    // 1. Try to fetch from Firestore (CLOUD - source of truth)
    let firestoreScans: Scan[] = [];
    try {
      if (userId && userId !== 'guest_dentist_session') {
        firestoreScans = await getFirestoreScans(userId);
        console.log('[Storage] Retrieved from Firestore:', firestoreScans.length);
      }
    } catch (error) {
      console.warn('[Storage] Firestore fetch failed:', error);
      // Fall through to local cache
    }

    // 2. If Firestore returned data, use it (cloud is source of truth)
    if (firestoreScans.length > 0) {
      return firestoreScans.sort((a, b) => b.date.localeCompare(a.date));
    }

    // 3. Fallback to local cache (IndexedDB + localStorage)
    let idbScans: Scan[] = [];

    // Read IndexedDB
    try {
      const db = await getDB();
      try {
        idbScans = await db.getAllFromIndex('scans', 'by_user', userId);
      } catch (e) {
        const allScans = await db.getAll('scans') as Scan[];
        idbScans = allScans;
      }
    } catch (e) {
      console.warn("getScans IndexedDB lookup failed:", e);
    }

    // Read LocalStorage
    const lsScans = getLocalScans();

    // Merge & deduplicate by ID
    const mergedMap = new Map<string, Scan>();
    [...idbScans, ...lsScans].forEach(s => {
      if (s && s.id) {
        // Match user ID or guest session or empty
        if (!userId || s.userId === userId || s.userId === 'guest_dentist_session' || userId === 'guest_dentist_session' || !s.userId) {
          mergedMap.set(s.id, s);
        }
      }
    });

    console.log('[Storage] Retrieved from local cache:', mergedMap.size);
    return Array.from(mergedMap.values()).sort((a, b) => b.date.localeCompare(a.date));
  },
  async deleteScan(scanId: string, userId?: string): Promise<void> {
    // 1. Delete from Firestore (cloud source of truth)
    if (userId && userId !== 'guest_dentist_session') {
      try {
        await deleteFirestoreScan(userId, scanId);
        console.log('[Storage] Scan deleted from Firestore:', scanId);
      } catch (error) {
        console.error('[Storage] Failed to delete from Firestore:', error);
      }
    }

    // 2. Delete from local cache
    try {
      const existing = getLocalScans();
      const updated = existing.filter(s => s.id !== scanId);
      saveLocalScans(updated);
    } catch (e) {
      console.warn("Failed to delete scan from localStorage:", e);
    }

    // 3. Delete from IndexedDB
    try {
      const db = await getDB();
      await db.delete('scans', scanId);
    } catch (e) {
      console.warn("IndexedDB deleteScan failed:", e);
    }
  },
  async clearAllScans(userId?: string): Promise<void> {
    // 1. Clear from Firestore (cloud source of truth)
    if (userId && userId !== 'guest_dentist_session') {
      try {
        await clearFirestoreScans(userId);
        console.log('[Storage] All scans cleared from Firestore for user:', userId);
      } catch (error) {
        console.error('[Storage] Failed to clear Firestore scans:', error);
      }
    }

    // 2. Clear from local cache
    try {
      if (userId && userId !== 'guest_dentist_session') {
        const existing = getLocalScans();
        const remaining = existing.filter(s => s.userId && s.userId !== userId && s.userId !== 'guest_dentist_session');
        saveLocalScans(remaining);
      } else {
        saveLocalScans([]);
      }
    } catch (e) {
      console.warn("Failed to clear scans from localStorage:", e);
    }

    // 3. Clear from IndexedDB
    try {
      const db = await getDB();
      if (userId && userId !== 'guest_dentist_session') {
        const userScans = await db.getAllFromIndex('scans', 'by_user', userId);
        for (const scan of userScans) {
          await db.delete('scans', scan.id);
        }
      } else {
        await db.clear('scans');
      }
    } catch (e) {
      console.warn("IndexedDB clearAllScans failed:", e);
    }
  },
  async saveCheckIn(checkIn: CheckIn): Promise<void> {
    try {
      const existing = getLocalCheckIns();
      const updated = [checkIn, ...existing.filter(c => c.id !== checkIn.id)];
      saveLocalCheckIns(updated);
    } catch (e) {
      console.warn("saveCheckIn localStorage error:", e);
    }

    try {
      const db = await getDB();
      await db.put('checkins', checkIn);
    } catch (e) {
      console.warn("saveCheckIn IDB error:", e);
    }
  },
  async getCheckInByDate(userId: string, date: string): Promise<CheckIn | null> {
    const all = await this.getAllCheckIns(userId);
    return all.find((c: CheckIn) => c.date === date) || null;
  },
  async getCheckInsRecent(userId: string, days: number = 7): Promise<CheckIn[]> {
    const all = await this.getAllCheckIns(userId);
    return all.slice(0, days);
  },
  async getAllCheckIns(userId: string): Promise<CheckIn[]> {
    let idbCI: CheckIn[] = [];
    try {
      const db = await getDB();
      try {
        idbCI = await db.getAllFromIndex('checkins', 'by_user', userId);
      } catch (e) {
        const allCI = await db.getAll('checkins') as CheckIn[];
        idbCI = allCI;
      }
    } catch (e) {
      console.warn("getAllCheckIns IDB error:", e);
    }

    const lsCI = getLocalCheckIns();

    const mergedMap = new Map<string, CheckIn>();
    [...idbCI, ...lsCI].forEach(c => {
      if (c && c.id) {
        if (!userId || c.userId === userId || c.userId === 'guest_dentist_session' || userId === 'guest_dentist_session' || !c.userId) {
          mergedMap.set(c.id, c);
        }
      }
    });

    return Array.from(mergedMap.values()).sort((a: CheckIn, b: CheckIn) => b.date.localeCompare(a.date));
  }
};
