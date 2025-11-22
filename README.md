# Image to PDF Converter

**Developer**: Devendra Mishra  
**Roll Number**: 2024-B-04012007

## 📱 Overview

A professional, feature-rich mobile application for converting images to PDF with advanced editing capabilities. Built with React Native and Expo, this app provides a seamless offline experience with a premium UI.

## 🚀 Live Demo

### Try it Now:
- **📱 Mobile**: Install [Expo Go](https://expo.dev/client) and scan the QR code
- **💻 Run Locally**: 
  ```bash
  git clone <your-repo-url>
  cd ImageToPdf/frontend
  npm install
  npx expo start
  ```

> **Note**: This is a React Native mobile app. For the best experience, use Expo Go on your phone or run locally.

## ✨ Key Features

### 🖼️ Image Management
- **Multi-Select**: Pick multiple images at once from your gallery
- **Drag & Reorder**: Arrange pages in any order with up/down arrows
- **Batch Processing**: Convert all images to PDF in one go

### ✏️ Image Editing
- **Rotate**: Rotate images 90 degrees
- **Filters**: Apply Black & White or Document mode for better readability
- **Crop**: Use native image editor for precise cropping

### 📄 PDF Settings
- **Page Size**: Choose between A4, Letter, or Fit to Image
- **Orientation**: Portrait or Landscape mode
- **Margins**: Customize spacing (None, Small, Normal)
- **Custom Naming**: Name your PDF files before conversion

### 🎨 Premium UI
- Beautiful gradient header with modern design
- Smooth animations and transitions
- Intuitive card-based file management
- Professional color scheme

### 🔒 Privacy & Performance
- **100% Offline**: No internet required, all processing on-device
- **No Data Collection**: Files never leave your device
- **Fast Conversion**: Instant image to PDF conversion
- **Lightweight**: Optimized for performance

## 🛠️ Technologies Used

- **Framework**: React Native with Expo SDK 54
- **UI Components**: Custom gradient buttons with `expo-linear-gradient`
- **Image Processing**: `expo-image-manipulator`, `expo-image-picker`
- **PDF Generation**: `expo-print`
- **File System**: `expo-file-system`
- **Icons**: `@expo/vector-icons` (Material Icons)

## 📁 Project Structure

```
ImageToPdf/
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── PremiumButton.js      # Reusable gradient button
    │   │   ├── SettingsModal.js      # PDF settings configuration
    │   │   └── EditImageModal.js     # Image editing interface
    │   └── screens/
    │       └── HomeScreen.js          # Main application screen
    ├── App.js
    ├── app.json
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for testing on mobile)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Project-sem-3rd/ImageToPdf/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - Scan the QR code with Expo Go (Android)
   - Scan with Camera app (iOS)

## 📦 Dependencies

```json
{
  "@expo/vector-icons": "^15.0.3",
  "expo": "~54.0.25",
  "expo-document-picker": "~14.0.7",
  "expo-file-system": "~19.0.19",
  "expo-image-manipulator": "~14.0.7",
  "expo-image-picker": "~17.0.8",
  "expo-linear-gradient": "~14.0.1",
  "expo-print": "~15.0.7",
  "expo-sharing": "~14.0.7",
  "react": "19.1.0",
  "react-native": "0.81.5"
}
```

## 🎯 Usage

1. **Select Images**: Tap "Select Images" or "Select Files" to choose images
2. **Edit (Optional)**: Tap the edit icon to rotate, filter, or crop images
3. **Reorder (Optional)**: Use up/down arrows to arrange page order
4. **Configure Settings**: Tap the settings icon to adjust PDF options
5. **Name PDF (Optional)**: Enter a custom name in the header input
6. **Convert**: Tap "Convert" for individual files or "Convert All Files" for batch
7. **Share/Save**: Tap "Open" to share or save the converted PDF

## 🎨 Features in Detail

### Image Editing Modal
- **Rotate**: Instantly rotate images by 90 degrees
- **Filter Toggle**: Cycle through Normal → B&W → Document modes
- **Crop**: Opens native image editor for precise cropping
- **Live Preview**: See changes in real-time

### Settings Modal
- **Page Size Options**: A4 (210×297mm), Letter (8.5×11in), Fit to Image
- **Orientation**: Portrait or Landscape
- **Margin Control**: Fine-tune white space around images
- **Persistent Settings**: Choices apply to all conversions

### File Management
- **Visual Thumbnails**: See image previews in the list
- **Status Indicators**: Pending, Converting, Done, Error states
- **Quick Actions**: Edit, Convert, Open, Delete buttons
- **Smart Reordering**: Disabled arrows at list boundaries

## 🔧 Development

### Code Structure
- **Modular Components**: Reusable UI components
- **Clean Code**: No comments, optimized for readability
- **Type Safety**: Proper prop validation
- **Performance**: Optimized rendering with FlatList

### Styling Approach
- **Gradient Themes**: Consistent color schemes
- **Responsive Design**: Works on all screen sizes
- **Platform-Specific**: Adapts to iOS/Android differences
- **Shadow & Elevation**: Proper depth perception

## 📝 License

This project is created for educational purposes as part of a semester project.

## 👨‍💻 Developer

**Devendra Mishra**  
Roll Number: 2024-B-04012007

---

Made with ❤️ using React Native & Expo
