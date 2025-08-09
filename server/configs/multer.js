const multer = require("multer");

const storage = multer.memoryStorage(); // important for Cloudinary uploads

const upload = multer({ storage });

module.exports = upload;
