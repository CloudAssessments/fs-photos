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

const { test } = require('ava');
const sinon = require('sinon');
const getImages = require('../../src/middleware/getImages');

const verifyMocks = (t) => {
  t.context.mockReq.app.locals.fs.readdir.verify();
};

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockReq = {
    app: {
      locals: {
        fs: { readdir: sinon.mock() },
        uploadDir: 'testDir',
      },
    },
    params: {
      image: 'img.jpeg',
    },
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockNext = sinon.mock();
});

test.cb('should get a list of image files in the upload directory', (t) => {
  const mockRes = { locals: {} };

  t.context.mockReq.app.locals.fs.readdir
    .once()
    .callsFake((dir, cb) => {
      t.is(dir, 'testDir');
      cb(null, ['img1.png', 'gif1.gif', 'img2.jpeg']);
    });

  t.context.mockNext
    .once()
    .callsFake(() => {
      t.deepEqual(mockRes.locals.images, ['testDir/img1.png', 'testDir/img2.jpeg']);
      verifyMocks(t);
      t.end();
    });

  getImages(t.context.mockReq, mockRes, t.context.mockNext);
});

test.cb('should error if could not read from directory', (t) => {
  const mockRes = { locals: {} };

  t.context.mockReq.app.locals.fs.readdir
    .once()
    .callsFake((dir, cb) => {
      t.is(dir, 'testDir');
      cb(new Error('oops'));
    });

  t.context.mockNext
    .once()
    .callsFake(() => {
      t.is(mockRes.locals.error.message, 'oops');
      verifyMocks(t);
      t.end();
    });

  getImages(t.context.mockReq, mockRes, t.context.mockNext);
});

