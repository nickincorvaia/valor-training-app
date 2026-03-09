# Valor Training — Android Installation Guide

## Overview

Valor Training is a premium fitness app that generates personalized workouts based on your location, goals, fitness level, and available time. The app is built as a web app wrapped in a native Android shell using **Capacitor**.

---

## What You Need

| Requirement | Details |
|------------|---------|
| **Windows PC** | You're already on one ✓ |
| **Android Studio** | Free download (includes the Android SDK) |
| **Node.js 18+** | Already installed ✓ |
| **USB cable** | To connect your Android phone |
| **Android phone** | Running Android 6.0+ (API 23+) |

---

## Step 1 — Install Android Studio

1. Go to **https://developer.android.com/studio**
2. Download and install Android Studio
3. During setup, make sure these are checked:
   - ✅ Android SDK
   - ✅ Android SDK Platform-Tools
   - ✅ Android SDK Build-Tools
4. After installing, open Android Studio → click **More Actions** → **SDK Manager**
5. Under **SDK Platforms**, check **Android 14.0 (API 34)** and click Apply/OK
6. Under **SDK Tools**, make sure **Android SDK Build-Tools** and **Android SDK Command-line Tools** are checked

---

## Step 2 — Set Up Environment Variables

### Option A: Quick (PowerShell)

Open PowerShell as Administrator and run:

```powershell
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")
$path = [System.Environment]::GetEnvironmentVariable("Path", "User")
[System.Environment]::SetEnvironmentVariable("Path", "$path;$env:LOCALAPPDATA\Android\Sdk\platform-tools", "User")
```

Then close and reopen your terminal.

### Option B: Manual

1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Go to **Advanced** tab → **Environment Variables**
3. Under **User variables**, click **New**:
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\nicki\AppData\Local\Android\Sdk`
4. Edit the **Path** variable, add a new entry:
   - `%LOCALAPPDATA%\Android\Sdk\platform-tools`
5. Click OK on everything

---

## Step 3 — Build the App

> ⚠️ **IMPORTANT: All commands must be run from the `app/` subfolder!**
> The `package.json` lives inside `app/`, NOT in the project root.
> If you get "Could not read package.json" errors, you're in the wrong folder.

Open a terminal and run:

```powershell
# FIRST: Navigate to the app folder (this is where package.json is!)
cd "c:\Users\nicki\Vibe Projects\workout App for android\app"

# 1. Install dependencies (only needed first time)
npm install

# 2. Build the production web app
npm run build

# 3. Sync the built app to the Android project
npx cap sync android
```

---

## Step 4 — Open in Android Studio

```powershell
npx cap open android
```

This opens Android Studio with the Valor Training project. **Wait for Gradle to finish syncing** — you'll see a progress bar at the bottom. This can take a few minutes the first time.

---

## Step 5 — Build the APK

### From Android Studio:

1. Wait for Gradle sync to complete (bottom progress bar)
2. Go to **Build** menu → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for the build to finish
4. A notification will appear — click **locate** to find the APK file
5. The APK file is saved at:
   ```
   app\android\app\build\outputs\apk\debug\app-debug.apk
   ```

### From Command Line (alternative):

```powershell
cd "c:\Users\nicki\Vibe Projects\workout App for android\app\android"
.\gradlew.bat assembleDebug
```

---

## Step 6 — Install on Your Android Phone

### Method 1: USB Cable (Recommended)

1. **Enable Developer Mode** on your phone:
   - Go to **Settings** → **About Phone**
   - Tap **Build Number** 7 times quickly
   - You'll see "You are now a developer!"

2. **Enable USB Debugging**:
   - Go to **Settings** → **Developer Options**
   - Turn on **USB Debugging**

3. **Connect your phone** via USB cable

4. **Allow the connection** — a popup will appear on your phone asking to allow USB debugging from this computer. Tap **Allow**

5. **Install the app**:
   ```powershell
   cd "c:\Users\nicki\Vibe Projects\workout App for android\app"
   npx cap run android
   ```
   Or from Android Studio, click the green **Run** button (▶) with your phone selected as the device.

### Method 2: Transfer the APK File

1. Build the APK (Step 5)
2. Find the file at: `app\android\app\build\outputs\apk\debug\app-debug.apk`
3. Send it to your phone via:
   - Google Drive
   - Email to yourself
   - USB file transfer
   - Bluetooth
4. On your phone, open the APK file
5. If prompted, go to **Settings** → **Install unknown apps** and allow your file manager / browser
6. Tap **Install**
7. Open Valor Training from your app drawer! 🎉

---

## Updating the App

Whenever you make changes to the app code:

```powershell
cd "c:\Users\nicki\Vibe Projects\workout App for android\app"

# Rebuild
npm run build

# Sync to Android
npx cap sync android

# Reinstall on phone
npx cap run android
```

---

## Building a Release APK (For Sharing)

A debug APK works fine for your own phone. If you want to share it with others or publish to the Play Store, you'll need a signed release build:

### 1. Generate a Signing Key (one time only)

```powershell
cd "c:\Users\nicki\Vibe Projects\workout App for android\app"
keytool -genkeypair -v -keystore valor-release.keystore -alias valor -keyalg RSA -keysize 2048 -validity 10000
```

You'll be prompted for a password — **remember this password!**

### 2. Configure Signing

Edit `app\android\app\build.gradle`. Find the `android { }` block and add:

```gradle
android {
    // ... existing config ...

    signingConfigs {
        release {
            storeFile file('../../valor-release.keystore')
            storePassword 'YOUR_PASSWORD_HERE'
            keyAlias 'valor'
            keyPassword 'YOUR_PASSWORD_HERE'
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Build the Release APK

```powershell
cd "c:\Users\nicki\Vibe Projects\workout App for android\app\android"
.\gradlew.bat assembleRelease
```

The signed APK will be at:
```
app\android\app\build\outputs\apk\release\app-release.apk
```

---

## Troubleshooting

### "SDK location not found"
→ Make sure `ANDROID_HOME` is set (Step 2). Close and reopen your terminal after setting it.

### "No connected devices found"
→ Make sure USB Debugging is enabled and you tapped "Allow" on the phone popup.

### Gradle build fails
→ Open the project in Android Studio first and let it download all dependencies. This fixes most issues.

### "Install failed: INSTALL_PARSE_FAILED_NO_CERTIFICATES"
→ You're trying to install a release build without signing. Either use the debug build or follow the Release APK steps above.

### The app crashes on open
→ Run `npx cap sync android` again to make sure the latest web build is copied over.

---

## Project Structure

```
workout App for android/
├── instructions.md              ← This file
├── Valor Training logo.png      ← App logo
├── agents.md                    ← Workout logic spec
├── app/
│   ├── capacitor.config.json    ← Capacitor config (app ID, name)
│   ├── package.json             ← Dependencies
│   ├── index.html               ← Entry HTML
│   ├── dist/                    ← Built web app (created by npm run build)
│   ├── android/                 ← Native Android project
│   │   ├── gradlew.bat          ← Android build script
│   │   └── app/
│   │       ├── build.gradle     ← Android build config
│   │       └── src/main/
│   │           ├── AndroidManifest.xml
│   │           └── assets/public/  ← Web assets (synced from dist)
│   ├── public/
│   │   ├── logo.png             ← Valor Training logo
│   │   ├── hero-banner.png      ← Library page banner
│   │   ├── fitness-icons.png    ← Settings page icons
│   │   └── timer-bg.png         ← Rest timer background
│   └── src/
│       ├── App.jsx              ← Root router (4 tabs)
│       ├── index.css            ← Complete design system
│       ├── main.jsx             ← Entry point
│       ├── components/
│       │   ├── WorkoutBuilder.jsx   ← 5-step workout builder
│       │   ├── WorkoutCard.jsx      ← Workout display with checkboxes
│       │   ├── RestTimer.jsx        ← Countdown rest timer
│       │   ├── History.jsx          ← Past workouts
│       │   ├── ExerciseBrowser.jsx  ← Exercise library (60 exercises)
│       │   ├── Settings.jsx         ← User preferences
│       │   └── BottomNav.jsx        ← Tab navigation
│       ├── data/
│       │   └── exercises.js         ← Exercise database
│       └── engine/
│           └── workoutEngine.js     ← Workout generation logic
```

---

## Quick Command Reference

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start local dev server (http://localhost:5173) |
| `npm run build` | Build production web bundle |
| `npx cap sync android` | Copy web build into Android project |
| `npx cap open android` | Open project in Android Studio |
| `npx cap run android` | Build + install on connected phone |

---

*Built with ❤️ by Valor Training*
