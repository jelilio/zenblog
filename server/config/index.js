require('dotenv').config();

const path = require('path');

module.exports = {
  development: {
    sitename: 'ZenBlog [Devlopment]',
    data: {
      avatars: path.join(__dirname, '../data/avatars'),
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
    database: {
      dsn: process.env.PRODUCTION_DB_DSN,
    },
  },
};
