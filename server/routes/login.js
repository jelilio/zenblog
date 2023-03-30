const express = require('express');

const router = express.Router();

module.exports = ({ userService }) => {
  router.get('/', (request, response) => {
    response.render('layout', {
      pageTitle: 'Login',
      template: 'login',
      success: request.query.success,
      formData: {},
    });
  });

  router.post('/', async (req, res, next) => {
    try {
      const savedUser = await userService.register(req.body.email, req.body.password);
      if (savedUser) return res.redirect('/success=true');

      return next(new Error('Failed to saved used'));
    } catch (err) {
      return res.render('layout', {
        pageTitle: 'Login',
        template: 'login',
        errMessage: err.message,
        success: false,
        formData: req.body,
      });
    }
  });

  return router;
};
