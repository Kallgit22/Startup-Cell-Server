const multer = require("multer");
const path = require("path");

// Check file type
function checkFileType(file, cb, filetypes) {
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Invalid file type!");
  }
}

const uploadImage = (path) => {
  const storage = multer.diskStorage({
    destination: __dirname + `/upload/${path}/`,
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });

  // Initialize upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb, /jpeg|jpg|png/);
    },
  }).single("image");

  return upload;
};

const uploadPDF = () => {
  const storage = multer.diskStorage({
    destination: __dirname + "/upload/pdf/",
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });

  // Initialize upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb, /pdf/);
    },
  }).single("pdf");

  return upload;
};

module.exports = { uploadImage, uploadPDF };
