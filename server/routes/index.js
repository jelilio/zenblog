const express = require('express');
const moment = require('moment');

const aboutRoute = require('./about');
const contactRoute = require('./contact');
const usersRoute = require('./users');
const adminRoute = require('./admin');
const blogRoute = require('./blog');
const postsRoute = require('./posts');

const router = express.Router();

module.exports = (params) => {
  const { categoryService, postService } = params;

  router.use('/', async (req, res, next) => {
    const categories = await categoryService.findAll();
    const postsTop4 = await postService.findTop(4);
    res.locals.headerCategories = categories;
    res.locals.footerPosts = postsTop4;
    return next();
  });

  router.get('/', async (request, response) => {
    const postsTop10 = await postService.findTop(10);
    const [featurePost] = postsTop10;

    const middleIndex = Math.ceil(postsTop10.length / 2);

    const firstHalfPosts = postsTop10.slice().splice(0, middleIndex);
    const secondHalfPosts = postsTop10.slice().splice(-middleIndex);

    response.render('layout', {
      pageTitle: 'Welcome',
      template: 'index',
      postsTop10,
      featurePost,
      firstHalfPosts,
      secondHalfPosts,
      moment,
    });
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

  return router;
};
