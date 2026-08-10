# Building DentaScan for Android

## Important: Environment Variables

**CRITICAL:** The Android app must be rebuilt after changing `.env` because Vite bakes environment variables into the compiled bundle.

Simply reinstalling an APK that was built with old environment variables will NOT pick up new `.env` values.

## Prerequisites

- Node.js and npm installed
- Android Studio installed
- Android SDK configured
- `.env` file configured with correct `VITE_API_URL`

## Step 1: Verify .env Configuration

Before building, verify your `.env` file:

```bash
cat .env | grep VITE_API_URL
```

Should output something like:
```
VITE_API_URL=http://10.200.50.172:3000
```

## Step 2: Clean Build Vite Bundle

```bash
# Remove old dist folder
rm -r dist

# Build for web
npm run build
```

**Verify the build:** Check that `dist/` folder is created with index.html and assets.

## Step 3: Verify API URL is in Build

After building, verify the LAN IP is embedded in the bundle:

```bash
# On Windows (PowerShell):
Select-String -Path "dist\index.html" -Pattern "10.200.50.172"

# Or search entire dist folder:
Get-ChildItem -Path "dist" -Recurse -File | Select-String "10.200.50.172"

# On macOS/Linux:
grep -r "10.200.50.172" dist/
```

**Expected:** Should find your LAN IP in the bundle files.

**If NOT found:**
- Check `.env` file exists and has VITE_API_URL
- Delete `dist/` folder
- Delete `node_modules/.vite/` folder
- Run `npm run build` again

## Step 4: Sync Capacitor Configuration

```bash
# Clear old configuration
npx cap sync android

# Verify capacitor.config.json has correct appId
cat android/app/src/main/assets/capacitor.config.json
```

Expected output:
```json
{
  "appId": "com.plaquewatch.app",
  "appName": "PlaqueWatch",
  "webDir": "dist"
}
```

## Step 5: Open in Android Studio

```bash
npx cap open android
```

This opens Android Studio with the Dentascan project.

## Step 6: Build APK in Android Studio

### Option A: Debug Build (for testing)

1. In Android Studio menu: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete
3. Look for: `app-debug.apk`

### Option B: Debug via Emulator/Device

1. Connect Android device (or open emulator)
2. In Android Studio menu: **Run** → **Run 'app'** (or press Shift+F10)
3. Select device
4. Wait for app to install and launch

## Step 7: Install Manually (if needed)

```bash
# Find the APK
find . -name "*.apk" -type f

# Install to connected device
adb install -r app-debug.apk

# Or to emulator
adb install -r app-debug.apk
```

## Step 8: Test the App

Once installed on Android device:

1. Open DentaScan app
2. Go to Sign Up
3. Fill in details
4. Watch server logs in terminal running `npm run dev`

You should see:
```
[ENDPOINT HIT] POST /api/auth/register from 192.168.x.x
[REGISTER] Platform: Android | IP: 192.168.x.x | Email: ...
[REGISTER SUCCESS] User: ... | Platform: Android
```

## Rebuilding After .env Changes

**Every time you change `.env`:**

```bash
# 1. Clean build
rm -r dist
npm run build

# 2. Verify API URL is in bundle
grep -r "YOUR_IP" dist/

# 3. Sync Capacitor
npx cap sync android

# 4. Rebuild APK in Android Studio
# or:
adb uninstall com.plaquewatch.app
cd android && ./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Troubleshooting Build Issues

### "Cannot find module vite"
```bash
npm install
npm run build
```

### "Capacitor sync failed"
```bash
npx cap sync android --no-update
```

### "Module not found errors in build"
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### "APK fails to install"
```bash
# Uninstall old version first
adb uninstall com.plaquewatch.app

# Then reinstall
adb install -r app-debug.apk
```

## Verifying the Build Contains Correct API URL

### Method 1: Check dist folder
```bash
# Should find your LAN IP
grep -r "10.200.50.172" dist/
```

### Method 2: Inspect APK directly
```bash
# Extract and inspect APK
unzip app-debug.apk -d apk_extracted
find apk_extracted -name "*.json" -o -name "*.js" | xargs grep "10.200.50.172"
```

### Method 3: Runtime inspection
1. Install app
2. Open Android Chrome DevTools: `chrome://inspect/#devices`
3. Open DevTools Console for the app
4. Run: `console.log(import.meta.env.VITE_API_URL)`

## Build Output Locations

- **Web build:** `dist/`
- **Android debug APK:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **Android release AAB:** `android/app/build/outputs/bundle/release/app-release.aab`

## Next Steps

After successful build and test:

1. Verify registration works on Android
2. Check new users appear in Neon PostgreSQL
3. Verify login works with same account
4. Test login on web browser with Android-created account
5. See `NETWORK_SETUP.md` for full verification checklist
