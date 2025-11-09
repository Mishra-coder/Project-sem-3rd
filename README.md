# Word to PDF Converter Project

**Developer**: Devendra Mishra  
**Roll Number**: 2024-B-04012007

## Problem Statement

Many users face formatting issues and compatibility problems when sharing Word documents. Converting to PDF ensures consistent formatting, but existing tools are often slow, require internet, or have complicated interfaces. This project aims to provide a fast, simple, and reliable Word to PDF conversion tool.

## Solution

A mobile and web application that allows users to upload Word documents and convert them to PDF with a single click. The app supports offline conversion, maintains document formatting, and ensures data privacy by not storing files after conversion.

## Key Features

- Upload .doc and .docx files from device
- One-click conversion to PDF
- Batch file conversion support
- PDF preview before download
- Works in both offline and online mode
- Auto-delete files after processing for privacy

## Technologies Used

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express
- **Deployment**: Vercel

## Project Structure

- `WordToPdfConverterMain/`: Expo React Native app
- `backend/`: Node.js API server for Word to PDF conversion
