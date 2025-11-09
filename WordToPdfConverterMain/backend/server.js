const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mammoth = require('mammoth');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Word to PDF Converter Backend API' });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .doc and .docx files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } 
});

app.post('/convert', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, 'uploads', path.parse(req.file.filename).name + '.pdf');

  try {
    const conversion = await prisma.conversion.create({
      data: {
        filename: req.file.originalname,
        originalSize: req.file.size,
        status: 'processing'
      }
    });

    const result = await mammoth.extractRawText({ path: inputPath });
    const text = result.value;
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);
    doc.fontSize(12).text(text, 50, 50);
    doc.end();

    writeStream.on('finish', async () => {
      try {
        const stats = fs.statSync(outputPath);
        await prisma.conversion.update({
          where: { id: conversion.id },
          data: {
            status: 'completed',
            convertedSize: stats.size,
            completedAt: new Date()
          }
        });

        res.download(outputPath, path.parse(req.file.filename).name + '.pdf', (err) => {
          if (err) {
            console.error('Download error:', err);
          }
          setTimeout(() => {
            fs.unlink(inputPath, () => {});
            fs.unlink(outputPath, () => {});
          }, 10000);
        });
      } catch (dbError) {
        console.error('Database update error:', dbError);
        res.status(500).json({ error: 'Conversion completed but database update failed' });
      }
    });

    writeStream.on('error', async (err) => {
      console.error('Write stream error:', err);

      await prisma.conversion.update({
        where: { id: conversion.id },
        data: {
          status: 'failed'
        }
      });
      res.status(500).json({ error: 'PDF creation failed' });
    });

  } catch (err) {
    console.error('Conversion error:', err);
    res.status(500).json({ error: 'Conversion failed: ' + err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/conversions', async (req, res) => {
  try {
    const conversions = await prisma.conversion.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    res.json(conversions);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Failed to fetch conversions' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
});
