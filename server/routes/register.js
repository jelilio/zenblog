const express = require('express');
// const UserModel = require('../models/UserModel');

const router = express.Router();

const renderDefault = (request, response, errMessage) => {
  response.render('layout', { pageTitle: 'Register', template: 'register', errMessage });
};

module.exports = ({ userService }) => {
  router.get('/', (request, response) => {
    response.render('layout', { pageTitle: 'Register', template: 'register' });
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
      console.log(err.message);
      return renderDefault(req, res, err.message);
    }
  });

  return router;
};
