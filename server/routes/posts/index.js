const express = require('express');
const moment = require('moment');

const router = express.Router();

module.exports = ({ postService, avatarService }) => {
  router.get('/:slug', async (req, res) => {
    const post = await postService.findOneBySlug(req.params.slug);
    res.render('layout', {
      pageTitle: `${post.title}`,
      template: 'blog/post',
      post,
      moment,
    });
  });

  router.get('/:slug/feature-image', async (req, res) => {
    const post = await postService.findOneBySlug(req.params.slug);
    res.type('png');
    return res.sendFile(avatarService.filepath(post.featureImage));
  });

  return router;
};
