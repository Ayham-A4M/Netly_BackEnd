const multer = require('multer');
const { put } = require('@vercel/blob');
const path = require('path');
require('dotenv');

// Multer memory storage (files will be in memory, not on disk)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

// Function to handle the actual upload to Vercel Blob
const uploadToVercelBlob = async (file) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = 'postImage-' + uniqueSuffix + path.extname(file.originalname);

  const blob = await put(filename, file.buffer, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN
  });

  return blob.url;
};

module.exports = {
  upload,
  uploadToVercelBlob
};