# Image to PDF Converter

**Developer**: Devendra Mishra  
**Roll Number**: 2024-B-04012007

---

## 📱 About

A professional mobile application for converting images to PDF with advanced editing capabilities. Built with React Native and Expo for iOS and Android.

## ✨ Features

### Image Management
- Select multiple images from gallery
- Reorder pages with drag controls
- Batch conversion support

### Image Editing
- Rotate images (90° increments)
- Apply filters (Black & White, Document mode)
- Crop images using native editor

### PDF Customization
- Page size: A4, Letter, or Fit to Image
- Orientation: Portrait or Landscape
- Margins: None, Small, or Normal
- Custom PDF naming

### Additional Features
- 100% offline - no internet required
- Premium gradient UI
- Fast on-device conversion
- Share or save PDFs directly

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Expo Go app on your phone

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mishra-coder/Image_To_Pdf.git
   cd Image_To_Pdf/ImageToPdf/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the app**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Install [Expo Go](https://expo.dev/client) on your phone
   - Scan the QR code with Expo Go (Android) or Camera (iOS)

---

## 🛠️ Technologies

- **Framework**: React Native with Expo SDK 54
- **UI**: Custom components with Linear Gradients
- **Image Processing**: expo-image-manipulator, expo-image-picker
- **PDF Generation**: expo-print
- **File System**: expo-file-system
- **Icons**: Material Icons

---

## 📁 Project Structure

```
ImageToPdf/
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── PremiumButton.js
    │   │   ├── SettingsModal.js
    │   │   └── EditImageModal.js
    │   └── screens/
    │       └── HomeScreen.js
    ├── App.js
    ├── app.json
    └── package.json
```

---

## � Usage

1. **Select Images**: Tap "Select Images" to choose photos
2. **Edit (Optional)**: Tap edit icon to rotate, filter, or crop
3. **Reorder (Optional)**: Use arrows to arrange page order
4. **Configure**: Tap settings to adjust PDF options
5. **Name PDF**: Enter custom name in header (optional)
6. **Convert**: Tap "Convert All Files" for batch processing
7. **Share/Save**: Tap "Open" to share or save the PDF

---

## 🎨 Key Highlights

- **Premium UI**: Modern gradient design with smooth animations
- **Offline First**: All processing happens on your device
- **Privacy Focused**: No data collection or cloud uploads
- **Fast & Efficient**: Instant image to PDF conversion
- **User Friendly**: Intuitive interface with visual feedback

---

## 📝 License

This project is created for educational purposes as part of a semester project.

---

## 👨‍💻 Developer

**Devendra Mishra**  
Roll Number: 2024-B-04012007

---

Made with ❤️ using React Native & Expo
