const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const routes = require('./routes');
// const config = require('./config')[process.env.NODE_ENV || 'development'];
// const db = require('./lib/db');

module.exports = (config) => {
  const app = express();
  // const port = 3001;

  app.set('trust proxy', 1);

  app.use(
    cookieSession({
      name: 'session',
      keys: ['ksdjfcadsiew', 'owecdkhdsowesh'],
    })
  );

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, './views'));

  app.locals.title = config.sitename;
  app.locals.siteName = 'ZenBlog';

  app.use(express.static(path.join(__dirname, '../public')));

  app.use('/', routes());

  // app.get('/', (request, response) => {
  //   response.render('pages/index', { pageTitle: 'Welcome' });
  // });

  // db.connect(config.database.dsn).then(() => {
  //   console.log('connected to Mongodb');
  // });

  // app.listen(port, () => {
  //   console.log(`ZenBlog with Express is running on port: ${port}!`);
  // });

  return app;
};
