# Firestore Scan Sync Testing Guide

## ⚠️ CRITICAL FIRST STEP

### Enable Firestore Security Rules in Firebase Console

**This MUST be done before testing:**

1. Go to **[Firebase Console](https://console.firebase.google.com)** → **dentascan-20cea**
2. Select **Firestore Database**
3. Click **Rules** tab
4. Copy/paste rules from `FIRESTORE_SECURITY_RULES.md`
5. Click **Publish**

**Without this step, Firestore will be unprotected and tests will not work correctly.**

---

## Architecture Implemented

**Data Flow (NEW):**
```
Android Phone
    ↓
  Firebase Auth (same user)
    ↓
Firestore Collection: users/{firebaseUID}/scans/*
    ↓
  Website Browser
```

**Storage Hierarchy:**
1. **Firestore** (Cloud) - PRIMARY SOURCE OF TRUTH
2. Local Cache (IndexedDB + localStorage) - FALLBACK ONLY

---

## Pre-Test Checklist

- [ ] Firestore security rules published in Firebase Console
- [ ] `npm run build` completed successfully
- [ ] `npx cap sync android` completed successfully
- [ ] Android APK rebuilt in Android Studio (with new sync)
- [ ] Old DentaScan app uninstalled from Android device
- [ ] New APK installed on Android device
- [ ] Backend running: `npm run dev` (in terminal)
- [ ] Website accessible: `http://localhost:3000`

---

## Test Sequence

### TEST 1: Android Creates Scans

**Setup:**
- Device: Android phone with new APK
- Backend: `npm run dev` running
- Browser: NOT opened yet

**Steps:**
1. Open DentaScan app on Android
2. Login: `syncdemo@example.com` / `Password123`
3. **Scan 1:** Tap camera button, capture/upload teeth image
4. **Scan 2:** Capture another image
5. Go to **History** → Verify **2 scans appear**

**Expected:**
```
Scans saved to:
  Firestore: users/{firebaseUID}/scans/scan1, scan2
  Android Local Cache: Also has copies
```

**Server Logs Show:**
```
[Storage] Scan saved to Firestore: [scan-id]
[Firestore] Scan saved: [scan-id]
```

**Android Shows:**
```
History: 2 scans
```

**Status:** ✅ / ❌

---

### TEST 2: Website Sees Android's Scans (CRITICAL)

**Setup:**
- Android: Still has 2 scans
- Website: Open in laptop browser

**Steps:**
1. Go to **http://localhost:3000**
2. Login: `syncdemo@example.com` / `Password123`
3. Click **History**

**Expected:**
```
Website History shows: 2 scans
(SAME scans from Android)
```

**Browser Console Shows:**
```
[Storage] Getting scans for user: [firebaseUID]
[Storage] Retrieved from Firestore: 2
```

**Status:** ✅ / ❌

**If website shows NO scans:**
- ❌ FAILURE: Firestore sync not working
- Check: Firestore console → users/{uid}/scans (should have 2 documents)
- Check: Browser console for errors
- Check: User is logging in as same Firebase account

---

### TEST 3: Website Creates Scan

**Setup:**
- Website: Logged in, showing 2 scans from Android
- Android: Still open with 2 scans

**Steps:**
1. Website: Click **Scan** button
2. Capture/upload another image
3. Submit scan
4. Website **History** → Should show **3 scans**
5. Go back to Android app
6. Android: Tap **History** (refresh if needed)

**Expected:**
```
Website History: 3 scans
Android History: 3 scans (including new one from website)
```

**Firestore Should Have:**
```
users/{firebaseUID}/scans/ → 3 documents
```

**Status:** ✅ / ❌

**If Android still shows 2 scans:**
- ❌ Sync not working in reverse
- Manually close/reopen Android app
- Pull-to-refresh History if available
- Check Firestore console for 3 documents

---

### TEST 4: Cross-Device Account Access

**Setup:**
- Create NEW account (not syncdemo)
- Test account: `crosstest@example.com` / `Password123`

**Steps:**
1. Website: Register `crosstest@example.com`
2. Website: Create 2 scans
3. Website: Logout
4. Android: Logout
5. Android: Login `crosstest@example.com`
6. Android: Open **History**

**Expected:**
```
Android shows: 2 scans (same as website)
```

**Status:** ✅ / ❌

---

### TEST 5: User Isolation

**Setup:**
- Account A: `syncdemo@example.com` (has 3+ scans)
- Account B: `otheruser@example.com`

**Steps:**
1. Website: Login Account A
2. Website: Verify Account A sees their scans
3. Website: **Switch Account** (logout → login Account B)
4. Website: Should show Account B's scans (NOT Account A's)

**Expected:**
```
Account A → Only Account A's scans visible
Account B → Only Account B's scans visible
No account can see another account's data
```

**Status:** ✅ / ❌

**If Account B sees Account A's scans:**
- ❌ CRITICAL SECURITY ISSUE
- Check Firestore security rules
- Rule violation: should restrict access by UID

---

### TEST 6: Offline & Sync Recovery

**Setup:**
- Phone: 5 scans total
- Device: Turn off WiFi/airplane mode

**Steps:**
1. Android: Create new scan (offline)
2. Android: **History** → Should show 6 scans
3. Android: Turn WiFi back on
4. Wait 2-3 seconds
5. Website: Open History (or refresh)

**Expected:**
```
Website: Eventually sees 6 scans (after sync)
Firestore: Has all 6 scan documents
```

**Status:** ✅ / ❌

**Note:** Firestore persistence handles offline queuing automatically.

---

### TEST 7: Image Handling

**Setup:**
- Scans created from both platforms

**Steps:**
1. Website: Open scan from Android
2. Website: Image should display
3. Android: Open scan from website
4. Android: Image should display

**Expected:**
```
Both platforms: Can view images from scans created by either platform
Image URLs work across platforms
```

**Status:** ✅ / ❌

---

### TEST 8: Dashboard Statistics

**Setup:**
- Account with multiple scans

**Steps:**
1. Android: View Dashboard (shows total scans, recent, etc.)
2. Website: View Dashboard (same account)

**Expected:**
```
Dashboard shows same statistics on both:
- Total scans count
- Recent scans list
- Any charts/trends
```

**Status:** ✅ / ❌

---

## Troubleshooting

### Website shows empty History after login

**Checklist:**
- [ ] Firestore security rules published
- [ ] User logged in with correct Firebase account
- [ ] Firestore has documents: `users/{uid}/scans/*`
- [ ] Browser console: any errors?
- [ ] Try: Logout → close tab → login again
- [ ] Try: Check Firebase Console for documents

### Android shows 2 scans, Website shows 0

**Checklist:**
- [ ] Are both using same Firebase account?
- [ ] Check Firebase Console → Authentication (same email?)
- [ ] Check Firestore → users/{uid} (are docs there?)
- [ ] Check Android UIDs match Website UIDs
- [ ] Try: Logout website → login as same Firebase account again

### Scans delete but reappear

**Checklist:**
- [ ] Firestore rules allow delete?
- [ ] Local cache not re-syncing deleted items?
- [ ] Try: Logout → login to clear cache

### "Missing or insufficient permissions" error

**Means:**
- Firestore security rules are working
- But user doesn't have permission
- Check: User UID in request matches user document

**Fix:**
- Logout → Login again to refresh auth token
- Or check if security rules are correct

---

## Success Criteria

All 8 tests passing = ✅ READY FOR DEMO

- ✅ Android creates scans → Firestore
- ✅ Website sees Android scans
- ✅ Website creates scans → Firestore  
- ✅ Android sees Website scans
- ✅ Cross-platform accounts work
- ✅ User isolation enforced
- ✅ Offline sync works
- ✅ Images accessible across platforms

---

## Firebase Console Verification

After testing, verify in **Firebase Console**:

1. **Firestore Database** → **Data**
   - Should see: `users/{multiple-uids}/scans/{many-documents}`
   - Each user's scans are in their own subcollection

2. **Authentication** → **Users**
   - Should see: `syncdemo@example.com`, `crosstest@example.com`, etc.
   - All created via Firebase Auth (✅ correct)

3. **Firestore** → **Rules**
   - Should see: Security rules published
   - Verify: `request.auth.uid == uid` restriction in place

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Scan history is synchronized across platforms
2. ✅ Same Firebase user = same scan data
3. ✅ Ready for college demonstration
4. ✅ No Neon changes (PostgreSQL untouched)
5. ✅ All existing UI preserved

Proceed to: **College Presentation Demo**
