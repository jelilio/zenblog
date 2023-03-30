const express = require('express');
const UserModel = require('../models/UserModel');

const router = express.Router();

module.exports = () => {
  router.get('/', (request, response) => {
    response.render('layout', { pageTitle: 'Register', template: 'register' });
  });

  router.post('/', async (req, res, next) => {
    try {
      const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      const savedUser = await user.save();
      if (savedUser) return res.redirect('/register?success=true');

      return next(new Error('Failed to saved used'));
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
