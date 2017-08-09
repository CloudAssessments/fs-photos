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
const upload = require('../../src/middleware/upload.js');

const verifyMocks = (t) => {
  t.context.mockRes.redirect.verify();
  t.context.mockReq.app.locals.fs.writeFile.verify();
};

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockRes = {
    locals: {
      editedImage: new Buffer('grey-foo'),
      image: { name: 'img.jpeg' },
    },
    redirect: sinon.mock(),
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockReq = {
    app: {
      locals: {
        fs: { writeFile: sinon.mock() },
        uploadDir: 'testDir',
      },
    },
  };
});

test.cb('should upload image to file system', (t) => {
  t.context.mockReq.app.locals.fs.writeFile
    .once()
    .callsFake((fd, buffer, cb) => {
      t.is(fd, 'testDir/img.jpeg');
      t.is(buffer.toString(), 'grey-foo');
      cb();
    });

  t.context.mockRes.redirect
    .once()
    .callsFake((url) => {
      t.is(url, '/');
      verifyMocks(t);
      t.end();
    });

  upload(t.context.mockReq, t.context.mockRes, t.context.mockNext);
});

test.cb('should redirect if write error occurs', (t) => {
  t.context.mockReq.app.locals.fs.writeFile
    .once()
    .callsFake((fd, buffer, cb) => {
      t.is(fd, 'testDir/img.jpeg');
      t.is(buffer.toString(), 'grey-foo');
      cb(new Error('oops'));
    });

  t.context.mockRes.redirect
    .once()
    .callsFake((url) => {
      t.is(url, '/?err={"message":"oops"}');
      verifyMocks(t);
      t.end();
    });

  upload(t.context.mockReq, t.context.mockRes, t.context.mockNext);
});
