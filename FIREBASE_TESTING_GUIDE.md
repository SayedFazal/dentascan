# Firebase Authentication Testing Guide

## Implementation Complete ✅

- ✅ Firebase SDK installed
- ✅ Firebase config in .env
- ✅ AuthContext replaced with Firebase
- ✅ Backend server running
- ✅ Frontend ready to test
- ✅ Android Capacitor synced

---

## Test Sequence

### TEST 1: Website Registration

**Steps:**
1. Open browser: `http://localhost:3000`
2. Click **"Create Account"**
3. Fill form:
   - **Name:** Test User 1
   - **Email:** testuser1@example.com
   - **Password:** TestPass123
   - **Confirm Password:** TestPass123
   - **Accept Terms:** Check box
4. Click **"Create Account"**

**Expected Result:**
- ✅ No error message
- ✅ Redirected to **Dashboard**
- ✅ Dashboard displays (your existing design, NOT a simple new one)
- ✅ Camera button visible
- ✅ Navigation works
- ✅ User name appears in settings

**Verify in Firebase Console:**
- Go to Firebase Console
- Authentication → Users
- Should see: `testuser1@example.com`

---

### TEST 2: Website Login/Logout

**Steps:**
1. Click **Settings** or user icon
2. Click **Logout**
3. Click **"Sign In"**
4. Fill form:
   - **Email:** testuser1@example.com
   - **Password:** TestPass123
5. Click **"Sign In"**

**Expected Result:**
- ✅ Dashboard loads
- ✅ Same user data displayed

**Then logout and test:**
- ✅ Logout works
- ✅ Redirected to login page

---

### TEST 3: Website - Invalid Password

**Steps:**
1. From login page
2. **Email:** testuser1@example.com
3. **Password:** WrongPassword
4. Click **"Sign In"**

**Expected Result:**
- ✅ Error message: "Invalid email or password"
- ✅ Dashboard does NOT open
- ✅ Stays on login page

---

### TEST 4: Website - Session Persistence

**Steps:**
1. Login with testuser1@example.com
2. Close browser completely
3. Reopen browser
4. Go to `http://localhost:3000`

**Expected Result:**
- ✅ Automatically logged in (Firebase persists auth)
- ✅ Dashboard loads immediately
- ✅ No login prompt

---

### TEST 5: Android Registration

**Prerequisites:**
1. Build fresh APK in Android Studio:
   ```bash
   npx cap open android
   # Build → Build APK(s)
   # Run → Run 'app'
   ```

2. Uninstall old DentaScan app first

3. Install new APK on device

**Steps on Android:**
1. Open DentaScan app
2. Click **"Create Account"**
3. Fill form:
   - **Name:** Test User 2
   - **Email:** testuser2@example.com
   - **Password:** TestPass123
   - **Confirm:** TestPass123
   - **Accept Terms:** Check
4. Tap **"Create Account"**

**Expected Result:**
- ✅ No error
- ✅ Dashboard loads (your existing design)
- ✅ Camera button visible
- ✅ App is NOT using localhost/127.0.0.1

**Verify:**
- Go to Firebase Console
- Authentication → Users
- Should see: `testuser2@example.com` (created by Android)

---

### TEST 6: Android-Created Account → Website Login

**Steps:**
1. Open website browser
2. Click **"Sign In"**
3. **Email:** testuser2@example.com (created from Android)
4. **Password:** TestPass123
5. Click **"Sign In"**

**Expected Result:**
- ✅ Login success
- ✅ Dashboard loads
- ✅ Same account works on both platforms

---

### TEST 7: Website Account → Android Login

**Steps:**
1. Open Android app
2. If logged in, logout first
3. Click **"Sign In"**
4. **Email:** testuser1@example.com (created on website)
5. **Password:** TestPass123
6. Tap **"Sign In"**

**Expected Result:**
- ✅ Login success
- ✅ Dashboard loads
- ✅ Same account accessible on both

---

### TEST 8: App Restart/Persistence

**On Android:**
1. Login with an account
2. Close the app completely
3. Reopen DentaScan app
4. Wait 2-3 seconds

**Expected Result:**
- ✅ Automatically logged in
- ✅ Dashboard loads immediately
- ✅ No login prompt

**On Website:**
1. Login
2. Close browser
3. Reopen, go to `http://localhost:3000`

**Expected Result:**
- ✅ Still logged in
- ✅ Dashboard immediately available

---

### TEST 9: Existing Dashboard Preserved

**Verify both Website and Android show:**
- ✅ Dashboard (not a new simple one)
- ✅ Scan button with camera icon
- ✅ Existing navigation
- ✅ Settings page
- ✅ Existing charts/cards
- ✅ All original UI elements

---

### TEST 10: Existing Camera Functionality

**On Android:**
1. Login
2. Tap **Camera** or **Scan** button
3. Try to take a photo

**Expected Result:**
- ✅ Camera opens
- ✅ Can capture image
- ✅ Existing scan flow continues

**On Website:**
1. Login
2. Click **Scan** button
3. Try to upload image

**Expected Result:**
- ✅ Upload/camera works
- ✅ Existing functionality preserved

---

## Troubleshooting

### Issue: "Invalid response from authentication server"

**Check:**
1. Firebase config in .env is correct
2. VITE_FIREBASE_* variables set
3. Firebase project allows Email/Password auth
4. Internet connection working (Firebase is cloud-based)

### Issue: Android app uses localhost

**Check:**
1. Run: `npm run build && npx cap sync android`
2. Verify .env has VITE_FIREBASE_* (not localhost in config)
3. Rebuild APK with fresh build
4. Uninstall old app before installing new one

### Issue: Website and Android have different accounts

**Should NOT happen** - Both use SAME Firebase project
- Verify VITE_FIREBASE_PROJECT_ID is same in both
- Check Firebase Console shows single user list

### Issue: Dashboard doesn't load after login

**Check:**
1. Existing dashboard files still present in src/pages/Dashboard.tsx
2. Navigation components intact
3. Browser console for errors (F12)
4. Android logs (adb logcat)

---

## Success Criteria

All tests passing = Ready for college demonstration:

- ✅ Website register → Firebase account created
- ✅ Android register → Firebase account created
- ✅ Both platforms use SAME accounts
- ✅ Invalid credentials rejected
- ✅ Session persists after app restart
- ✅ Logout clears session
- ✅ Existing dashboard preserved
- ✅ Existing camera functionality works
- ✅ Website still builds
- ✅ Android still builds
- ✅ Neon database unchanged
- ✅ No scan_sessions table created
- ✅ No scan_images table created

---

## Architecture Verification

Final architecture should be:

```
Website (React) ────────┐
                        ↓
        Firebase Authentication
        (Shared project)
                        ↑
Android (Capacitor) ─────┘

↓

Neon PostgreSQL (untouched for now)
```

Both platforms talk to **SAME Firebase project**.
Firebase creates/verifies accounts.
Neon remains for existing backend.

---

## If Issues Found

**Do NOT:**
- ❌ Change database schema
- ❌ Create new tables
- ❌ Migrate to Firestore
- ❌ Redesign dashboard
- ❌ Remove camera functionality

**DO:**
- ✅ Check Firebase config
- ✅ Verify .env has correct values
- ✅ Check console/logcat for errors
- ✅ Rebuild if any changes made
- ✅ Uninstall old APK before reinstalling

---

## Ready for Demo?

Once all 10 tests pass:

✅ Demo is ready
✅ Website can register/login
✅ Android can register/login
✅ Accounts shared across platforms
✅ Existing functionality preserved
✅ College presentation ready

---

## Contact Firebase Support

If Firebase authentication issues:
- Check Firebase Console authentication settings
- Verify Email/Password auth is enabled
- Check project rules/permissions
- Ensure API keys are correct
