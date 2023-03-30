const express = require('express');
// const UserModel = require('../models/UserModel');

const router = express.Router();

module.exports = ({ userService }) => {
  router.get('/', (request, response) => {
    response.render('layout', {
      pageTitle: 'Register',
      template: 'register',
      success: request.query.success,
      formData: {},
    });
  });

  router.post('/', async (req, res, next) => {
    try {
      const savedUser = await userService.register(
        req.body.name,
        req.body.email,
        req.body.password
      );
      if (savedUser) return res.redirect('/register?success=true');

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
