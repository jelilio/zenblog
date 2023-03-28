const express = require('express');
const path = require('path');
// const routes = require('./routes');

const app = express();
const port = 3001;

// app.use('/', routes());

app.use(express.static(path.join(__dirname, './static'))); // middleware

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`ZenBlog with Express is running on port: ${port}!`);
});
