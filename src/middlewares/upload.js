import multer from "multer";
import { extname, resolve } from "path";
import { existsSync, mkdirSync } from "fs";

// Gunakan path absolut untuk memastikan direktori yang benar
const uploadDir = resolve("src/public/upload/");

// Pastikan folder upload ada
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export default upload;
