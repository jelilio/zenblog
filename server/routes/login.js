const express = require('express');
const passport = require('passport');

const router = express.Router();

module.exports = () => {
  router.get('/', (request, response) => {
    response.render('layout', {
      pageTitle: 'Login',
      template: 'login',
      error: request.query.error,
      formData: {},
    });
  });

  router.post(
    '/',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login?error=true',
    })
  );

  return router;
};
