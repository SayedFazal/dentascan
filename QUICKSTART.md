# DentaScan Quick Start Guide

Get DentaScan running in 5 minutes!

## 🚀 Web App (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your DATABASE_URL and GEMINI_API_KEY

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

Done! The web app runs with hot reloading.

---

## 📱 Android App (5 minutes)

### First Time Setup (One Time)

```bash
# 1. Install Android Studio
# Download from: https://developer.android.com/studio

# 2. Install SDK (in Android Studio)
# File → Settings → Android SDK
# Install: API 34, Build Tools, Platform Tools

# 3. Set environment variables
# Windows:
setx ANDROID_HOME "C:\Users\USERNAME\AppData\Local\Android\Sdk"

# macOS/Linux:
export ANDROID_HOME=~/Library/Android/sdk
```

### Build & Run

```bash
# 1. Build web app (creates dist/)
npm run build

# 2. Sync with Capacitor
npx cap sync android

# 3. Open Android Studio
npx cap open android

# 4. In Android Studio:
# - Wait for Gradle sync
# - Click "Run" (Shift+F10)
# - Select emulator or device
```

---

## 📊 Project Structure

```
dentascan/
├── src/           # React app code
├── server/        # Express backend
├── android/       # Android project (auto-generated)
├── dist/          # Built web app (auto-generated)
└── capacitor.config.ts  # Config for both platforms
```

---

## 🔧 Common Commands

```bash
# Development
npm run dev          # Web dev server
npm run build        # Build for production
npm run lint         # Check for errors

# Android
npm run android:build    # Build & open Android Studio
npx cap sync android     # Sync changes to Android
npx cap open android     # Open existing Android project

# Database
# Edit DATABASE_URL in .env
```

---

## 🔑 Required Configuration

### 1. PostgreSQL Database

- Sign up at [neon.tech](https://neon.tech) (free)
- Create a project
- Copy connection string
- Paste in `.env` as `DATABASE_URL`

### 2. Google Gemini API

- Go to [console.cloud.google.com](https://console.cloud.google.com)
- Create a new project
- Enable Gemini API
- Create API key
- Paste in `.env` as `GEMINI_API_KEY`

### 3. JWT Secret

- Generate random string (32+ characters)
- Paste in `.env` as `JWT_SECRET`
- Example: `MyApp2024SecretKey@#$%12345678901`

---

## ✅ Verify Setup

```bash
# Check Node.js
node --version    # Should be v18+

# Check Android SDK
adb version       # Should work

# Test web app
npm run dev       # Open http://localhost:3000

# Test database
# Should see: "Successfully connected to Neon PostgreSQL"
```

---

## 🎯 Next Steps

1. **Customize the App**
   - Edit pages in `src/pages/`
   - Change colors in `android/app/src/main/res/values/colors.xml`
   - Update branding in `src/components/AppShell.tsx`

2. **Test Features**
   - ✓ Sign up & login
   - ✓ Camera capture (Android: native, Web: browser)
   - ✓ Image upload
   - ✓ AI predictions
   - ✓ History tracking

3. **Deploy**
   - **Web**: `npm run build` → Deploy `dist/` to Vercel/Netlify/AWS
   - **Android**: Build APK in Android Studio → Test on device → Upload to Play Store

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` |
| "Database connection error" | Check `DATABASE_URL` in `.env` |
| "Gradle sync failed" | Run `cd android && ./gradlew clean && ./gradlew build` |
| "Camera not working (Android)" | Grant permissions in device Settings |
| "API key error" | Verify `GEMINI_API_KEY` in `.env` |

---

## 📚 Full Guides

- **Detailed Android Setup**: [ANDROID_SETUP.md](./ANDROID_SETUP.md)
- **Build & Deployment**: [BUILD_INSTRUCTIONS.md](./BUILD_INSTRUCTIONS.md)
- **Full Documentation**: [README.md](./README.md)

---

## 🎉 You're Ready!

Your DentaScan app is running on:
- **Web**: http://localhost:3000
- **Android**: In your emulator or device

Happy coding! 🚀
