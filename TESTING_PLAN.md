# DentaScan Authentication Testing Plan

## Overview

This document provides a complete testing checklist to verify that DentaScan's authentication system works correctly across Web and Android platforms, using the same backend and database.

## Environment Setup Verification

Before testing, verify:

- [x] `.env` file exists with correct `VITE_API_URL`
- [x] Windows Firewall allows port 3000
- [x] Server starts: `npm run dev`
- [x] Android app rebuilt: `npm run build && npx cap sync android`
- [x] Android app installed on device/emulator

## Test Suite

### PHASE 1: Backend Server Verification

**Purpose:** Verify the Node/Express server is running and accessible.

#### Test 1.1: Server Startup
```bash
npm run dev
```

**Expected Output:**
```
[SERVER STARTED] DentaScan Backend
============================================================
Local:  http://localhost:3000
LAN:    http://192.168.1.100:3000
Android: http://192.168.1.100:3000 (from mobile device)
Environment: development
Debug Mode: ON
============================================================
```

**Status:** ✓ Pass / ✗ Fail

#### Test 1.2: Server Listens on All Interfaces
```bash
netstat -an | findstr :3000  # Windows
netstat -tuln | grep 3000    # macOS/Linux
```

**Expected:** Connection from 0.0.0.0:3000 or :::3000

**Status:** ✓ Pass / ✗ Fail

#### Test 1.3: Health Check Endpoint
```powershell
# Windows PowerShell
$response = Invoke-WebRequest -Uri "http://localhost:3000" -ErrorAction SilentlyContinue
$response.StatusCode  # Should be 200
```

**Expected:** HTTP 200 OK, HTML page with DentaScan login form

**Status:** ✓ Pass / ✗ Fail

---

### PHASE 2: Web Platform Testing

**Purpose:** Verify authentication works on web browser (baseline).

#### Test 2.1: Web Registration with New Email

**Steps:**
1. Open `http://localhost:3000` in browser
2. Click "Create Account"
3. Fill form:
   - Name: `Web Test User`
   - Email: `web.test.1@example.com`
   - Password: `WebTest123!@#`
   - Confirm: `WebTest123!@#`
   - Accept terms
4. Click "Create Account"

**Expected Results:**
- [x] Redirected to dashboard
- [x] Success toast: "Account created successfully"
- [x] Server log shows: `[REGISTER SUCCESS] User: web.test.1@example.com (ID: X) | Platform: Web`
- [x] No errors in browser console

**Status:** ✓ Pass / ✗ Fail

#### Test 2.2: Web Registration - Duplicate Email

**Steps:**
1. Try to register same email again: `web.test.1@example.com`

**Expected Results:**
- [x] Error toast: "An account with this email address already exists"
- [x] Server log shows: `[REGISTER] Account already exists: web.test.1@example.com`
- [x] Stays on registration page

**Status:** ✓ Pass / ✗ Fail

#### Test 2.3: Web Login with Valid Credentials

**Steps:**
1. Log out (Settings menu)
2. Go to login page
3. Enter credentials:
   - Email: `web.test.1@example.com`
   - Password: `WebTest123!@#`
4. Click "Sign In"

**Expected Results:**
- [x] Redirected to dashboard
- [x] Success toast: "Signed in successfully"
- [x] Server log shows: `[LOGIN SUCCESS] User: web.test.1@example.com (ID: X) | Platform: Web`
- [x] User name appears in Settings

**Status:** ✓ Pass / ✗ Fail

#### Test 2.4: Web Login with Invalid Password

**Steps:**
1. Log out
2. Enter valid email but wrong password: `WrongPassword123`
3. Click "Sign In"

**Expected Results:**
- [x] Error toast: "Invalid email or password"
- [x] Server log shows: `[LOGIN FAILED] Invalid password for: web.test.1@example.com`
- [x] Stays on login page

**Status:** ✓ Pass / ✗ Fail

#### Test 2.5: Web Login with Non-Existent Email

**Steps:**
1. Log out
2. Enter non-existent email: `nonexistent@example.com`
3. Click "Sign In"

**Expected Results:**
- [x] Error toast: "Invalid email or password"
- [x] Server log shows: `[LOGIN FAILED] User not found: nonexistent@example.com`
- [x] Stays on login page

**Status:** ✓ Pass / ✗ Fail

---

### PHASE 3: Android Platform Testing

**Purpose:** Verify authentication works on Android using the same backend.

#### Test 3.1: Android Registration with New Email

**Steps:**
1. Open DentaScan app on Android device
2. Click "Create Account"
3. Fill form:
   - Name: `Android Test User`
   - Email: `android.test.1@example.com`
   - Password: `AndroidTest123!@#`
   - Confirm: `AndroidTest123!@#`
   - Accept terms
4. Click "Create Account"

**Expected Results:**
- [x] Redirected to dashboard
- [x] Success toast: "Account created successfully"
- [x] Server log shows: `[ENDPOINT HIT] POST /api/auth/register from 192.168.x.x`
- [x] Server log shows: `[REGISTER] Platform: Android | ...`
- [x] Server log shows: `[REGISTER SUCCESS] User: android.test.1@example.com | Platform: Android`
- [x] Console shows: `[AUTH-REGISTER] Starting registration ...`

**Status:** ✓ Pass / ✗ Fail

**If Failed - Debugging:**
```bash
# Check server logs
npm run dev  # Terminal window

# Check Android logs
adb logcat | grep -i "AUTH\|register"

# Check network connectivity
adb shell ping 10.200.50.172
```

#### Test 3.2: Android Login with Valid Credentials

**Steps:**
1. Log out (Settings menu)
2. Go to login page
3. Enter credentials:
   - Email: `android.test.1@example.com`
   - Password: `AndroidTest123!@#`
4. Click "Sign In"

**Expected Results:**
- [x] Redirected to dashboard
- [x] Success toast: "Signed in successfully"
- [x] Server log shows: `[ENDPOINT HIT] POST /api/auth/login from 192.168.x.x`
- [x] Server log shows: `[LOGIN SUCCESS] User: android.test.1@example.com | Platform: Android`
- [x] User name appears in Settings

**Status:** ✓ Pass / ✗ Fail

#### Test 3.3: Android Login with Invalid Password

**Steps:**
1. Log out
2. Enter valid email but wrong password: `WrongPassword123`
3. Click "Sign In"

**Expected Results:**
- [x] Error toast: "Invalid email or password"
- [x] Server log shows: `[LOGIN FAILED] Invalid password for: android.test.1@example.com`
- [x] Stays on login page
- [x] No crash

**Status:** ✓ Pass / ✗ Fail

---

### PHASE 4: Cross-Platform Testing

**Purpose:** Verify accounts created on one platform can login on another.

#### Test 4.1: Android Account → Web Login

**Steps:**
1. From Android: Register new email `cross.platform.1@example.com`
2. From Web browser (same computer):
   - Go to `http://localhost:3000/login`
   - Enter same credentials
   - Click "Sign In"

**Expected Results:**
- [x] Web login succeeds
- [x] Same user data displayed (name, email)
- [x] Server shows successful login from both platforms

**Status:** ✓ Pass / ✗ Fail

#### Test 4.2: Web Account → Android Login

**Steps:**
1. From Web: Register new email `web.to.android@example.com`
2. From Android app:
   - Go to login
   - Enter same credentials
   - Click "Sign In"

**Expected Results:**
- [x] Android login succeeds
- [x] Same user data displayed (name, email)
- [x] Server shows successful login from both platforms

**Status:** ✓ Pass / ✗ Fail

---

### PHASE 5: Database Verification

**Purpose:** Verify all accounts are stored in Neon PostgreSQL.

#### Test 5.1: All Users in Database

**Steps:**
1. Connect to Neon PostgreSQL:
   ```bash
   psql "your-database-url"
   ```
2. List users:
   ```sql
   SELECT id, full_name, email, created_at FROM users ORDER BY created_at DESC;
   ```

**Expected Results:**
- [x] All registered users appear
- [x] Timestamps show recent registrations
- [x] Email addresses match registrations
- [x] IDs are sequential integers

**Example Output:**
```
 id |  full_name   |        email         |         created_at
----+--------------+----------------------+----------------------------
  5 | Android Test | android.test.1@...   | 2026-08-10 10:15:30.123456
  4 | Web Test     | web.test.1@...       | 2026-08-10 10:12:45.654321
  3 | Cross User   | cross.platform.1@... | 2026-08-10 10:18:20.456789
```

**Status:** ✓ Pass / ✗ Fail

#### Test 5.2: Password Hashes Are Stored (Not Plain Text)

**Steps:**
1. In same psql session:
   ```sql
   SELECT email, password_hash FROM users LIMIT 1;
   ```

**Expected Results:**
- [x] password_hash is long random string (bcrypt hash)
- [x] NOT plain text password
- [x] Starts with `$2b$10$` or similar

**Example:**
```
        email         |                           password_hash
----------------------+------------------------------------------------------------------
web.test.1@example.com | $2b$10$n9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86.qhm5.ja
```

**Status:** ✓ Pass / ✗ Fail

---

### PHASE 6: Error Handling

**Purpose:** Verify error messages are clear and informative.

#### Test 6.1: Invalid Email Format

**Steps:**
1. Try to register with email: `invalidemail`
2. Click "Create Account"

**Expected Results:**
- [x] Form validation error: "Please enter a valid email address"
- [x] Submit button disabled
- [x] No API call made

**Status:** ✓ Pass / ✗ Fail

#### Test 6.2: Weak Password

**Steps:**
1. Try to register with password: `short`
2. Check password criteria box

**Expected Results:**
- [x] Password criteria shows missing requirements
- [x] Submit button disabled
- [x] Shows specific missing criteria

**Status:** ✓ Pass / ✗ Fail

#### Test 6.3: Missing Required Fields

**Steps:**
1. Try to submit form with empty fields

**Expected Results:**
- [x] Validation errors displayed
- [x] Submit button disabled
- [x] No API call made

**Status:** ✓ Pass / ✗ Fail

---

### PHASE 7: Network Error Handling

**Purpose:** Verify proper error messages when network is unavailable.

#### Test 7.1: Server Down

**Steps:**
1. Stop server: `npm run dev` → Ctrl+C
2. Try to login on Android or Web
3. Click "Sign In"

**Expected Results:**
- [x] Error message: "Unable to connect to the authentication server"
- [x] After short timeout (not hanging indefinitely)
- [x] Stays on login page
- [x] No crashes

**Status:** ✓ Pass / ✗ Fail

#### Test 7.2: Server Recovery

**Steps:**
1. Start server again: `npm run dev`
2. Try login immediately

**Expected Results:**
- [x] Retry works
- [x] Successful login
- [x] No special retry needed (user just tries again)

**Status:** ✓ Pass / ✗ Fail

---

### PHASE 8: Debug Logging Verification

**Purpose:** Verify detailed logging is available for troubleshooting.

#### Test 8.1: Server Debug Logs

**Steps:**
1. Perform a registration from any platform
2. Check terminal running `npm run dev`

**Expected Server Logs:**
```
[ENDPOINT HIT] POST /api/auth/register from 192.168.x.x
[REQUEST] Full URL: http://... | Content-Type: application/json
[REGISTER] Platform: [Web|Android] | IP: 192.168.x.x | Email: ...
[REGISTER SUCCESS] User: ... (ID: X) | Platform: [Web|Android]
```

**Status:** ✓ Pass / ✗ Fail

#### Test 8.2: Frontend Debug Logs (Web Browser)

**Steps:**
1. Open browser DevTools: F12
2. Go to Console tab
3. Perform a login
4. Check console output

**Expected Logs:**
```
[AUTH-LOGIN] Starting login ...
[AUTH-LOGIN] Response received ...
[AUTH-LOGIN] Response JSON parsed successfully ...
```

**Status:** ✓ Pass / ✗ Fail

#### Test 8.3: Frontend Debug Logs (Android)

**Steps:**
1. Run: `adb logcat -c` (clear logs)
2. Perform registration on Android app
3. Run: `adb logcat | grep AUTH`

**Expected Logs:**
```
[AUTH-REGISTER] Starting registration ...
[AUTH-REGISTER] Response received ...
```

**Status:** ✓ Pass / ✗ Fail

---

## Summary Report

### Completed Tests

- Phase 1 (Backend): ✓ / ✗
- Phase 2 (Web): ✓ / ✗
- Phase 3 (Android): ✓ / ✗
- Phase 4 (Cross-Platform): ✓ / ✗
- Phase 5 (Database): ✓ / ✗
- Phase 6 (Error Handling): ✓ / ✗
- Phase 7 (Network Errors): ✓ / ✗
- Phase 8 (Debug Logging): ✓ / ✗

### Issues Found

| Issue | Platform | Severity | Status |
|-------|----------|----------|--------|
| | | | |

### Next Steps

- [ ] All tests pass
- [ ] Document any platform-specific issues
- [ ] Review and update NETWORK_SETUP.md if needed
- [ ] Prepare for production deployment
- [ ] See DEPLOYMENT.md for production checklist

### Approval

- Tested by: ___________________
- Date: ___________________
- Approved by: ___________________
