const express = require('express');
const passport = require('passport');
const fetch = require('node-fetch');
const middlewares = require('../middlewares');

const router = express.Router();

const renderRegister = (req, res, next, success, errMessage) =>
  res.render('layout', {
    pageTitle: 'Register',
    template: 'users/register',
    errMessage,
    success,
    formData: req.body,
  });

const renderProfileEdit = (req, res, next, success, errMessage) =>
  res.render('layout', {
    pageTitle: 'Profile',
    template: 'users/profile_edit',
    errMessage,
    success,
    formData: req.body,
  });

const redirectIfLoggedIn = (req, res, next) => {
  if (req.user) return res.redirect('/users/profile');
  return next();
};

module.exports = ({ userService, avatarService }) => {
  router.get('/', (_, res) => res.redirect('/users/login'));

  router.get(
    '/profile',
    (req, res, next) => {
      if (req.user) return next();
      return res.status(403).end();
    },
    (req, res) =>
      res.render('layout', {
        pageTitle: 'Profile',
        template: 'users/profile',
        user: req.user,
      })
  );

  router.get(
    '/profile/edit',
    (req, res, next) => {
      if (req.user) return next();
      return res.status(403).end();
    },
    (req, res) =>
      res.render('layout', {
        pageTitle: 'Edit Profile',
        template: 'users/profile_edit',
        user: req.user,
        formData: req.user,
      })
  );

  router.post(
    '/profile/edit',
    (req, res, next) => {
      if (req.user) return next();
      return res.status(403).end();
    },
    middlewares.upload.single('avatar'),
    middlewares.handleAvatar(avatarService),
    async (req, res, next) => {
      try {
        let avatar;
        if (req.file && req.file.storedFilename) {
          avatar = req.file.storedFilename;
        }
        const updatedUser = await userService.update(
          req.user.id,
          req.body.name,
          req.body.email,
          req.body.bio,
          avatar
        );

        if (updatedUser) return res.redirect('/users/profile?success=true');

        return renderProfileEdit(req, res, next, false, 'Failed to update profile');
      } catch (err) {
        if (req.file && req.file.storedFilename) {
          await avatarService.delete(req.file.storedFilename);
        }
        return renderProfileEdit(req, res, next, false, err.message);
      }
    }
  );

  router.get('/login', redirectIfLoggedIn, (req, res) => {
    res.render('layout', {
      pageTitle: 'Login',
      template: 'users/login',
      error: req.query.error,
      formData: {},
    });
  });

  router.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login?error=true',
    })
  );

  router.get('/register', redirectIfLoggedIn, (req, res, next) => {
    renderRegister(req, res, next, req.query.success);
  });

  router.post('/register', async (req, res, next) => {
    try {
      const savedUser = await userService.register(
        req.body.name,
        req.body.email,
        req.body.password
      );
      if (savedUser) return res.redirect('/users/register?success=true');

      return renderRegister(req, res, next, false, 'Failed to saved user');
    } catch (err) {
      return renderRegister(req, res, next, false, err.message);
    }
  });

  router.get('/:id/avatar', async (req, res) => {
    const user = await userService.findOne(req.params.id);
    const url = user.avatar;
    return fetch(url)
      .then((suc) => suc.buffer())
      .then((image) => {
        res.set('Content-Type', 'image/jpeg');
        res.end(image);
      })
      .catch((err) => {
        res.end(err);
      });
  });

  router.get('/:id/avatartn', async (req, res) => {
    res.redirect(`/users/${req.params.id}/avatar`);
  });

  return router;
};
