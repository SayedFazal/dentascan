# DentaScan Native Features

Complete guide to all native platform capabilities available through Capacitor plugins.

## Overview

All features work on both web and native (Android/iOS) platforms. The app automatically detects the platform and uses the appropriate API.

---

## 📷 Camera

### Capture Photo with Device Camera

```typescript
import { capturePhoto } from '@/utils/capacitor';

// Take a photo
const photo = await capturePhoto();
if (photo) {
  console.log('Photo captured:', photo); // Base64 data URL
}
```

**Features:**
- ✅ Web: Browser camera access
- ✅ Android: Native camera app
- ✅ iOS: Native camera app
- Quality: 90% JPEG
- Format: Base64 data URL

### Select Photo from Gallery

```typescript
import { selectPhoto } from '@/utils/capacitor';

// Select from photo gallery
const photo = await selectPhoto();
if (photo) {
  console.log('Photo selected:', photo); // Base64 data URL
}
```

**Features:**
- ✅ Web: File input dialog
- ✅ Android: Photo picker
- ✅ iOS: Photo picker

### Usage in App

Already integrated in:
- `Scan.tsx` - Main scanning interface
- `MouthCapture.tsx` - Camera component
- Dashboard - Upload selfie

---

## 💾 File System

### Save Files

```typescript
import { saveFile } from '@/utils/capacitor';

// Save data to file
await saveFile('scan-history.json', JSON.stringify(data));
```

**Supported Directories:**
- `Directory.Documents`
- `Directory.Downloads`
- `Directory.Cache`
- `Directory.External`

### Read Files

```typescript
import { readFile } from '@/utils/capacitor';

// Read file contents
const content = await readFile('scan-history.json');
if (content) {
  const data = JSON.parse(content);
  console.log(data);
}
```

### Delete Files

```typescript
import { deleteFile } from '@/utils/capacitor';

// Delete file
await deleteFile('scan-history.json');
```

---

## 💾 Persistent Storage (Preferences)

### Save User Preferences

```typescript
import { setPreference, getPreference, removePreference } from '@/utils/capacitor';

// Save preference
await setPreference('theme', 'dark');

// Retrieve preference
const theme = await getPreference('theme');
console.log(theme); // 'dark'

// Remove preference
await removePreference('theme');
```

### Auth Token Management

Built-in helpers for auth:

```typescript
import {
  saveAuthToken,
  getAuthToken,
  saveRefreshToken,
  getRefreshToken,
  clearAuthTokens
} from '@/utils/capacitor';

// Save tokens
await saveAuthToken('eyJhbGc...');
await saveRefreshToken('eyJhbGc...');

// Get tokens
const token = await getAuthToken();
const refresh = await getRefreshToken();

// Clear on logout
await clearAuthTokens();
```

### User Preferences

```typescript
import {
  saveUserPreference,
  getUserPreference,
  removeUserPreference
} from '@/utils/capacitor';

// Save complex data
await saveUserPreference('scan-settings', {
  quality: 'high',
  autoAnalyze: true
});

// Get data (auto-parsed)
const settings = await getUserPreference('scan-settings');

// Remove
await removeUserPreference('scan-settings');
```

**Storage Locations:**
- **Web**: localStorage
- **Android**: SharedPreferences
- **iOS**: UserDefaults
- Capacity: 1MB+ per key
- Persistence: Survives app uninstall (on some platforms)

---

## 🌐 Network Status

### Check Connection

```typescript
import { checkNetworkStatus } from '@/utils/capacitor';

// Check if online
const isOnline = await checkNetworkStatus();
if (isOnline) {
  console.log('Device is connected to network');
}
```

### Listen to Network Changes

```typescript
import { onNetworkStatusChange } from '@/utils/capacitor';

// Listen to network status changes
const unsubscribe = onNetworkStatusChange((connected) => {
  if (connected) {
    console.log('Connection restored');
    // Sync pending data
  } else {
    console.log('Connection lost');
    // Disable features requiring internet
  }
});

// Cleanup
unsubscribe();
```

### Usage in App

Implement offline functionality:
- Queue API requests when offline
- Sync when online
- Show connection status indicator
- Disable features that require internet

---

## 📱 Device Information

### Get Device Info

```typescript
import { getDeviceInfo, getDeviceId } from '@/utils/capacitor';

// Get device information
const info = await getDeviceInfo();
console.log(info);
// Output:
// {
//   platform: 'android',
//   osVersion: '13.0',
//   appVersion: '1.0.0',
//   appBuild: '1',
//   model: 'Pixel 5',
//   manufacturer: 'Google'
// }

// Get unique device ID
const deviceId = await getDeviceId();
console.log('Device ID:', deviceId);
```

### Usage Examples

- Track device type in analytics
- Apply device-specific workarounds
- Require minimum OS version
- Log device info with error reports

---

## 🔔 Local Notifications

### Send Immediate Notification

```typescript
import { sendNotification } from '@/utils/capacitor';

// Send notification now
await sendNotification(
  'Scan Completed',
  'Your plaque detection scan is ready!',
  1
);
```

### Schedule Notification

```typescript
import { scheduleNotification } from '@/utils/capacitor';

// Schedule notification after 5 minutes
await scheduleNotification(
  'Daily Reminder',
  'Time for your oral care routine!',
  5,  // minutes
  2
);

// Schedule 24 hours from now
await scheduleNotification(
  'Weekly Checkup',
  'Don\'t forget your weekly scan!',
  24 * 60,  // 24 hours in minutes
  3
);
```

### Notification Examples

In DentaScan, use for:
- Oral care reminders (morning/night)
- Scan completion alerts
- Achievement notifications
- Weekly checkup reminders
- Appointment reminders

```typescript
// Setup daily brush reminder (morning)
await scheduleNotification(
  '🪥 Time to Brush',
  'Start your morning oral care routine',
  calculateMinutesUntilTime(7, 0),  // 7:00 AM
  100
);

// Setup evening reminder
await scheduleNotification(
  '🌙 Evening Care',
  'Complete your evening dental routine',
  calculateMinutesUntilTime(21, 0),  // 9:00 PM
  101
);
```

---

## ⌨️ Keyboard Control

### Show/Hide Keyboard

```typescript
import { showKeyboard, hideKeyboard } from '@/utils/capacitor';

// Show keyboard (useful for forms)
await showKeyboard();

// Hide keyboard
await hideKeyboard();
```

### Usage Scenarios

- Force keyboard open for login form
- Hide after form submission
- Control keyboard with custom buttons
- Keyboard appears/disappears automatically in web

---

## 📊 Status Bar (Android)

### Customize Status Bar

```typescript
import { setStatusBar } from '@/utils/capacitor';

// Set dark status bar (light text, dark background)
await setStatusBar(true);  // true = dark mode

// Set light status bar (dark text, light background)
await setStatusBar(false); // false = light mode
```

**Customization:**
- Text color: Light or Dark
- Background: `#020617` (dark) or `#1e293b` (slate)
- Overlays web view: No

Automatically applied based on app theme.

---

## 💫 Splash Screen

### Hide Splash Screen

```typescript
import { hideSplashScreen } from '@/utils/capacitor';

// Hide after app loads
await hideSplashScreen();
```

**Configuration:**
- Auto-hide enabled
- Fade duration: 300ms
- Shows app logo during load

### Show Splash Screen

```typescript
import { showSplashScreen } from '@/utils/capacitor';

// Show splash manually
await showSplashScreen();
```

---

## 🔄 App Lifecycle

### Handle App Events

```typescript
import {
  onAppPause,
  onAppResume,
  onAppBackButton
} from '@/utils/capacitor';

// App moved to background
const unsubscribePause = onAppPause(() => {
  console.log('App paused');
  // Pause timers, stop camera, etc.
});

// App returned to foreground
const unsubscribeResume = onAppResume(() => {
  console.log('App resumed');
  // Resume timers, refresh data, etc.
});

// Back button pressed (Android)
const unsubscribeBack = onAppBackButton(() => {
  console.log('Back button pressed');
  // Custom back button behavior
});

// Cleanup
unsubscribePause();
unsubscribeResume();
unsubscribeBack();
```

### Usage in DentaScan

In `Dashboard.tsx`:
- Pause scan timer on background
- Refresh data on resume
- Handle back button to confirm exit

In `Scan.tsx`:
- Stop camera on pause
- Release resources

---

## 🔐 Platform Detection

### Check Current Platform

```typescript
import { isPlatform } from '@ionic/react';

if (isPlatform('android')) {
  // Android-specific code
  console.log('Running on Android');
}

if (isPlatform('ios')) {
  // iOS-specific code
  console.log('Running on iOS');
}

if (isPlatform('web')) {
  // Web-specific code
  console.log('Running in browser');
}

// Check for mobile
if (isPlatform('mobile')) {
  console.log('Running on mobile device');
}

// Check for hybrid
if (isPlatform('hybrid')) {
  console.log('Running via Capacitor (native wrapper)');
}
```

### Conditional Features

```typescript
const [isNative, setIsNative] = useState(false);

useEffect(() => {
  setIsNative(isPlatform('android') || isPlatform('ios'));
}, []);

if (isNative) {
  // Use native camera
  const photo = await capturePhoto();
} else {
  // Use browser camera
  const stream = await navigator.mediaDevices.getUserMedia(...);
}
```

---

## 📋 Permission Handling

All permissions declared in `AndroidManifest.xml`:

```xml
<!-- Camera Permissions -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

<!-- Network Permissions -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Location Permissions -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<!-- Notification Permissions -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Vibration Permission -->
<uses-permission android:name="android.permission.VIBRATE" />
```

### Runtime Permissions (Android 6+)

Capacitor automatically requests permissions when needed:
- Camera: Requested when `capturePhoto()` called
- Photos: Requested when `selectPhoto()` called
- Notifications: Requested when `sendNotification()` called

No additional code needed - handled by Capacitor plugins!

---

## 🛠️ Utility Functions Summary

| Function | Purpose | Platforms |
|----------|---------|-----------|
| `capturePhoto()` | Take photo with camera | Web, Android, iOS |
| `selectPhoto()` | Pick photo from gallery | Web, Android, iOS |
| `saveFile()` | Write to file system | Web, Android, iOS |
| `readFile()` | Read file contents | Web, Android, iOS |
| `deleteFile()` | Delete file | Web, Android, iOS |
| `setPreference()` | Save persistent data | Web, Android, iOS |
| `getPreference()` | Load persistent data | Web, Android, iOS |
| `checkNetworkStatus()` | Check internet connection | Web, Android, iOS |
| `onNetworkStatusChange()` | Listen for network changes | Web, Android, iOS |
| `getDeviceInfo()` | Get device details | Web, Android, iOS |
| `sendNotification()` | Send notification now | Android, iOS |
| `scheduleNotification()` | Schedule future notification | Android, iOS |
| `showKeyboard()` | Open keyboard | Web, Android, iOS |
| `hideKeyboard()` | Close keyboard | Web, Android, iOS |
| `setStatusBar()` | Customize status bar | Android, iOS |
| `hideSplashScreen()` | Hide startup splash | Android, iOS |

---

## 🔌 Plugin References

Capacitor plugins used:

- **Camera**: Photo capture & selection
- **Filesystem**: File operations
- **Preferences**: Persistent storage
- **Network**: Connectivity status
- **Device**: Device information
- **StatusBar**: Status bar customization
- **SplashScreen**: Startup screen
- **LocalNotifications**: Push notifications
- **Keyboard**: Keyboard control
- **App**: App lifecycle events

All plugins auto-installed via `npm install`.

---

## 🎯 Best Practices

1. **Always check platform capability**
   ```typescript
   if (isPlatform('mobile')) {
     // Use mobile-optimized API
   }
   ```

2. **Handle errors gracefully**
   ```typescript
   try {
     const photo = await capturePhoto();
   } catch (error) {
     console.error('Camera error:', error);
     // Show fallback UI
   }
   ```

3. **Clean up listeners**
   ```typescript
   useEffect(() => {
     const unsubscribe = onNetworkStatusChange(...);
     return () => unsubscribe(); // Cleanup
   }, []);
   ```

4. **Test on real devices**
   - Emulator doesn't support all features
   - Some APIs vary between devices
   - Performance differs significantly

5. **Optimize storage usage**
   - Preferences: < 1MB per key
   - Files: Cleanup unused files
   - Consider disk space limitations

---

## 📚 More Information

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Ionic Framework Guide](https://ionicframework.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [iOS Developer Guide](https://developer.apple.com/documentation)

---

Last Updated: 2026-08-07
