const express = require('express');

const categoriesRoute = require('./category');
const usersRoute = require('./user');
const postsRoute = require('./post');

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
  router.use('/posts', restrictNonAdmin, postsRoute(params));

  router.get('/', (req, res) => res.redirect('/admin/posts'));

  return router;
};
