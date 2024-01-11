import multer from "multer";

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp"); // 'uploads/' is the folder where files will be stored
  },
  filename: (req, file, cb) => {
    // Callback to specify the filename
    cb(null, Date.now() + "-" + file.originalname); // Unique filename with timestamp
  },
});

export const upload = multer({ storage: storage });
