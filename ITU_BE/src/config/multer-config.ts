import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(16, (err, buf) => {
      if (err) return cb(err, '');

      const uniqueSuffix = buf.toString('hex');
      const fileName = `${uniqueSuffix}-${file.originalname}`;
      cb(null, fileName);
    });
  }
});

export const upload = multer({ storage: storage });
