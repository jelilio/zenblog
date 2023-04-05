const cloudinary = require('cloudinary').v2;

module.exports.setup = (config) => {
  cloudinary.config({ ...config });
  return cloudinary;
};
