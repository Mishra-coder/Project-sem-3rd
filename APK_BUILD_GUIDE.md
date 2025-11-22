# APK Build Guide - Image to PDF App

## 🎯 Goal
Create an APK file that users can directly download and install (no Expo Go needed)

## 📱 Why APK?

**Current Problem:**
- Users need to install Expo Go
- Users need to clone repo
- Users need to run npm commands
- Too many steps! ❌

**With APK:**
- Users just download APK
- Install and use
- Only 2 steps! ✅

---

## 🚀 How to Build APK (FREE)

### Step 1: Create Expo Account (One-time)
1. Go to: https://expo.dev/signup
2. Sign up with email (FREE)
3. Verify email

### Step 2: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 3: Login to EAS
```bash
cd ImageToPdf/frontend
eas login
```
Enter your Expo email and password

### Step 4: Configure Project
```bash
eas build:configure
```
- Select "Android" when asked
- It will create `eas.json` file

### Step 5: Build APK (FREE)
```bash
eas build --platform android --profile preview
```

**What happens:**
- EAS will build your app in the cloud (FREE)
- Takes 10-15 minutes
- You'll get a download link

### Step 6: Download APK
- Check your email or
- Go to: https://expo.dev/accounts/[your-username]/projects/ImageToPdf/builds
- Download the APK file

### Step 7: Upload to GitHub
1. Go to your GitHub repo
2. Click "Releases" → "Create a new release"
3. Upload the APK file
4. Publish release

---

## 📝 Update README After APK Build

Add this to your README.md:

```markdown
## 📥 Download APK

[![Download APK](https://img.shields.io/badge/Download-APK-3DDC84?style=for-the-badge&logo=android)](https://github.com/Mishra-coder/Image_To_Pdf/releases/latest)

**For Android Users:**
1. Download the APK from [Releases](https://github.com/Mishra-coder/Image_To_Pdf/releases)
2. Install on your phone
3. Start converting images to PDF!

> **Note**: You may need to enable "Install from Unknown Sources" in your phone settings.
```

---

## 🎯 Final User Experience

### Before APK:
1. Install Expo Go
2. Clone repo
3. Run npm install
4. Run expo start
5. Scan QR code

**5 steps!** 😓

### After APK:
1. Download APK
2. Install

**2 steps!** 🎉

---

## 💡 Alternative: Publish to Play Store (Optional)

If you want to publish on Google Play Store:

```bash
eas build --platform android --profile production
```

Then submit to Play Store (requires $25 one-time fee)

---

## 🔧 Troubleshooting

### Error: "Build failed"
- Check `eas.json` configuration
- Make sure all dependencies are correct
- Check build logs on Expo dashboard

### Error: "Not logged in"
```bash
eas logout
eas login
```

### APK not installing on phone
- Enable "Install from Unknown Sources"
- Make sure Android version is compatible

---

## 📊 Build Status

After running `eas build`, you can check status:

```bash
eas build:list
```

Or visit: https://expo.dev/accounts/[your-username]/projects/ImageToPdf/builds

---

## ✅ Checklist

- [ ] Create Expo account
- [ ] Install EAS CLI
- [ ] Login to EAS
- [ ] Configure project
- [ ] Build APK
- [ ] Download APK
- [ ] Test APK on phone
- [ ] Upload to GitHub Releases
- [ ] Update README with download link

---

## 🎉 Result

After completing these steps:
- ✅ Users can download APK directly
- ✅ No Expo Go needed
- ✅ No technical knowledge needed
- ✅ Professional app distribution

---

**Estimated Time:** 20-30 minutes (including build time)
**Cost:** FREE (Expo provides free builds)
