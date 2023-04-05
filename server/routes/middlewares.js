const multer = require('multer');

const storage = multer.diskStorage({
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});

const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  storage,
});

module.exports.upload = upload;

module.exports.handleAvatar = (avatarService) => async (req, res, next) => {
  if (!req.file) return next();
  if (req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpeg') {
    return next(new Error('File format is not supported'));
  }
  req.file.storedFilename = await avatarService.store(req.file);
  return next();
};

module.exports.handleFeatureImage = (avatarService) => async (req, res, next) => {
  if (!req.file) return next();
  if (req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpeg') {
    return next(new Error('File format is not supported'));
  }
  console.log('handleFeatureImage');
  console.log(req.file);
  console.log(req.files);
  req.file.storedFilename = await avatarService.storeFeatureImage(req.file);
  return next();
};
