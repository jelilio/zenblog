const express = require('express');
const moment = require('moment');

const middlewares = require('../../middlewares');

const router = express.Router();

module.exports = ({ categoryService, avatarService, postService, commentService }) => {
  const checkIfPostExist = async (req, res, next) => {
    const post = await postService.findOneBySlugAdmin(req.params.slug);
    if (!post) {
      const error = Error('Post not found');
      error.status = 404;
      return next(error);
    }
    res.locals.post = post;
    return next();
  };

  router.get('/', async (req, res) => {
    const result = await postService.findAllAdmin();
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
          req.body.publish,
          req.body.hide,
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

  router.get('/:slug/delete', checkIfPostExist, async (req, res) => {
    const { post } = res.locals;
    await postService.deleteOne(post.id);
    return res.redirect('/admin/posts');
  });

  router.get('/:slug/edit', checkIfPostExist, async (req, res) => {
    const { post } = res.locals;
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
    '/:slug/edit',
    checkIfPostExist,
    middlewares.upload.single('featureImage'),
    middlewares.handleFeatureImage(avatarService),
    async (req, res) => {
      try {
        const { post } = res.locals;

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
          post.id,
          req.body.title,
          req.body.subtitle,
          req.body.body,
          author,
          featureImage,
          req.body.featureImageCaption,
          req.body.publish,
          req.body.hide,
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

  router.get('/:slug/preview', checkIfPostExist, async (req, res) => {
    const { post } = res.locals;
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
