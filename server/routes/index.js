const express = require('express');

const aboutRoute = require('./about');
const contactRoute = require('./contact');
const registerRoute = require('./register');
const loginRoute = require('./login');

const router = express.Router();

module.exports = (params) => {
  router.get('/', (request, response) => {
    response.render('layout', { pageTitle: 'Welcome', template: 'index' });
  });

  router.use('/about', aboutRoute());
  router.use('/contact', contactRoute());
  router.use('/register', registerRoute(params));
  router.use('/login', loginRoute(params));

  router.get('/logout', (req, res) => {
    req.logOut();
    return res.redirect('/');
  });

  return router;
};
