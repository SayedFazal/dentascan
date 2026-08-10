# DentaScan Quick Start Guide

## Prerequisites

1. **Find your LAN IP:**
   ```powershell
   ipconfig
   # Look for "IPv4 Address" (e.g., 192.168.1.100)
   ```

2. **Update `.env`:**
   ```env
   VITE_API_URL=http://YOUR_LAN_IP:3000
   DATABASE_URL=your-neon-connection-string
   ```

3. **Allow Windows Firewall:**
   - Open Windows Defender Firewall with Advanced Security
   - Add Inbound Rule for TCP port 3000

## Start Development

### Terminal 1: Start Backend Server
```bash
npm run dev
```

**Expected Output:**
```
[SERVER STARTED] DentaScan Backend
Local:  http://localhost:3000
LAN:    http://YOUR_LAN_IP:3000
```

### Terminal 2: Build for Android (if testing mobile)
```bash
npm run build
npx cap sync android
# Then build in Android Studio: Run → Run 'app'
```

## Test Web Platform

1. Open `http://localhost:3000` in browser
2. Click "Create Account"
3. Fill in details and register
4. Check server logs show: `[REGISTER SUCCESS]`

## Test Android Platform

1. Install app on device/emulator
2. Open DentaScan app
3. Click "Create Account"
4. Fill in details and register
5. Check server logs show: `[REGISTER SUCCESS] ... Platform: Android`

## Verify Database

```bash
psql "your-connection-string"
SELECT email, created_at FROM users ORDER BY created_at DESC;
```

## Common Commands

```bash
# Start server with debug logging
npm run dev

# Build for web only
npm run build

# Sync Capacitor (after .env changes)
npx cap sync android

# Check Android logs
adb logcat | grep AUTH

# Test API from command line (Windows)
$response = Invoke-WebRequest `
  -Uri "http://localhost:3000/api/auth/me" `
  -Headers @{"Authorization"="Bearer YOUR_TOKEN"}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Android app shows "Invalid response from authentication server" | 1. Check `.env` VITE_API_URL is correct LAN IP<br>2. Run `npm run build && npx cap sync android`<br>3. Rebuild APK in Android Studio |
| Cannot reach server from Android | 1. Check firewall allows port 3000<br>2. Verify Android device on same network<br>3. Test: `adb shell ping YOUR_LAN_IP` |
| "Database connection error" | 1. Check DATABASE_URL in `.env`<br>2. Test: `psql "your-connection-string"`<br>3. Restart server: `npm run dev` |
| Server shows "Cannot find module" | Run: `npm install` |

## Debug Logging

### Server Logs (Terminal)
```
[REGISTER] Platform: Android | IP: 192.168.x.x | Email: ...
[LOGIN SUCCESS] User: ... (ID: X) | Platform: Web
[LOGIN FAILED] Invalid password for: ...
```

### Browser Console (F12)
```
[AUTH-LOGIN] Starting login ...
[AUTH-LOGIN] Response received { status: 200, contentType: 'application/json' }
```

### Android Logs
```bash
adb logcat | grep AUTH
```

## File Quick Reference

| File | Purpose |
|------|---------|
| `.env` | Configuration (LAN IP, database URL) |
| `server.ts` | Backend server, API routes |
| `src/lib/authApi.ts` | Frontend API calls |
| `NETWORK_SETUP.md` | Detailed network setup guide |
| `BUILD_ANDROID.md` | Android build instructions |
| `TESTING_PLAN.md` | Complete testing checklist |

## Architecture

```
┌─────────────────────────────────────────┐
│   Neon PostgreSQL (Cloud Database)      │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
 ┌──▼─────┐          ┌──────▼─────┐
 │  WEB   │          │  ANDROID   │
 │Browser │          │    App     │
 │:3000   │          │  LAN:3000  │
 └────┬───┘          └──────┬─────┘
      │                     │
      └──────────┬──────────┘
                 │
          ┌──────▼──────┐
          │Node/Express│
          │Server 0.0.0│
          │:3000       │
          └────────────┘
```

## Success Indicators

✓ Register from web → User appears in database
✓ Register from Android → User appears in database  
✓ Login with web account on Android → Works
✓ Login with Android account on web → Works
✓ Server logs show both `Platform: Web` and `Platform: Android`
✓ No database credentials in frontend/Android code

## Next Steps

1. Follow NETWORK_SETUP.md for detailed configuration
2. Follow BUILD_ANDROID.md to build Android APK
3. Use TESTING_PLAN.md to verify everything works
4. Read NETWORK_FIX_SUMMARY.md to understand all changes

## Key Concepts

**VITE_API_URL:** The address your app uses to reach the backend
- For web (browser): `http://localhost:3000` or your LAN IP
- For Android: Must be LAN IP (e.g., `http://192.168.1.100:3000`)
- For production: Your domain name (e.g., `https://api.dentascan.com`)

**DATABASE_URL:** Only on backend, never exposed to frontend
- Used only by Node/Express server
- Never sent to web browser or Android app

**Debug Mode:** Set DEBUG=true in .env to see detailed logs
- Server logs show platform, IP, email, timestamps
- Frontend console logs show API calls and responses
- Helps troubleshoot connectivity issues

---

**Got stuck?** Check the TROUBLESHOOTING section in NETWORK_SETUP.md or TESTING_PLAN.md
