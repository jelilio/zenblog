const express = require('express');

const categoriesRoute = require('./category');
const usersRoute = require('./user');

const router = express.Router();

const restrictNonAdmin = async (req, res, next) => {
  if (req.user && req.user.roles.indexOf('ADMIN') >= 0) {
    return next();
  }
  return res.status(403).end();
};

module.exports = (params) => {
  router.use('/categories', restrictNonAdmin, categoriesRoute(params));
  router.use('/users', restrictNonAdmin, usersRoute(params));

  router.get('/', (req, res) => res.redirect('/admin/posts'));

  router.get('/posts', restrictNonAdmin, (req, res) =>
    res.render('layout', {
      pageTitle: 'Admin',
      templates: ['admin/index', 'admin/temp2'],
      template: 'admin/index',
      template2: 'admin/temp2',
      user: req.user,
    })
  );

  return router;
};
