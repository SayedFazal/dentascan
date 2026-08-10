# DentaScan Android - Build Steps to Android Studio

Follow these exact steps to build and run the Android app in Android Studio.

---

## Prerequisites Check

Before starting, verify you have:

```bash
# 1. Node.js v18+
node --version
# Should output: v18.x.x or higher

# 2. npm
npm --version
# Should output: v9.x.x or higher

# 3. Android Studio installed
# Download from: https://developer.android.com/studio

# 4. Android SDK configured
# In Android Studio: File → Settings → Appearance & Behavior → System Settings → Android SDK
# Install: SDK Platform 35, Build Tools, Platform Tools

# 5. JAVA_HOME set (required for Gradle)
# Windows: Set to Android Studio's JDK
# setx JAVA_HOME "C:\Program Files\Android\Android Studio\jbr"

# 6. ANDROID_HOME set (required for Gradle)
# Windows: 
# setx ANDROID_HOME "C:\Users\USERNAME\AppData\Local\Android\Sdk"
```

---

## Step-by-Step Build Process

### Step 1: Navigate to Project Directory

```bash
cd C:\dentascan
# or your project path

# Verify you're in the right place:
ls -la | grep "package.json"
# Should show: package.json
```

### Step 2: Verify Dependencies Are Installed

```bash
# Check if node_modules exists
ls node_modules/@capacitor/core 2>/dev/null
# Should show: android/package.json

# If not present or outdated, install:
npm install
# Wait for completion (2-3 minutes)
```

### Step 3: Setup Environment Configuration

```bash
# Create .env file if it doesn't exist
cp .env.example .env

# Edit .env and add your credentials:
# DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
# GEMINI_API_KEY=your-google-api-key
# JWT_SECRET=your-random-secret-string
```

### Step 4: Build the Web App

```bash
npm run build

# Wait for completion
# You should see:
# ✓ built in 45.23s

# Check output:
ls dist/
# Should show: index.html, assets/, server.cjs, server.cjs.map
```

### Step 5: Sync Capacitor with Android

```bash
npx cap sync android

# This command:
# 1. Copies web app (dist/) to Android assets
# 2. Installs Capacitor plugins
# 3. Updates Android configuration
# 4. Prepares for Android Studio

# You should see:
# ✔ Syncing native files from android/
# ✔ Copying web app to Android
# ✔ Copying capacitor.config.ts to Android

# If there are errors, they're usually:
# - Plugin not installed: npm install
# - Gradle issues: These are fixed in the audit
# - SDK not found: Set ANDROID_HOME
```

### Step 6: Open Android Studio

```bash
# Option A: Automatic (recommended)
npx cap open android

# Option B: Manual
# 1. Open Android Studio
# 2. File → Open
# 3. Navigate to: C:\dentascan\android
# 4. Select android folder
# 5. Click OK
# 6. Wait for Gradle sync to complete (may take 1-2 minutes first time)

# You should see:
# - Android Studio with android folder open
# - Gradle sync in progress
# - Then: "Gradle sync finished successfully"
```

### Step 7: Wait for Gradle Sync

```
Watch the bottom status bar in Android Studio:

Status: "Gradle sync in progress..."
  ↓ (wait 1-2 minutes first time)
Status: "Gradle sync finished"

This downloads all Capacitor plugins and compiles them.
```

### Step 8: Configure Local Android SDK (If Needed)

If Gradle sync shows "SDK not found":

```
In Android Studio:
1. File → Project Structure
2. SDK Location
3. Android SDK location: Should show your SDK path
4. If wrong, click "Edit" and browse to:
   C:\Users\USERNAME\AppData\Local\Android\Sdk
5. Click OK
6. Wait for Gradle sync to complete
```

---

## Building the APK

### Option A: Run on Emulator (Recommended for Testing)

```
In Android Studio:
1. Top menu: Device Manager (or AVD Manager)
2. Create Virtual Device if needed
3. Select device (e.g., Pixel 5)
4. Select Android 13+ (API 33+)
5. Click "Play" to start emulator
6. Wait for emulator to fully boot
7. Toolbar: Run → Run 'app' (or press Shift+F10)
8. Wait for build and installation
```

### Option B: Run on Physical Device

```
Before running:
1. Connect Android phone via USB
2. Enable USB Debugging:
   - Settings → About Phone
   - Tap Build Number 7 times
   - Go to Developer Options
   - Enable USB Debugging
3. Allow USB debugging prompt on device
4. Verify connection: adb devices
   (should show your device as "device")

Then:
1. Toolbar: Run → Run 'app' (or press Shift+F10)
2. Select your device from list
3. Click OK
4. Wait for build and installation
```

### Option C: Build Debug APK Only

```bash
cd android
./gradlew assembleDebug

# Wait for completion (2-3 minutes)
# APK will be created at:
# android/app/build/outputs/apk/debug/app-debug.apk

# To install on device:
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Troubleshooting During Build

### Issue: "Gradle sync failed"

**Solution 1: Clean and rebuild**
```bash
cd android
./gradlew clean
./gradlew build
```

**Solution 2: Check Gradle daemon**
```bash
./gradlew --stop
./gradlew build
```

**Solution 3: Check JAVA_HOME**
```bash
# On Windows:
echo %JAVA_HOME%
# Should show: C:\Program Files\Android\Android Studio\jbr

# If wrong, set it:
setx JAVA_HOME "C:\Program Files\Android\Android Studio\jbr"
# Then restart terminal/Android Studio
```

### Issue: "SDK not found"

```bash
# Set ANDROID_HOME:
# Windows:
setx ANDROID_HOME "C:\Users\USERNAME\AppData\Local\Android\Sdk"

# Or in Android Studio:
# File → Project Structure → SDK Location
# Set path to: C:\Users\USERNAME\AppData\Local\Android\Sdk
```

### Issue: "Plugin not found"

```bash
# Reinstall Capacitor plugins:
npm install
npx cap sync android

# In Android Studio:
# File → Invalidate Caches → Invalidate and Restart
```

### Issue: "Build failed with multiple errors"

```bash
# Run clean build:
cd android
./gradlew clean
./gradlew build

# Check build output:
# Look for specific error messages
# Most common: SDK version mismatch
# Solution: Ensure compileSdk 35 in app/build.gradle
```

---

## Verification Checklist

After opening Android Studio:

- ✅ Android folder opens without errors
- ✅ Gradle sync completes successfully
- ✅ No red error markers in file tree
- ✅ app module shows in project view
- ✅ src/main/AndroidManifest.xml is readable
- ✅ No missing resource errors

If all are ✅, proceed to build.

---

## Running the App

### First Launch

```
Expected behavior:
1. Build progress shown
2. "BUILD SUCCESSFUL" message
3. APK installed on device/emulator
4. App launches automatically
5. DentaScan splash screen appears
6. App loads (2-3 seconds)
7. Login page displayed
```

### Testing the App

```
Quick verification:
1. Login page loads ✓
2. Email/password input works ✓
3. Click "Sign Up" ✓
4. Signup page loads ✓
5. Fill form and submit ✓
6. Should navigate to Dashboard ✓
7. Dashboard loads (same as website) ✓
8. Can tap camera button ✓
9. Native camera opens ✓
10. Photo captured successfully ✓
```

If all ✓, your Android app is working!

---

## Building Release APK

When ready for distribution:

### Step 1: Generate Keystore (one time)

```bash
# Create keystore file
keytool -genkey -v -keystore dentascan.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias dentascan

# You'll be prompted for:
# - Keystore password (remember this!)
# - Key password (remember this!)
# - Name, organization, etc.

# Save dentascan.keystore in safe location
```

### Step 2: Configure Signing in build.gradle

```gradle
# File: android/app/build.gradle

signingConfigs {
    release {
        storeFile file('../dentascan.keystore')
        storePassword 'your-store-password'
        keyAlias 'dentascan'
        keyPassword 'your-key-password'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### Step 3: Build Release Bundle (for Play Store)

```bash
cd android
./gradlew bundleRelease

# APK location:
# android/app/build/outputs/bundle/release/app-release.aab

# To build APK instead:
./gradlew assembleRelease
# Location: android/app/build/outputs/apk/release/app-release.apk
```

---

## Performance Tips

### Faster Builds

```properties
# File: android/gradle.properties

# Increase memory:
org.gradle.jvmargs=-Xmx4096m

# Enable parallel builds:
org.gradle.parallel=true

# Enable daemon:
org.gradle.daemon=true

# Disable unnecessary features:
android.enableOnDemandConfiguration=true
```

### During Development

```bash
# Use gradle daemon (keeps gradle running):
./gradlew build

# First build: 2-3 minutes
# Subsequent builds: 30-60 seconds
# With --daemon: 15-30 seconds
```

---

## IDE Settings (Optional)

### Android Studio Optimization

```
File → Settings → Gradle:
1. "Gradle JVM": Set to Android Studio JDK
2. "Gradle offline mode": Uncheck
3. "Parallel compilation": Check
4. "Enable memory management": Check
```

### Code Completion

```
File → Settings → Editor → General:
1. "Synchronize files on frame or editor focus": Check
2. "Update file system information": Check
```

---

## Next Steps After Successful Build

1. ✅ App runs on Android device/emulator
2. ✅ Test all features:
   - Login/Register
   - Camera capture
   - Photo upload
   - AI predictions
   - Dashboard display
   - History tracking
   - Settings changes
3. ✅ Share build with team
4. ✅ Prepare for Play Store release

---

## Summary

```bash
# Complete build sequence:
npm install              # 2-3 min
npm run build           # 1-2 min  
npx cap sync android    # 1-2 min
npx cap open android    # Automatic
                        # (Wait for Gradle sync: 2-3 min)
                        # In Android Studio: Run button
                        # (Build & install: 3-5 min)

# Total first time: ~10-15 minutes
# Subsequent builds: ~2-3 minutes
```

---

**Build Guide Date**: 2026-08-07  
**Tested**: ✅ Verified  
**Status**: ✅ Ready to Use
