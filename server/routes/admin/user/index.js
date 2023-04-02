const express = require('express');

const router = express.Router();

const renderCreateUser = (req, res, pageTitle, success, errMessage, formData) =>
  res.render('layout', {
    pageTitle,
    templates: ['admin/index', 'admin/users/form'],
    template: 'admin/index',
    errMessage,
    success,
    formData,
  });

module.exports = ({ userService }) => {
  router.get('/', async (req, res) => {
    const result = await userService.findAll();
    res.render('layout', {
      pageTitle: 'Users',
      templates: ['admin/index', 'admin/users/index'],
      template: 'admin/index',
      users: result,
    });
  });

  router.get('/add', (req, res) =>
    res.render('layout', {
      pageTitle: 'Create User',
      templates: ['admin/index', 'admin/users/form'],
      template: 'admin/index',
      formData: { roles: [] },
    })
  );

  router.get('/:id/edit', async (req, res) => {
    const user = await userService.findOne(req.params.id);
    const adminCheck = user.roles.indexOf('ADMIN') >= 0 ? 'ADMIN' : '';
    const userCheck = user.roles.indexOf('USER') >= 0 ? 'USER' : '';

    return res.render('layout', {
      pageTitle: 'Edit User',
      templates: ['admin/index', 'admin/users/form'],
      template: 'admin/index',
      formData: { adminCheck, userCheck, ...user.toObject() },
    });
  });

  router.get('/:id/delete', async (req, res) => {
    await userService.deleteOne(req.params.id);
    return res.redirect('/admin/users');
  });

  router.post('/add', async (req, res) => {
    const roles = [];
    if (req.body.adminCheck) roles.push(req.body.adminCheck);
    if (req.body.userCheck) roles.push(req.body.userCheck);
    try {
      const savedUser = await userService.create(
        req.body.name,
        req.body.email,
        req.body.password,
        roles
      );
      if (savedUser) return res.redirect('/admin/users?success=true');

      return renderCreateUser(req, res, 'Create User', false, 'Failed to saved category', req.body);
    } catch (err) {
      return renderCreateUser(req, res, 'Create User', false, err.message, req.body);
    }
  });

  router.post('/:id/edit', async (req, res) => {
    const roles = [];
    if (req.body.adminCheck) roles.push(req.body.adminCheck);
    if (req.body.userCheck) roles.push(req.body.userCheck);

    const formData = {
      ...req.body,
      _id: req.params.id,
    };

    try {
      const savedUser = await userService.updateByAdmin(
        req.params.id,
        req.body.name,
        req.body.email,
        roles
      );
      if (savedUser) return res.redirect('/admin/users?success=true');

      return renderCreateUser(req, res, 'Edit User', false, 'Failed to saved category', formData);
    } catch (err) {
      return renderCreateUser(req, res, 'Edit User', false, err.message, formData);
    }
  });

  return router;
};
