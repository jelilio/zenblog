const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const routes = require('./routes');
const auth = require('./lib/auth');
// const config = require('./config')[process.env.NODE_ENV || 'development'];
// const db = require('./lib/db');

const UserService = require('./services/UserService');
const AvatarService = require('./services/AvatarService');
const CategoryService = require('./services/CategoryService');
const PostService = require('./services/PostService');

module.exports = (config) => {
  const app = express();
  const userService = new UserService();
  const avatarService = new AvatarService(config.data.avatars);
  const categoryService = new CategoryService();
  const postService = new PostService();

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

  app.use('/', express.static(path.join(__dirname, '../public')));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    session({
      secret: 'a very random string 1234',
      resave: true,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  );

  app.use(auth.initialize);
  app.use(auth.session);
  app.use(auth.setUser);

  app.use('/', routes({ userService, avatarService, categoryService, postService }));

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
