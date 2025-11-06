# Word to PDF Converter

## Project Overview

This is a React Native mobile application built with Expo that allows users to convert various file types to PDF format. The app supports selecting files from the device, gallery, or camera, and converting them to PDF with a simple interface.

## Developer Information

- **Name**: Devendra Mishra
- **Roll Number**: 2024-B-04012007

## Problem Statement

Many users face formatting issues and compatibility problems when sharing Word documents. Converting to PDF ensures consistent formatting, but existing tools are often slow, require internet, or have complicated interfaces. This project aims to provide a fast, simple, and reliable file to PDF conversion tool.

## Proposed Solution

A mobile application that allows users to upload files and convert them to PDF with a single click. The app supports offline conversion, maintains document formatting where possible, and ensures data privacy by not storing files after conversion.

## Key Features

- Upload .doc, .docx, .pdf, .jpg, .jpeg, .png, and .mp4 files from device
- Select images from gallery
- Capture photos using camera
- One-click conversion to PDF
- Batch file conversion support
- PDF preview and save functionality
- Works in both offline and online mode
- Auto-delete files after processing for privacy
- Cross-platform support (iOS and Android)

## Target Users

- Students
- Professionals
- Businesses
- Anyone who needs quick file to PDF conversion

## Expected Outcome

A functional mobile app that can convert files to PDF within seconds, preserving formatting where applicable and ensuring privacy, with a clean and user-friendly interface.

## Technologies Used

- React Native
- Expo
- expo-document-picker
- expo-file-system
- expo-print
- expo-image-picker
- expo-sharing
- expo-media-library
- expo-video-thumbnails

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Start the development server: `npm start` or `expo start`

## Usage

1. Launch the app
2. Select files using one of the options:
   - Select Word Files (for .doc, .docx, .pdf, etc.)
   - Select From Gallery (for images)
   - Take Photo (using camera)
3. Tap the "Convert" button next to each file to convert it to PDF
4. The converted PDF will be saved to your device

## File Conversion Details

- **Images (.jpg, .jpeg, .png)**: Converted directly to PDF
- **PDF files**: Copied as-is (no conversion needed)
- **Videos (.mp4)**: Thumbnail extracted and converted to PDF
- **Word documents (.doc, .docx)**: Not supported in Expo Go (would require native modules)

## Permissions

The app requests the following permissions:

- File access (for selecting files)
- Gallery access (for selecting images)
- Camera access (for taking photos)
- Storage access (for saving converted PDFs)

## Limitations

- Word document conversion is not supported in Expo Go due to limitations
- On Android 11+, direct saving to Downloads folder may not work due to scoped storage
- App uses fallback methods for saving files when direct access is restricted

## Future Enhancements

- Add support for more file formats
- Implement Word document conversion using native modules
- Add PDF editing features
- Improve UI/UX with better design
- Add cloud storage integration
