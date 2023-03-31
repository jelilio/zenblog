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

  router.get(
    '/profile',
    (req, res, next) => {
      if (req.user) return next();
      return res.status(403).end();
    },
    (req, res) =>
      res.render('layout', { pageTitle: 'Profile', template: 'profile', user: req.user })
  );

  router.get(
    '/admin',
    async (req, res, next) => {
      if (req.user && req.user.roles.indexOf('ADMIN') >= 0) {
        return next();
      }
      return res.status(403).end();
    },
    (req, res) => res.render('layout', { pageTitle: 'Admin', template: 'admin', user: req.user })
  );

  return router;
};
