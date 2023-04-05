require('dotenv').config();

const path = require('path');

module.exports = {
  development: {
    sitename: 'ZenBlog [Devlopment]',
    data: {
      avatars: path.join(__dirname, '../data/avatars'),
    },
    cloudinary: {
      cloud_name: process.env.DEVELOPMENT_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.DEVELOPMENT_CLOUDINARY_API_KEY,
      api_secret: process.env.DEVELOPMENT_CLOUDINARY_API_SECRET,
    },
    database: {
      dsn: process.env.DEVELOPMENT_DB_DSN,
    },
  },
  production: {
    sitename: 'ZenBlog',
    data: {
      avatars: path.join(__dirname, '../data/avatars'),
    },
    cloudinary: {
      cloud_name: process.env.PRODUCTION_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.PRODUCTION_CLOUDINARY_API_KEY,
      api_secret: process.env.PRODUCTION_CLOUDINARY_API_SECRET,
    },
    database: {
      dsn: process.env.PRODUCTION_DB_DSN,
    },
  },
};
