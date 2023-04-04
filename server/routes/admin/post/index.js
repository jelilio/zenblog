const express = require('express');
const moment = require('moment');

const middlewares = require('../../middlewares');

const router = express.Router();

module.exports = ({ categoryService, avatarService, postService, commentService }) => {
  router.get('/', async (req, res) => {
    const result = await postService.findAll();
    res.render('layout', {
      pageTitle: 'Posts',
      templates: ['admin/index', 'admin/posts/index'],
      template: 'admin/index',
      posts: result,
      moment,
    });
  });

  router.get('/add', async (req, res) => {
    const result = await categoryService.findAll();
    res.render('layout', {
      pageTitle: 'Create New Post',
      templates: ['admin/index', 'admin/posts/form'],
      template: 'admin/index',
      formData: { categories: [], tags: [] },
      allCategries: result,
    });
  });

  router.post(
    '/add',
    middlewares.upload.single('featureImage'),
    middlewares.handleFeatureImage(avatarService),
    async (req, res) => {
      try {
        let featureImage;
        if (req.file && req.file.storedFilename) {
          featureImage = req.file.storedFilename;
        }

        const author = {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
        };
        const savedPost = await postService.create(
          req.body.title,
          req.body.subtitle,
          req.body.body,
          author,
          featureImage,
          req.body.featureImageCaption,
          false,
          req.body.categories,
          []
        );
        if (savedPost) return res.redirect('/admin/posts?success=true');

        throw new Error('Unable to save post');
      } catch (err) {
        throw new Error(err.message);
      }
    }
  );

  router.get('/:id/delete', async (req, res) => {
    await postService.deleteOne(req.params.id);
    return res.redirect('/admin/posts');
  });

  router.get('/:id/edit', async (req, res) => {
    const post = await postService.findOne(req.params.id);
    const categories = await categoryService.findAll();

    return res.render('layout', {
      pageTitle: 'Edit Post',
      templates: ['admin/index', 'admin/posts/form'],
      template: 'admin/index',
      allCategries: categories,
      formData: post,
    });
  });

  router.post(
    '/:id/edit',
    middlewares.upload.single('featureImage'),
    middlewares.handleFeatureImage(avatarService),
    async (req, res) => {
      try {
        let featureImage;
        if (req.file && req.file.storedFilename) {
          featureImage = req.file.storedFilename;
        }

        const author = {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
        };
        const savedPost = await postService.update(
          req.params.id,
          req.body.title,
          req.body.subtitle,
          req.body.body,
          author,
          featureImage,
          req.body.featureImageCaption,
          false,
          req.body.categories,
          []
        );
        if (savedPost) return res.redirect('/admin/posts?success=true');

        throw new Error('Unable to save post');
      } catch (err) {
        throw new Error(err.message);
      }
    }
  );

  router.get('/:id/preview', async (req, res) => {
    const post = await postService.findOne(req.params.id);
    const comments = await commentService.findAllByPost(post.id);

    res.render('layout', {
      pageTitle: 'Posts',
      template: 'blog/post',
      post,
      moment,
      comments,
    });
  });

  router.get('/feature-image/:filename', (req, res) => {
    res.type('png');
    return res.sendFile(avatarService.filepath(req.params.filename));
  });

  return router;
};
