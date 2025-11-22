# Deployment Guide - Image to PDF App

## 🚀 Free Deployment Options

### Option 1: **Expo Snack** (Recommended - Easiest)

**Pros:**
- ✅ Completely FREE
- ✅ Instant shareable link
- ✅ QR code for mobile testing
- ✅ No signup required
- ✅ Perfect for GitHub demos

**Steps:**
1. Go to https://snack.expo.dev
2. Click "Import" → "Import from GitHub"
3. Enter your GitHub repo URL
4. Click "Save" → Get shareable link
5. Add link to README.md

**Example Link Format:**
```
https://snack.expo.dev/@username/project-name
```

---

### Option 2: **GitHub + Expo Go** (Current Setup)

**Pros:**
- ✅ FREE
- ✅ Works with current code
- ✅ No changes needed

**Steps:**
1. Push code to GitHub
2. Users clone repo:
   ```bash
   git clone <your-repo-url>
   cd ImageToPdf/frontend
   npm install
   npx expo start
   ```
3. Scan QR code with Expo Go app

**Add to README:**
```markdown
## 📱 Try It Now
1. Install [Expo Go](https://expo.dev/client) on your phone
2. Clone this repo and run:
   ```bash
   npm install
   npx expo start
   ```
3. Scan the QR code
```

---

### Option 3: **EAS Update** (Professional)

**Pros:**
- ✅ FREE (with limits)
- ✅ Professional deployment
- ✅ Direct app link

**Cons:**
- ⚠️ Requires Expo account
- ⚠️ More setup

**Steps:**
1. Create Expo account (free): https://expo.dev/signup
2. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
3. Login:
   ```bash
   eas login
   ```
4. Configure project:
   ```bash
   eas update:configure
   ```
5. Publish:
   ```bash
   eas update --branch production
   ```
6. Get link from Expo dashboard

**Link Format:**
```
exp://u.expo.dev/update/<update-id>
```

---

### Option 4: **APK Build** (For Android Users)

**Pros:**
- ✅ Real APK file
- ✅ No Expo Go needed
- ✅ Can share directly

**Steps:**
1. Build APK (FREE):
   ```bash
   eas build --platform android --profile preview
   ```
2. Download APK from EAS dashboard
3. Upload to GitHub Releases
4. Share download link

---

## 🎨 Recommended for GitHub README

Add this badge to your README:

```markdown
[![Try on Expo](https://img.shields.io/badge/Try%20on-Expo%20Snack-4630EB?style=for-the-badge&logo=expo)](https://snack.expo.dev/@yourusername/image-to-pdf)

[![Download APK](https://img.shields.io/badge/Download-APK-3DDC84?style=for-the-badge&logo=android)](https://github.com/yourusername/repo/releases)
```

---

## 💡 My Recommendation

**For Quick Demo (Best for GitHub):**
→ Use **Expo Snack** 

**For Professional Deployment:**
→ Use **EAS Update** + **APK Build**

**For Simple Sharing:**
→ Just share GitHub repo with setup instructions

---

## 🔗 What to Add in GitHub README

```markdown
## 🚀 Live Demo

### Try it Now:
- **Expo Snack**: [Open in Browser](https://snack.expo.dev/@username/project)
- **Mobile**: Scan QR code with [Expo Go](https://expo.dev/client)

### Download APK:
- [Download for Android](https://github.com/username/repo/releases/latest)

### Run Locally:
```bash
git clone https://github.com/username/repo
cd ImageToPdf/frontend
npm install
npx expo start
```
```

---

## ⚡ Quick Start (Choose One)

### A) Expo Snack (5 minutes)
1. Go to https://snack.expo.dev
2. Import from GitHub
3. Share link ✅

### B) EAS Update (10 minutes)
```bash
npm install -g eas-cli
eas login
eas update:configure
eas update
```

### C) APK Build (15 minutes)
```bash
eas build --platform android --profile preview
```

---

**Choose based on your need:**
- **Demo/Showcase** → Expo Snack
- **Professional** → EAS Update
- **Direct Install** → APK Build
