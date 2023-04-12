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
    const postsTop10 = await postService.findTop(10);

    const middleIndex = Math.ceil(postsTop10.length / 2);

    const latestPosts = postsTop10.slice().splice(0, middleIndex);
    const popularPosts = postsTop10.slice().splice(-middleIndex);

    response.render('layout', {
      pageTitle: `Category - ${name}`,
      template: 'blog/category',
      name,
      posts,
      popularPosts,
      latestPosts,
      moment,
    });
  });

  return router;
};
