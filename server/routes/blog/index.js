const express = require('express');
const moment = require('moment');

const router = express.Router();

module.exports = (params) => {
  const { postService } = params;

  router.get('/', async (request, response) => {
    const posts = await postService.findAll();
    response.render('layout', {
      pageTitle: `Blog`,
      template: 'blog/posts',
      posts,
      moment,
    });
  });

  router.get('/:name', async (request, response) => {
    const { name } = request.params;
    const posts = await postService.findAllByCategory(name);
    response.render('layout', {
      pageTitle: `Category - ${name}`,
      template: 'blog/category',
      name,
      posts,
      moment,
    });
  });

  return router;
};
