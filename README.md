# DentaScan – AI-Powered Dental Plaque Detection & Adherence Monitoring

![DentaScan](https://img.shields.io/badge/DentaScan-v1.0.0-brightgreen)
![React](https://img.shields.io/badge/React-19.0-blue)
![Ionic](https://img.shields.io/badge/Ionic-8.0-lightblue)
![Capacitor](https://img.shields.io/badge/Capacitor-7.0-purple)
![Android](https://img.shields.io/badge/Android-7.0+-green)

A cross-platform selfie-based AI system for detecting dental plaque and monitoring oral hygiene adherence. Works as both a responsive web application and a native Android app from a single React + TypeScript codebase.

## 🎯 Features

- **AI-Powered Plaque Detection**: Uses Vision Transformer (ViT) model for accurate classification
- **Selfie Capture**: Take or select photos directly from the app
- **Real-time Analysis**: Instant plaque level classification (Healthy, Mild, Moderate, Severe)
- **Confidence Scoring**: Get detailed accuracy percentages for each scan
- **Scan History**: Track your dental health progress over time
- **Progress Charts**: Visual representation of plaque levels and improvements
- **Daily Checklist**: Personalized oral care tasks and reminders
- **Responsive Design**: Works seamlessly on web, tablet, and mobile
- **Dark Mode**: Full support for light and dark themes
- **Authentication**: Secure login with JWT tokens and refresh capabilities
- **Cross-Platform**: One codebase for web and Android

## 🏗️ Architecture

### Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend Framework | React + TypeScript | 19.0 |
| Mobile UI | Ionic React | 8.0 |
| Cross-Platform Bridge | Capacitor | 7.0 |
| Styling | Tailwind CSS | 4.1 |
| Animation | Motion (Framer Motion) | 12.38 |
| Routing | React Router | 5.3 |
| State Management | React Context | Native |
| Charting | Chart.js + React ChartJS2 | 4.4 / 5.3 |
| Backend | Express.js + Node.js | Latest |
| Database | PostgreSQL (Neon) | Latest |
| AI Integration | Google Gemini API | 1.29 |
| Camera | Capacitor Camera | 7.0 |

### Project Structure

```
dentascan/
├── src/                           # React frontend source code
│   ├── pages/                     # Page components
│   │   ├── SplashScreenPage.tsx
│   │   ├── Onboarding.tsx
│   │   ├── SignIn.tsx
│   │   ├── SignUp.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Scan.tsx
│   │   ├── Results.tsx
│   │   ├── Report.tsx
│   │   ├── History.tsx
│   │   └── Settings.tsx
│   ├── components/                # Reusable components
│   │   ├── auth/
│   │   ├── ui/
│   │   └── ...
│   ├── context/                   # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global styles
├── server/                        # Express backend
│   ├── db.ts                      # Database initialization
│   ├── auth.ts                    # Authentication handlers
│   └── ...
├── android/                       # Android project files
│   ├── app/                       # Android app module
│   │   ├── src/main/
│   │   │   ├── java/              # Kotlin/Java source code
│   │   │   ├── res/               # Android resources
│   │   │   └── AndroidManifest.xml
│   │   ├── build.gradle           # App-level build config
│   │   └── proguard-rules.pro
│   ├── build.gradle               # Root build config
│   ├── settings.gradle
│   └── gradle.properties
├── assets/                        # Static assets
├── package.json                   # Node dependencies & scripts
├── capacitor.config.ts            # Capacitor configuration
├── vite.config.ts                 # Vite configuration
├── server.ts                      # Express server entry
└── tsconfig.json                  # TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+
- **npm** or **yarn**
- **Android Studio** (for Android development)
- **Java Development Kit (JDK)** 11+
- **Android SDK** API Level 24+

### Installation

1. **Clone and Setup**
```bash
git clone <repo-url>
cd dentascan
npm install
```

2. **Environment Configuration**
```bash
# Copy environment template
cp .env.example .env

# Update with your values:
# - DATABASE_URL (Neon PostgreSQL)
# - GEMINI_API_KEY (Google AI API)
# - FLASK_BACKEND_URL (Optional)
# - JWT_SECRET
```

3. **Build for Web & Android**
```bash
# Build the frontend
npm run build

# Sync with Capacitor
npx cap sync

# Open Android project in Android Studio
npx cap open android
```

## 🌐 Web Development

### Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:3000` with hot module reloading.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## 🤖 Android Build & Deployment

### Setup Android Environment

1. **Install Android SDK**
   - Download Android Studio from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK API Level 34 (or higher)
   - Install Android SDK Tools, Build Tools

2. **Configure Environment Variables** (Windows CMD/PowerShell):
```powershell
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
setx JAVA_HOME "C:\Program Files\Android\Android Studio\jbr"
```

3. **Update Android Studio SDK Path**
   - Edit `android/local.properties`:
   ```properties
   sdk.dir=C:\\Users\\USERNAME\\AppData\\Local\\Android\\Sdk
   ```

### Build Android APK

```bash
# Clean build
npm run android:build

# This command:
# 1. Builds the React web app
# 2. Syncs Capacitor plugins
# 3. Opens Android Studio with the android/ project
```

### Build from Android Studio

1. Open the `android/` folder in Android Studio
2. Wait for Gradle sync to complete
3. Select **Build** → **Build Bundle(s)/APK(s)** → **Build APK(s)**
4. APK will be generated in `android/app/build/outputs/apk/debug/`

### Build Signed Release APK

1. Generate keystore (one-time):
```bash
keytool -genkey -v -keystore dentascan.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias dentascan
```

2. Configure signing in `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file('path/to/dentascan.keystore')
        storePassword 'your-password'
        keyAlias 'dentascan'
        keyPassword 'your-password'
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

3. Build release APK:
```bash
cd android
./gradlew assembleRelease
```

Release APK: `android/app/build/outputs/apk/release/app-release.apk`

### Install APK on Device

```bash
# Using ADB
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or drag-drop APK into Android Studio emulator
```

## 🔐 Authentication Flow

### Signup
```
User → React Form → POST /api/auth/register → PostgreSQL
                   ↓
              JWT Tokens Generated
                   ↓
              Stored in localStorage/Preferences
```

### Login
```
User Credentials → POST /api/auth/login → PostgreSQL
                ↓
         JWT Access Token + Refresh Token
                ↓
         Stored & Used for API Requests
```

### Token Refresh
```
Expired Token → POST /api/auth/refresh → New JWT
```

## 📱 Capacitor Plugins

The app uses these Capacitor plugins:

| Plugin | Purpose | Platforms |
|--------|---------|-----------|
| Camera | Capture or select photos | Web, Android, iOS |
| Filesystem | Read/write local files | Web, Android, iOS |
| Preferences | Persist settings | Web, Android, iOS |
| Network | Check connection status | Web, Android, iOS |
| Device | Get device information | Web, Android, iOS |
| Keyboard | Control keyboard | Web, Android, iOS |
| StatusBar | Customize status bar | Android, iOS |
| SplashScreen | Show/hide splash | Android, iOS |
| App | Handle app lifecycle | Android, iOS |
| LocalNotifications | Send notifications | Android, iOS |

## 🎨 Theming

### Color Palette

**Light Mode:**
- Primary: `#14B8A6` (Teal)
- Secondary: `#2563EB` (Blue)
- Background: `#F8FAFC` (Light Gray)
- Text: `#1E293B` (Dark Gray)

**Dark Mode:**
- Primary: `#14B8A6` (Teal)
- Secondary: `#60A5FA` (Light Blue)
- Background: `#0F172A` (Dark Blue)
- Text: `#F1F5F9` (Light Gray)

**Status Colors:**
- Healthy: `#10B981` (Green)
- Mild: `#FBBF24` (Amber)
- Moderate: `#F97316` (Orange)
- Severe: `#EF4444` (Red)

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### AI Prediction
- `POST /api/predict` - Send image for plaque detection

## 🧪 Testing

```bash
# Run tests
npm run test

# Lint code
npm run lint
```

## 📦 Build Optimization

### Frontend Optimization
- Tree-shaking and code splitting
- Minification with esbuild
- CSS purging with Tailwind
- Image optimization

### Android Optimization
- ProGuard obfuscation
- Incremental builds
- Resource shrinking
- Minification enabled in release builds

## 🛠️ Troubleshooting

### Android Build Issues

**Issue: Gradle sync fails**
```bash
# Solution: Update gradle
cd android
./gradlew clean
./gradlew build
```

**Issue: ADB not found**
```bash
# Set ANDROID_HOME environment variable to SDK path
# Verify: adb devices
```

**Issue: Camera not working**
- Ensure `CAMERA` permission is granted in `AndroidManifest.xml`
- Check app permissions in Android device settings
- Grant runtime permissions in the app

### Web Issues

**Issue: Database connection error**
- Verify `DATABASE_URL` environment variable
- Check PostgreSQL (Neon) connection
- Ensure network access

**Issue: CORS errors**
- `cors()` middleware is enabled in server.ts
- Check request origin in browser console

## 📝 Environment Variables

Create `.env` file:
```env
# Database
DATABASE_URL=postgresql://user:password@host/dbname

# JWT
JWT_SECRET=your-secret-key

# AI/ML
GEMINI_API_KEY=your-google-api-key

# Optional: Flask Backend
FLASK_BACKEND_URL=http://127.0.0.1:5000

# Node Environment
NODE_ENV=production
```

## 🚢 Deployment

### Web Deployment
- Build with `npm run build`
- Deploy `dist/` folder to hosting service
- Configure backend API endpoints

### Android Release to Play Store
1. Generate signed APK/AAB
2. Create Google Play Console account
3. Create app entry
4. Upload signed AAB file
5. Add app screenshots & description
6. Configure pricing & distribution
7. Submit for review

## 📊 Analytics & Monitoring

The app includes:
- Server-side logging of user actions
- Error tracking and reporting
- Performance monitoring
- API response time logging

## 🔄 CI/CD Pipeline

Configure GitHub Actions or similar:
```yaml
# On push to main
- Run tests
- Build web app
- Build Android APK
- Deploy to staging
```

## 📞 Support & Contribution

For issues and contributions:
1. Check existing issues
2. Provide reproduction steps
3. Include environment details
4. Submit PR with tests

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Credits

Built with:
- React & Ionic
- Capacitor
- Google Gemini API
- Neon PostgreSQL
- Tailwind CSS

---

**DentaScan** © 2026 | Healthcare AI Technology
