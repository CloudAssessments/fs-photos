/*
  Copyright 2017 Linux Academy
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const express = require('express');
const fs = require('fs');
const jimp = require('jimp');
const logger = require('morgan');
const multer = require('multer');
const path = require('path');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.locals = {
  fs,
  jimp,
  multer,
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
};

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes: Homepage
app.get(
  '/',
  require('./middleware/getImages'),
  require('./middleware/homepage')
);

// Routes: Upload Image
app.post(
  '/photo',
  multer().single('uploadedImage'),
  require('./middleware/multipartToImage'),
  require('./middleware/filterGreyscale'),
  require('./middleware/upload')
);

app.get(
  `/${app.locals.uploadDir}/:image`,
  require('./middleware/getImage.js')
);

// Routes: Debug - Show Environment and App Variables
app.get('/debug/app-vars', (req, res) => res.json({
  ENV_VARS: {
    PORT: process.env.PORT,
    UPLOAD_DIR: process.env.UPLOAD_DIR,
  },
  APP_LOCALS: {
    uploadDir: app.locals.uploadDir,
  },
}));

module.exports = app;
