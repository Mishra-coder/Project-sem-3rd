# Word to PDF Converter

A React Native mobile application built with Expo that converts various file types to PDF format.

## Objective

Aims to provide a user-friendly, efficient mobile app that enables seamless file conversion to PDF, supporting multiple file types and formats, with robust backend processing and database logging for tracking conversions.

## Features

- Upload .doc, .docx, .pdf, .jpg, .jpeg, .png, and .mp4 files
- Select images from gallery or capture with camera
- One-click conversion to PDF
- Batch file conversion support
- Cross-platform support (iOS and Android)
- Backend API for secure file processing
- Database logging of conversion history

## Technologies Used

- **React Native**: For building the cross-platform mobile application.
- **Expo**: For development and deployment of the React Native app.
- **Node.js**: For the backend server.
- **Express.js**: For building the REST API.
- **Prisma ORM**: For database management and queries.
- **PostgreSQL (Supabase)**: For storing conversion logs and metadata.
- **Mammoth**: For extracting text from Word documents.
- **PDFKit**: For generating PDF files.
- **Multer**: For handling file uploads.
- **expo-document-picker**: For selecting documents from the device.
- **expo-file-system**: For file system operations.
- **expo-print**: For PDF generation and printing.
- **expo-image-picker**: For selecting images from gallery or camera.
- **expo-sharing**: For sharing converted PDFs.
- **expo-media-library**: For accessing media files.
- **expo-video-thumbnails**: For generating video thumbnails.
