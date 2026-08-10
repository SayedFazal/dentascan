# DentaScan Network Architecture - Development Setup

## Overview

This guide explains how to properly set up DentaScan for development with both Web and Android clients connecting to a shared backend.

**Key Architecture:**
- React/Vite frontend (web browser and Android via Capacitor)
- Node/Express backend (API server)
- Neon PostgreSQL (cloud database)
- All platforms share the same database and API

## Prerequisites

- Node.js and npm installed
- Android device or emulator on same LAN as development computer
- Port 3000 available on development computer
- `.env` file configured (see below)

## Step 1: Verify Your LAN IP Address

### Windows:
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter.
Example: `192.168.1.100` or `10.200.50.172`

### macOS/Linux:
```bash
ifconfig
```
Look for "inet" address under your active network interface.

## Step 2: Configure .env File

```env
# Must match your LAN IP - this is critical for Android!
VITE_API_URL=http://YOUR_LAN_IP:3000

# Example for user with IP 192.168.1.100:
# VITE_API_URL=http://192.168.1.100:3000

# Database (backend only - never exposed to frontend)
DATABASE_URL=postgresql://...your-neon-connection-string...

# Enable debug logging
DEBUG=true
NODE_ENV=development
```

## Step 3: Configure Windows Firewall

### Allow Port 3000:

1. Open **Windows Defender Firewall with Advanced Security**
   - Press `Win+R`, type `wf.msc`, press Enter

2. Click **Inbound Rules** (left sidebar)

3. Click **New Rule** (right sidebar)

4. Select **Port** → **Next**

5. Select **TCP**, enter port **3000** → **Next**

6. Select **Allow the connection** → **Next**

7. Check all profiles (Domain, Private, Public) → **Next**

8. Name: "DentaScan Backend" → **Finish**

### Verify Firewall Rule:
```powershell
netsh advfirewall firewall show rule name="DentaScan Backend"
```

## Step 4: Start the Development Server

```bash
npm run dev
```

Expected output:
```
============================================================
[SERVER STARTED] DentaScan Backend
============================================================
Local:  http://localhost:3000
LAN:    http://192.168.1.100:3000
Android: http://192.168.1.100:3000 (from mobile device)
Environment: development
Debug Mode: ON
============================================================
```

## Step 5: Test Backend Connectivity from Development Machine

### Test from Web Browser:

```
http://localhost:3000
```

Should show the DentaScan app. Try to register and login.

### Test Authentication Endpoint (from Command Prompt):

```powershell
$body = @{
    email = "test@example.com"
    password = "Test123!@#"
} | ConvertTo-Json

$response = Invoke-WebRequest `
  -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

$response.Content | ConvertFrom-Json
```

## Step 6: Test Backend Connectivity from Android Device

### Option A: Android Emulator

1. Open Android Studio
2. Launch an emulator
3. In terminal, run:
   ```bash
   adb shell
   ping YOUR_LAN_IP
   ```

### Option B: Physical Android Device

1. Ensure device is on **same WiFi network** as development computer
2. Open terminal/command prompt
3. Verify connectivity:
   ```bash
   ping YOUR_LAN_IP
   ```

### Test API from Android Device Browser:

1. Open browser on Android device
2. Navigate to: `http://YOUR_LAN_IP:3000`
3. Should see DentaScan login page

### Test API Health Check:

From Android browser, open:
```
http://YOUR_LAN_IP:3000/api/auth/me
```

Should receive 401 response (expected - no token):
```json
{
  "error": "Unauthorized. No token provided."
}
```

## Step 7: Build and Deploy to Android

### Clean Build (required after .env changes):

```bash
# Clean
npm run build

# Sync Capacitor configuration
npx cap sync android

# Rebuild
npm run build
npx cap sync android

# Verify the build contains correct API URL:
grep -r "10.200.50.172" android/ || echo "API URL not found!"
```

### Deploy to Emulator/Device:

```bash
# Open Android Studio
npx cap open android
```

Then in Android Studio:
- Select your device/emulator
- Click "Run" button (green play icon)

## Step 8: Test Authentication from Android App

### Test Registration:

1. Open DentaScan app on Android
2. Go to "Sign Up"
3. Fill in details and register
4. Check console logs for errors:
   ```bash
   adb logcat | grep -i "AUTH\|register"
   ```

### Check Server Logs:

In terminal running `npm run dev`, look for:
```
[REGISTER] Platform: Android | IP: 192.168.x.x | Email: test@example.com
[REGISTER SUCCESS] User: test@example.com (ID: 123) | Platform: Android
```

### Check Database:

```bash
# Connect to Neon PostgreSQL
psql "your-connection-string"

# List users
SELECT id, email, full_name, created_at FROM users;
```

## Troubleshooting

### Android App Shows "Invalid response from authentication server"

**Possible Causes:**

1. **Wrong API URL in build**
   - Check `.env` file has correct LAN IP
   - Run `npm run build && npx cap sync android`
   - Rebuild and redeploy app

2. **Server not running**
   - Start with: `npm run dev`
   - Check console output starts with `[SERVER STARTED]`

3. **Firewall blocking port 3000**
   - Run: `netsh advfirewall firewall show rule name="DentaScan Backend"`
   - If not listed, follow Step 3 above

4. **Wrong LAN IP**
   - Verify with: `ipconfig`
   - Check Android can ping it: `adb shell ping YOUR_IP`
   - Test in browser: `http://YOUR_IP:3000`

5. **Database connection error**
   - Check `.env` DATABASE_URL is valid
   - Try connecting directly: `psql "your-connection-string"`

6. **CORS issues (less likely)**
   - Server has CORS enabled for development
   - Check server log shows request reached it

### Android App Cannot Connect to Server

**Network Diagnostics:**

```bash
# From development machine
ipconfig

# From Android (via adb):
adb shell ping 10.200.50.172
adb shell curl http://10.200.50.172:3000/api/auth/me

# Check firewall
netsh advfirewall firewall show rule name="DentaScan Backend"
```

### "Database connection error" on Android

- This means Android reached the server, but server cannot reach Neon
- Check `.env` DATABASE_URL is correct
- Test: `psql "your-database-url"`

### Console Shows Real Error But Frontend Hides It

- This is expected - development logging uses `console.log`
- Open browser DevTools: F12 → Console tab
- Check mobile logs: `adb logcat`

## Verification Checklist

Before proceeding to production:

- [x] Windows Firewall allows port 3000
- [x] `.env` file exists with correct `VITE_API_URL`
- [x] Server starts and shows LAN IP
- [x] Web browser can access `http://localhost:3000`
- [x] Android device can access `http://YOUR_LAN_IP:3000`
- [x] Can register account from Web
- [x] Can register account from Android
- [x] Both accounts appear in Neon PostgreSQL
- [x] Can login to both with same account
- [x] Server logs show `[LOGIN SUCCESS]` messages
- [x] No database credentials appear in frontend/Android code

## Production Deployment

For production, you will need:

1. **Secure domain** (not IP address)
2. **SSL/TLS certificate** (HTTPS)
3. **Environment-specific .env files**
4. **Restrict CORS origins** (not `*`)
5. **Database connection pooling**
6. **Reverse proxy** (nginx/Cloudflare)
7. **API rate limiting**
8. **Request signing** (optional but recommended)

See `DEPLOYMENT.md` for details.
