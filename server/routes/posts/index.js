const express = require('express');
const moment = require('moment');
const request = require('request');

const router = express.Router();

const restrictNonUser = async (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(403).end();
};

module.exports = ({ postService, avatarService, commentService }) => {
  router.get('/:slug', async (req, res) => {
    const post = await postService.findOneBySlug(req.params.slug);
    const comments = await commentService.findAllByPost(post.id);

    res.render('layout', {
      pageTitle: `${post.title}`,
      template: 'blog/post',
      post,
      moment,
      comments,
    });
  });

  router.get('/:slug/feature-image', async (req, res) => {
    const post = await postService.findOneBySlug(req.params.slug);
    const url = post.featureImage;

    request(
      {
        url,
        encoding: null,
      },
      (err, resp) => {
        if (!err && resp.statusCode === 200) {
          res.set('Content-Type', 'image/jpeg');
          res.send(resp.body);
        } else {
          res.end();
        }
      }
    );
  });

  router.post('/:slug/comment', restrictNonUser, async (req, res) => {
    const post = await postService.findOneBySlug(req.params.slug);
    const { message } = req.body;

    try {
      const author = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      };
      const savedComment = commentService.create(message, author, post.id);
      if (savedComment) return res.redirect(`/posts/${req.params.slug}?success=true`);

      throw new Error('Unable to save comment');
    } catch (err) {
      throw new Error(err.message);
    }
  });

  return router;
};
