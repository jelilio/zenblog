const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const createError = require('http-errors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const routes = require('./routes');
const auth = require('./lib/auth');
const cloudinary = require('./lib/cloudinary');

const UserService = require('./services/UserService');
const AvatarService = require('./services/AvatarService');
const CategoryService = require('./services/CategoryService');
const PostService = require('./services/PostService');
const CommentService = require('./services/CommentService');

module.exports = (config) => {
  const app = express();

  const instance = cloudinary.setup(config.cloudinary);

  // initialize different services which contain the application and database logic
  const userService = new UserService(); // users related services
  const avatarService = new AvatarService(config.data.avatars, instance);
  const categoryService = new CategoryService();
  const postService = new PostService();
  const commentService = new CommentService();

  app.set('trust proxy', 1);

  app.use(
    cookieSession({
      name: 'session',
      keys: ['ksdjfcadsiew', 'owecdkhdsowesh'],
    })
  );

  app.set('view engine', 'ejs'); // using ejs as the view
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
  app.use(auth.setUser); // Inject the logged-user on local variable

  // declare the applicaiton's routes
  app.use(
    '/',
    routes({ userService, avatarService, categoryService, postService, commentService })
  );

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError(404));
  });

  if (app.get('env') === 'development') {
    app.locals.pretty = true;
  }

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    const status = err.status || 500; // If no status is provided, let's assume it's a 500
    res.locals.status = status;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(status);
    res.render('error');
  });

  return app;
};
