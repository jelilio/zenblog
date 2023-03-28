const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const routes = require('./routes');

const app = express();
const port = 3001;

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['ksdjfcadsiew', 'owecdkhdsowesh'],
  })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'ZenBlog';

app.use(express.static(path.join(__dirname, './static')));

app.use('/', routes());

app.get('/', (request, response) => {
  response.render('pages/index', { pageTitle: 'Welcome' });
});

app.listen(port, () => {
  console.log(`ZenBlog with Express is running on port: ${port}!`);
});
