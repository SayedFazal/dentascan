# DentaScan Build & Deployment Instructions

Complete guide to build and deploy DentaScan as both a web application and Android native app.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Web Development](#web-development)
4. [Android Development](#android-development)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js v18+** - [Download](https://nodejs.org)
- **npm v9+** or **yarn v4+**
- **Git** - [Download](https://git-scm.com)
- **Text Editor** - VS Code, WebStorm, etc.

### For Android Development

- **Android Studio 2023.1+** - [Download](https://developer.android.com/studio)
- **Java Development Kit (JDK) 11+** - [Download](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- **Android SDK API Level 24+** (Minimum SDK)
- **Android SDK API Level 34** (Target SDK)
- **4GB+ RAM** (for emulator)
- **3GB+ Disk Space** (for SDK)

### Required Accounts

- **Neon PostgreSQL** - [Sign up](https://neon.tech) (free tier available)
- **Google Cloud** - [Console](https://console.cloud.google.com) (for Gemini API)

---

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd dentascan
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

```bash
# Copy template
cp .env.example .env

# Edit with your credentials
# Required variables:
#   - DATABASE_URL: PostgreSQL connection string
#   - GEMINI_API_KEY: Google AI API key
#   - JWT_SECRET: Random secret for JWT signing
```

### 4. Verify Setup

```bash
# Check Node.js version
node --version  # Should be v18+

# Check npm version
npm --version   # Should be v9+

# Check dependencies
npm list | head -20
```

---

## Web Development

### Start Development Server

```bash
npm run dev
```

The app runs on `http://localhost:3000` with hot reloading.

Features available:
- Full React app with all pages
- Hot module replacement (HMR)
- TypeScript checking
- Instant feedback

### Code Structure

```
src/
├── pages/          # Page components (Dashboard, Scan, Results, etc.)
├── components/     # Reusable UI components
├── context/        # React Context providers
├── utils/          # Helper functions & Capacitor wrappers
├── styles/         # Global styles
└── App.tsx         # Main app component
```

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder:
- Minified JavaScript
- CSS purging
- Image optimization
- Tree-shaking

### Preview Production Build

```bash
npm run preview
```

Tests production build locally before deployment.

---

## Android Development

### Complete Setup (First Time)

Follow the detailed guide in [ANDROID_SETUP.md](./ANDROID_SETUP.md)

```bash
# Quick setup:
# 1. Install Android Studio from developer.android.com
# 2. Open Android Studio and install SDK tools
# 3. Configure ANDROID_HOME environment variable
# 4. Verify: adb --version
```

### Development Workflow

#### 1. Make Code Changes

```bash
# Edit React code in src/
# All changes are reflected in both web and Android
```

#### 2. Build Web App

```bash
npm run build
```

#### 3. Sync with Capacitor

```bash
npx cap sync android
```

This:
- Copies web files to Android
- Updates Capacitor configuration
- Installs Capacitor plugins

#### 4. Open in Android Studio

```bash
npx cap open android
```

#### 5. Build and Run

In Android Studio:
- **Build** → **Make Project** (Ctrl+F9)
- **Run** → **Run 'app'** (Shift+F10)
- Select emulator or connected device

### Using Android Emulator

#### Create Virtual Device

```bash
# Android Studio → AVD Manager
# Click "Create Virtual Device"
# Select device (e.g., Pixel 5)
# Select Android 13+ (API 33+)
# Finish
```

#### Start Emulator

```bash
emulator -avd Pixel_5_API_34
```

#### Install and Run App

```bash
cd android
./gradlew installDebug
```

### Using Physical Device

#### Enable USB Debugging

1. Open device Settings
2. Navigate to About Phone
3. Tap Build Number 7 times
4. Go to Developer Options
5. Enable USB Debugging
6. Connect via USB cable

#### Install App

```bash
adb devices  # Verify device is connected
npm run android:build
```

---

## Deployment

### Web Deployment

#### 1. Build Production

```bash
npm run build
npm run lint  # Verify no errors
```

#### 2. Deploy to Hosting

Options:
- **Vercel** - `vercel deploy`
- **Netlify** - Drag & drop `dist/` folder
- **AWS S3** - `aws s3 sync dist/ s3://bucket-name`
- **Firebase** - `firebase deploy`
- **Traditional Server** - Copy `dist/` to web server

#### 3. Configure API Endpoints

Update backend URL in your hosting environment if needed.

### Android Deployment to Play Store

#### 1. Generate Release Keystore

```bash
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias dentascan
```

**Keep this file safe!** You'll need it for all future updates.

#### 2. Configure Signing

Edit `android/app/build.gradle`:

```gradle
signingConfigs {
    release {
        storeFile file('../release.keystore')
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

#### 3. Build Release Bundle

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

#### 4. Create Play Store Account

- Visit [play.google.com/console](https://play.google.com/console)
- Pay $25 one-time fee
- Agree to Google Play Developer Program Policies

#### 5. Create App Listing

1. **Create New App**
   - App name: "DentaScan"
   - Default language: English
   - App category: Health & Fitness

2. **Add App Information**
   - Description: "AI-powered dental plaque detection and monitoring"
   - Screenshots: 5-8 images (1280×720 px)
   - Privacy policy: Add link
   - Content rating: Fill form

3. **Configure Release**
   - Go to **Releases** → **Create new release**
   - Select **Testing** → **Closed Testing** (for beta)
   - Or go directly to **Production** for release

4. **Upload Bundle**
   - Drag & drop `app-release.aab`
   - Wait for Play Console to process

5. **Review & Submit**
   - Check pricing & distribution
   - Review content rating
   - Click **Submit for Review**

#### 6. Monitor Rollout

- **Staged rollout**: Start with 5% of users
- **Monitor crashes** in Play Console
- **Increase gradually**: 10% → 25% → 50% → 100%

### Building APK Alternative

If you need APK instead of AAB:

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

---

## Continuous Integration/Deployment

### GitHub Actions Example

Create `.github/workflows/build.yml`:

```yaml
name: Build & Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Test
      run: npm run test
    
    - name: Build web
      run: npm run build
    
    - name: Deploy to Vercel
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      run: vercel --prod --token $VERCEL_TOKEN
```

---

## Troubleshooting

### Installation Issues

**Error: "Cannot find module 'react'"**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error: "ENOENT: no such file or directory"**
```bash
# Ensure you're in the project root directory
pwd  # Should show: /path/to/dentascan
```

### Build Issues

**Web Build Fails**
```bash
# Clear cache and rebuild
rm -rf dist
npm run build
npm run lint  # Check for errors
```

**Android Build Fails**
```bash
cd android
./gradlew clean
./gradlew build
```

**Gradle Daemon Issues**
```bash
./gradlew --stop
./gradlew build
```

### Runtime Issues

**App crashes on startup**
```bash
# Check logs
adb logcat | grep dentascan

# Clear app data
adb shell pm clear com.dentascan.app
adb shell pm install app.apk
```

**Camera not working**
- Check permissions in `AndroidManifest.xml`
- Grant permission: Settings → Apps → DentaScan → Permissions → Camera
- Restart device

**Database connection error**
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is accessible
- Test connection: `psql $DATABASE_URL`

### Performance Issues

**Slow build times**
```bash
# Enable gradle daemon (gradle.properties)
org.gradle.parallel=true
org.gradle.workers.max=4

# Disable ProGuard in debug
minifyEnabled false
```

**Large APK size**
```bash
# Check dependencies
npm ls | grep large-package

# Remove unused: npm uninstall package-name
```

---

## Version Control

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "feat: describe your feature"

# Push to remote
git push origin feature/my-feature

# Create Pull Request on GitHub
```

### Semantic Versioning

```bash
# Update version in package.json
npm version patch    # 1.0.0 → 1.0.1
npm version minor    # 1.0.0 → 1.1.0
npm version major    # 1.0.0 → 2.0.0
```

---

## Performance Optimization

### Frontend Optimization

- Use React.memo for expensive components
- Implement lazy loading for images
- Code split large pages
- Use production build for testing

### Android Optimization

```gradle
// In build.gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### Database Optimization

- Add indexes on frequently queried columns
- Implement connection pooling
- Use prepared statements
- Monitor slow queries

---

## Security Checklist

- [ ] JWT_SECRET is strong and random (32+ chars)
- [ ] API endpoints validate all inputs
- [ ] Database credentials are not in version control
- [ ] HTTPS is enabled in production
- [ ] API rate limiting is configured
- [ ] CORS is restricted to known domains
- [ ] Sensitive data is encrypted
- [ ] Regular security updates installed

---

## Support & Resources

- **Capacitor Docs**: https://capacitorjs.com
- **React Docs**: https://react.dev
- **Ionic Docs**: https://ionicframework.com
- **Android Docs**: https://developer.android.com
- **Google Play Console**: https://play.google.com/console

---

## Frequently Asked Questions

**Q: Can I test Android without a physical device?**
A: Yes, use Android Emulator in Android Studio (requires 4GB+ RAM)

**Q: How do I update an app already on Play Store?**
A: Use the same keystore, increment versionCode, build new release bundle

**Q: Can I share my keystore?**
A: No, keep it private. Share only the app signing key certificate.

**Q: What's the minimum Android version supported?**
A: Android 7.0 (API 24)

**Q: How often should I update dependencies?**
A: Monthly for security patches, quarterly for feature updates

---

Last Updated: 2026-08-07
