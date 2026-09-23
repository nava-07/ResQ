const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      let folder = 'disaster_reports';
      let resource_type = 'image';
      
      if (file.mimetype.startsWith('video/')) {
        resource_type = 'video';
      }
      
      return {
        folder: folder,
        resource_type: resource_type,
        allowed_formats: ['jpeg', 'png', 'jpg', 'mp4', 'mov', 'avi']
      };
    },
  });
} else {
  // Ensure uploads directory exists
  if (!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
  }
  
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
  });
}

const upload = multer({ storage: storage });

module.exports = upload;
