const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Only JPG, PNG, PDF allowed"));
    } else {
      cb(null, true);
    }
  },
});

module.exports = upload;