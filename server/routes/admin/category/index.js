const express = require('express');

const router = express.Router();

const renderCreateCategory = (req, res, pageTitle, success, errMessage) =>
  res.render('layout', {
    pageTitle,
    templates: ['admin/index', 'admin/categories/form'],
    template: 'admin/index',
    errMessage,
    success,
    formData: req.body,
  });

module.exports = ({ categoryService }) => {
  router.get('/', async (req, res) => {
    const result = await categoryService.findAll();
    res.render('layout', {
      pageTitle: 'Categories',
      templates: ['admin/index', 'admin/categories/index'],
      template: 'admin/index',
      categories: result,
    });
  });

  router.get('/add', (req, res) =>
    res.render('layout', {
      pageTitle: 'Create Category',
      templates: ['admin/index', 'admin/categories/form'],
      template: 'admin/index',
      formData: {},
    })
  );

  router.get('/:id/edit', async (req, res) => {
    const category = await categoryService.findOne(req.params.id);
    return res.render('layout', {
      pageTitle: 'Edit Category',
      templates: ['admin/index', 'admin/categories/form'],
      template: 'admin/index',
      formData: category,
    });
  });

  router.get('/:id/delete', async (req, res) => {
    await categoryService.deleteOne(req.params.id);
    return res.redirect('/admin/categories');
  });

  router.post('/add', async (req, res) => {
    try {
      const savedCategory = await categoryService.create(req.body.name, req.body.description);
      if (savedCategory) return res.redirect('/admin/categories?success=true');

      return renderCreateCategory(req, res, 'Create Category', false, 'Failed to saved category');
    } catch (err) {
      return renderCreateCategory(req, res, 'Create Category', false, err.message);
    }
  });

  router.post('/:id/edit', async (req, res) => {
    try {
      const savedCategory = await categoryService.update(
        req.params.id,
        req.body.name,
        req.body.description
      );
      if (savedCategory) return res.redirect('/admin/categories?success=true');

      return renderCreateCategory(req, res, 'Edit Category', false, 'Failed to saved category');
    } catch (err) {
      return renderCreateCategory(req, res, 'Edit Category', false, err.message);
    }
  });

  return router;
};
