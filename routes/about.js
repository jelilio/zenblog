const express = require('express');

const router = express.Router();

module.exports = () => {
  router.get('/', (request, response) => {
    // response.render('pages/about', { pageTitle: 'About' });
    response.send('About page');
  });

  return router;
};
