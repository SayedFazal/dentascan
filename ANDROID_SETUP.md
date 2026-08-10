# DentaScan Android Setup Guide

Complete step-by-step guide to build and run DentaScan as a native Android application.

## Prerequisites

- **Windows 10/11**, **macOS**, or **Linux**
- **Node.js v18+** - [Download](https://nodejs.org)
- **Android Studio 2023.1+** - [Download](https://developer.android.com/studio)
- **Git** - [Download](https://git-scm.com)
- **Internet connection** (for downloading SDKs and dependencies)

## Step 1: Install Android SDK & Tools

### Windows

1. **Install Android Studio**
   - Download from [developer.android.com/studio](https://developer.android.com/studio)
   - Run installer and follow prompts
   - Select "Standard" installation

2. **Install SDK Components**
   - Launch Android Studio
   - Go to **File** → **Settings** → **Appearance & Behavior** → **System Settings** → **Android SDK**
   - Select **SDK Platforms** tab
   - Check: **Android API 34** (and **Android API 24** minimum)
   - Select **SDK Tools** tab
   - Check: **Android SDK Build-Tools**, **Android Emulator**, **Android SDK Platform-Tools**
   - Click **Apply** → **OK**

3. **Configure Environment Variables**
   ```powershell
   # Open PowerShell as Administrator
   [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk", "User")
   [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jbr", "User")
   ```
   
   Or manually:
   - Right-click **This PC** → **Properties** → **Advanced system settings** → **Environment Variables**
   - Click **New** under User variables:
     - Variable name: `ANDROID_HOME`
     - Value: `C:\Users\USERNAME\AppData\Local\Android\Sdk`
   - Click **New**:
     - Variable name: `JAVA_HOME`
     - Value: `C:\Program Files\Android\Android Studio\jbr`

4. **Verify Installation**
   ```bash
   adb --version
   # Should output: Android Debug Bridge version X.X.X
   ```

### macOS

```bash
# Using Homebrew
brew install android-sdk android-platform-tools

# Set environment variables in ~/.zshrc or ~/.bash_profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Apply changes
source ~/.zshrc
```

### Linux (Ubuntu/Debian)

```bash
# Install dependencies
sudo apt-get install android-sdk android-sdk-platform-tools

# Set environment variables in ~/.bashrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Apply changes
source ~/.bashrc
```

## Step 2: Setup DentaScan Project

```bash
# 1. Clone the project
git clone <repository-url>
cd dentascan

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env with your configuration:
# - DATABASE_URL (PostgreSQL Neon)
# - GEMINI_API_KEY (Google AI)
# - JWT_SECRET (Authentication)
```

## Step 3: Configure Android Local Settings

1. **Edit `android/local.properties`**
   
   On Windows:
   ```properties
   sdk.dir=C:\\Users\\USERNAME\\AppData\\Local\\Android\\Sdk
   ```
   
   On macOS:
   ```properties
   sdk.dir=/Users/USERNAME/Library/Android/sdk
   ```
   
   On Linux:
   ```properties
   sdk.dir=/home/USERNAME/Android/Sdk
   ```

2. **Verify SDK Path**
   - Open Android Studio
   - Go to **File** → **Project Structure** → **SDK Location**
   - Confirm the path matches your installation

## Step 4: Build and Sync

```bash
# 1. Build the web app (creates dist/ folder)
npm run build

# 2. Sync Capacitor with Android
npx cap sync android

# 3. Copy web assets to Android
npx cap copy

# 4. Open Android Studio
npx cap open android
```

## Step 5: Build APK in Android Studio

### Debug APK (for testing)

1. Open the `android/` folder in Android Studio
2. Wait for Gradle sync to complete (watch bottom status bar)
3. Select **Build** → **Build Bundle(s)/APK(s)** → **Build APK(s)**
4. Wait for build to complete
5. Click **Locate** to open the APK folder
6. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (for distribution)

1. **Create a Keystore** (first time only):
   ```bash
   keytool -genkey -v -keystore dentascan.keystore \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias dentascan
   ```
   - Remember the passwords!
   - Store the keystore securely

2. **Configure Signing** in `android/app/build.gradle`:
   ```gradle
   signingConfigs {
       release {
           storeFile file('../dentascan.keystore')
           storePassword 'your-store-password'
           keyAlias 'dentascan'
           keyPassword 'your-key-password'
       }
   }
   ```

3. **Build Release APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   - APK: `app/build/outputs/apk/release/app-release.apk`

## Step 6: Install on Device/Emulator

### Install on Physical Device

1. **Enable USB Debugging**
   - Open device **Settings** → **About Phone**
   - Tap **Build Number** 7 times to unlock Developer Options
   - Go to **Settings** → **Developer Options**
   - Enable **USB Debugging**
   - Connect device via USB cable
   - Allow USB debugging when prompted on device

2. **Install APK**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

3. **Launch App**
   ```bash
   adb shell am start -n com.dentascan.app/.MainActivity
   ```

### Run on Emulator

1. **Create Virtual Device**
   - Android Studio → **AVD Manager**
   - Click **Create Virtual Device**
   - Select device (e.g., Pixel 5)
   - Select API Level 34
   - Click **Finish**

2. **Start Emulator**
   - Android Studio → **AVD Manager**
   - Click **Play** button on your device

3. **Install APK**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

## Step 7: Test the App

### First Launch
- App should show DentaScan splash screen
- Navigate to login page
- Test create account or login

### Test Camera Feature
- Go to Scan page
- Tap camera button
- Take a selfie
- Wait for AI analysis
- View results

### Test Features
- ✓ Authentication (sign up, sign in)
- ✓ Camera capture
- ✓ Image selection
- ✓ AI prediction
- ✓ Results display
- ✓ History tracking
- ✓ Progress charts
- ✓ Daily checklist

## Troubleshooting

### Gradle Build Fails

**Error: "SDK location not found"**
```bash
# Solution: Ensure android/local.properties exists with correct path
```

**Error: "Could not find tools.jar"**
```bash
# Solution: Update JAVA_HOME to Android Studio's JDK
# Windows: C:\Program Files\Android\Android Studio\jbr
```

### Emulator Issues

**Emulator won't start**
```bash
# Clear emulator cache
emulator -avd <device_name> -wipe-data
```

**ADB not detecting device**
```bash
# Restart ADB
adb kill-server
adb start-server
adb devices
```

### App Won't Launch

**"App keeps crashing"**
- Check logcat: `adb logcat | grep dentascan`
- Verify API keys in .env
- Check network connectivity

**"Camera not working"**
- Grant permission: **Settings** → **Apps** → **DentaScan** → **Permissions** → **Camera**
- Restart app

**"Database connection error"**
- Check DATABASE_URL in .env
- Verify network connectivity
- Test PostgreSQL connection

### Build Optimization

If build is slow:

1. **Disable ProGuard in debug**
   ```gradle
   debug {
       minifyEnabled false
   }
   ```

2. **Use Gradle daemon**
   ```bash
   cd android
   ./gradlew --daemon
   ```

3. **Enable parallel compilation**
   ```properties
   # android/gradle.properties
   org.gradle.parallel=true
   org.gradle.workers.max=4
   ```

## Common Commands

```bash
# View Android logs
adb logcat

# Install APK
adb install -r app-debug.apk

# Uninstall app
adb uninstall com.dentascan.app

# View installed apps
adb shell pm list packages

# Clear app data
adb shell pm clear com.dentascan.app

# Screen capture
adb shell screencap -p > screenshot.png

# Kill server and restart
adb kill-server && adb start-server
```

## Release Checklist

Before publishing to Play Store:

- [ ] Update version in `android/app/build.gradle`
- [ ] Test all features on multiple devices
- [ ] Test on Android 7.0 (API 24) minimum
- [ ] Test on Android 13+ (API 33)
- [ ] Capture high-quality screenshots
- [ ] Write compelling app description
- [ ] Create privacy policy
- [ ] Sign with release keystore
- [ ] Build release APK/AAB
- [ ] Test release build on device
- [ ] Get Play Store account
- [ ] Create app listing
- [ ] Upload AAB to Play Store
- [ ] Submit for review

## Publishing to Google Play Store

1. **Create Play Store Account**
   - Visit [play.google.com/console](https://play.google.com/console)
   - Sign in with Google account
   - Pay $25 registration fee

2. **Create App Listing**
   - Create new app
   - Fill required information
   - Add screenshots (1280×720 px)
   - Write description & privacy policy

3. **Build Release AAB**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   - AAB location: `app/build/outputs/bundle/release/app-release.aab`

4. **Upload to Play Store**
   - Go to **Releases** → **Create new release**
   - Upload AAB file
   - Add release notes
   - Review and publish

## Next Steps

- Monitor crash reports in Play Console
- Gather user feedback
- Plan updates and new features
- Keep dependencies updated

---

For more help: [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
