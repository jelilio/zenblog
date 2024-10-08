const express = require('express');
const moment = require('moment');
const fetch = require('node-fetch');

const router = express.Router();

const restrictNonUser = async (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(403).end();
};

module.exports = ({ postService, commentService }) => {
  router.get('/:slug', async (req, res, next) => {
    const post = await postService.findOneBySlug(req.params.slug);
    if (!post) {
      const error = Error('Post not found');
      error.status = 404;
      return next(error);
    }
    const comments = await commentService.findAllByPost(post.id);

    const postsTop10 = await postService.findTop(10);

    const middleIndex = Math.ceil(postsTop10.length / 2);

    const latestPosts = postsTop10.slice().splice(0, middleIndex);
    const popularPosts = postsTop10.slice().splice(-middleIndex);

    return res.render('layout', {
      pageTitle: `${post.title}`,
      template: 'blog/post',
      post,
      moment,
      popularPosts,
      latestPosts,
      comments,
    });
  });

  router.get('/:slug/feature-image', async (req, res, next) => {
    const post = await postService.findOneBySlug(req.params.slug);
    if (!post) {
      const error = Error('Post not found');
      error.status = 404;
      return next(error);
    }
    const url = post.featureImage;
    return fetch(url)
      .then((suc) => suc.buffer())
      .then((image) => {
        res.set('Content-Type', 'image/jpeg');
        res.end(image);
      })
      .catch(() => {
        res.end();
      });
  });

  router.post('/:slug/comment', restrictNonUser, async (req, res, next) => {
    const post = await postService.findOneBySlug(req.params.slug);
    if (!post) {
      const error = Error('Post not found');
      error.status = 404;
      return next(error);
    }
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

  router.post('/:slug/comment/:id', restrictNonUser, async (req, res, next) => {
    const post = await postService.findOneBySlug(req.params.slug);
    const comment = await commentService.findOne(req.params.id);

    if (!post) {
      const error = Error('Post not found');
      error.status = 404;
      return next(error);
    }
    if (!comment) {
      const error = Error('Comment not found');
      error.status = 404;
      return next(error);
    }
    if (comment.author.id !== req.user.id) {
      const error = Error('Cannot edit someone else comment');
      error.status = 401;
      return next(error);
    }

    const { message } = req.body;

    try {
      const updatedComment = await commentService.update(req.params.id, message);
      if (updatedComment) return res.redirect(`/posts/${req.params.slug}?success=true`);

      throw new Error('Unable to update comment');
    } catch (err) {
      throw new Error(err.message);
    }
  });

  return router;
};
