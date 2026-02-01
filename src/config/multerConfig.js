import multer from "multer";
import path from "path";
import crypto from "crypto"; // SECURITY: Use built-in crypto module

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    // SECURITY: Generate a cryptographically strong random hex string
    // "approved random number generator"
    crypto.randomBytes(16, (err, raw) => {
      if (err) return cb(err);
      
      // Convert random bytes to hex string + original extension
      const fileName = raw.toString('hex') + path.extname(file.originalname);
      cb(null, fileName);
    });
  },
});

// File filter (Optional but good for security)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;