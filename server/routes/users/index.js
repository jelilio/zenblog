const express = require('express');
const passport = require('passport');

const router = express.Router();

const renderRegister = (req, res, next, success, errMessage) =>
  res.render('layout', {
    pageTitle: 'Register',
    template: 'users/register',
    errMessage,
    success,
    formData: req.body,
  });

module.exports = ({ userService }) => {
  router.get('/login', (request, response) => {
    response.render('layout', {
      pageTitle: 'Login',
      template: 'users/login',
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

  router.get('/register', (request, response, next) => {
    renderRegister(request, response, next, request.query.success);
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

  return router;
};
