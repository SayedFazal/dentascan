# Android App Debugging - API Request Inspection

## What Changed

Enhanced logging has been added to `src/lib/authApi.ts` to show EXACTLY what happens when the Android app makes an API request:

1. ✅ Exact URL being called
2. ✅ HTTP method
3. ✅ Request headers
4. ✅ HTTP response status
5. ✅ Response headers
6. ✅ Response body (raw)
7. ✅ Network errors (with full error details)

## Step 1: Rebuild APK with Debugging

### In Android Studio:

1. Open: `C:\dentascan\android` in Android Studio
   ```bash
   npx cap open android
   ```

2. Wait for Gradle sync to complete

3. **Important:** Uninstall the old app first
   - Menu: **Build** → **Clean Project**
   - OR from device: Settings → Apps → DentaScan → Uninstall

4. Build new APK:
   - Menu: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Wait for completion

5. Install on device:
   - Menu: **Run** → **Run 'app'** (or Shift+F10)
   - Select your device/emulator
   - Wait for install and launch

## Step 2: Enable Console Debugging

### Option A: Chrome Remote Debugging (Recommended)

1. On your development PC, open Chrome:
   ```
   chrome://inspect/#devices
   ```

2. Enable **Discover USB devices** if needed

3. Your Android device should appear in the list

4. Click **inspect** under the DentaScan app

5. A Chrome DevTools window opens showing the WebView

6. Go to **Console** tab to see live logs

### Option B: Android Logcat

If Chrome remote debugging doesn't work:

1. In Android Studio:
   - Menu: **View** → **Tool Windows** → **Logcat**
   - Filter: `[AUTH`  (shows all [AUTH-*] logs)

2. Or from terminal:
   ```bash
   adb logcat | grep -i "AUTH\|LOGIN\|REGISTER\|API"
   ```

## Step 3: Test Registration on Android

1. In the DentaScan Android app:
   - Click "Create Account"
   - Enter:
     - Name: "Test Android"
     - Email: "android.test.2@example.com"
     - Password: "TestPass123!@#"
     - Confirm: "TestPass123!@#"
     - Accept terms
   - Click "Create Account"

2. **Watch the Console/Logcat**

## Step 4: Capture the Logs

You should see output like this:

```
=== REGISTER API CALL ===
URL: http://10.90.203.120:3000/api/auth/register
Method: POST
Headers: Content-Type: application/json
Body: { email, password (hidden), full_name, consent_accepted }
Email: android.test.2@example.com
Full Name: Test Android
```

Then either:

### Success Response:
```
Response Status: 201
Response Headers:
  content-type: application/json
  ...
```

### Error Response:
```
=== API ERROR RESPONSE ===
Status Code: 400 (or 401, 500, etc.)
Status Text: Bad Request
Headers: ... (all response headers)
Response Body (raw): {"error":"..."}
Parsed JSON: { ... }
```

### Network Error:
```
=== NETWORK ERROR ===
Type: TypeError (or NetworkError, etc.)
Message: (the actual error message)
Stack: (full stack trace)
```

## Step 5: Provide the Console Output

Once you have the logs, provide:

1. **Everything from the console** starting with `=== REGISTER API CALL ===`
2. **The complete error response** if there's an error
3. **Any network errors** shown

This will show us:
- ✅ What URL the app is actually trying to call
- ✅ Whether it's using 10.90.203.120 or something else
- ✅ What status code the backend returned
- ✅ What error message the backend sent
- ✅ Whether there's a network connectivity problem

## Possible Issues to Check

Based on the logs, we can diagnose:

| Log Shows | Problem |
|-----------|---------|
| `URL: /api/auth/register` (relative path) | API_BASE_URL is empty - VITE_API_URL not passed |
| `URL: http://localhost:3000/...` | Build has old IP |
| `URL: http://127.0.0.1:3000/...` | Build has localhost IP |
| `Status Code: 0` or network timeout | Can't reach backend (but browser can) |
| `Status Code: 400/401/409` | Backend responded, check error message |
| `Status Code: 500` | Backend error - check server logs |
| `Type: NetworkError` or `TypeError` | Network/CORS issue |

## Server Logs

Meanwhile, start the server in another terminal:

```bash
npm run dev
```

When you test on Android, watch the server terminal for:

```
[REGISTER] Platform: Android | IP: 10.90.x.x | Email: android.test.2@example.com
[REGISTER SUCCESS] User: android.test.2@example.com | Platform: Android
```

If you DON'T see these logs, the Android app is not reaching the backend at all.

## Checklist

Before testing:

- [ ] npm run build completed successfully
- [ ] npx cap sync android ran after build
- [ ] Old APK uninstalled from device
- [ ] New APK built in Android Studio
- [ ] New APK installed on device
- [ ] Chrome://inspect or Logcat is ready to capture logs
- [ ] Backend server running: npm run dev
- [ ] .env has VITE_API_URL=http://10.90.203.120:3000

## What NOT to change

- ❌ Do NOT change backend
- ❌ Do NOT change database
- ❌ Do NOT change authentication logic
- ❌ Do NOT disable logging after debugging

We need to see what the actual error is to fix it.

---

After testing, provide the console output and we'll identify the exact problem.
