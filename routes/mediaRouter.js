const express = require('express');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: process.env.CLOUDINARY_FOLDER_NAME,
    public_id: () => uuidv4(),
  },
});

class WrongFileFormatError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'FILE_FORMAT_ERROR';
  }
}

const fileFilter = (_, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new WrongFileFormatError('Only PNG and JPEG images are supported'));
  }
};

const fileSizeInMegabytes = 5;
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * fileSizeInMegabytes,
  },
  fileFilter,
}).single('image');

router
  .route('/')
  .post((req, res) => {
    upload(req, res, (err) => {
      if (err && err instanceof WrongFileFormatError) {
        return res.status(422).json({ err: err.message });
      }

      if (err && err.code === 'LIMIT_FILE_SIZE') {
        return res
          .status(422)
          .json({ err: `Maximum file size is ${fileSizeInMegabytes} MB` });
      }

      if (err || !req.file) {
        return res
          .status(500)
          .json({ err: 'An error occurred while uploading quiz image' });
      }

      return res.json({ success: true, name: req.file.filename });
    });
  })
  .delete(async (req, res) => {
    const { name, deleteCachedCopies } = req.body;

    const destroyOptions = {
      invalidate: deleteCachedCopies ? true : false,
    };

    const imgDeleteRes = await cloudinary.uploader.destroy(
      name,
      destroyOptions
    );
    if (imgDeleteRes.result === 'ok') {
      return res.json({ success: true });
    } else {
      return res.status(500).json({ err: 'Failed to delete quiz image' });
    }
  });

module.exports = router;
