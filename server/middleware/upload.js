const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary storage
console.log('Configuring Cloudinary storage...');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "AbhushanKalaKendra", // Fixed Cloudinary folder
    // allow all formats by not restricting
    resource_type: "auto", // auto detects image, video, raw files
    public_id: (req, file) =>
      `${path.basename(file.originalname, path.extname(file.originalname))}${path.extname(file.originalname)}`
  }
});

// No file filter (all file types allowed)
const upload = multer({
  storage
});

module.exports = upload;
