const express = require('express');
const passport = require('passport');

const router = express.Router();

module.exports = ({ userService }) => {
  router.get('/login', (request, response) => {
    response.render('layout', {
      pageTitle: 'Login',
      template: 'login',
      error: request.query.error,
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

  router.get('/register', (request, response) => {
    response.render('layout', {
      pageTitle: 'Register',
      template: 'register',
      success: request.query.success,
      formData: {},
    });
  });

  router.post('/register', async (req, res, next) => {
    try {
      const savedUser = await userService.register(
        req.body.name,
        req.body.email,
        req.body.password
      );
      if (savedUser) return res.redirect('/users/register?success=true');

      return next(new Error('Failed to saved used'));
    } catch (err) {
      return res.render('layout', {
        pageTitle: 'Register',
        template: 'register',
        errMessage: err.message,
        success: false,
        formData: req.body,
      });
    }
  });

  return router;
};
