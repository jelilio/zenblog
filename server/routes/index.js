const express = require('express');

const aboutRoute = require('./about');
const contactRoute = require('./contact');
const usersRoute = require('./users');
const adminRoute = require('./admin');
const blogRoute = require('./blog');
const postsRoute = require('./posts');

const router = express.Router();

module.exports = (params) => {
  const { categoryService } = params;

  router.use('/', async (req, res, next) => {
    const categories = await categoryService.findAll();
    res.locals.headerCategories = categories;
    return next();
  });

  router.get('/', (request, response) => {
    response.render('layout', { pageTitle: 'Welcome', template: 'index' });
  });

  router.use('/about', aboutRoute());
  router.use('/contact', contactRoute());
  router.use('/users', usersRoute(params));
  router.use('/admin', adminRoute(params));
  router.use('/blog', blogRoute(params));
  router.use('/posts', postsRoute(params));

  router.get('/logout', (req, res) => {
    req.logOut(() => {});
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

  return router;
};
