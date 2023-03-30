require('dotenv').config();

// const path = require('path');

module.exports = {
  development: {
    sitename: 'ZenBlog [Devlopment]',
    database: {
      dsn: process.env.DEVELOPMENT_DB_DSN,
    },
  },
  production: {
    sitename: 'ZenBlog',
    database: {
      dsn: process.env.PRODUCTION_DB_DSN,
    },
  },
};
