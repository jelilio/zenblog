const express = require('express');

const aboutRoute = require('./about');
const contactRoute = require('./contact');

const router = express.Router();

module.exports = () => {
  router.get('/', (request, response) => {
    response.render('layout', { pageTitle: 'Welcome', template: 'index' });
  });

  router.use('/about', aboutRoute());
  router.use('/contact', contactRoute());

  return router;
};
