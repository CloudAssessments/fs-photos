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
const getImage = require('../../src/middleware/getImage');

const verifyMocks = (t) => {
  t.context.mockReq.app.locals.fs.readFile.verify();
  t.context.mockRes.end.verify();
  t.context.mockRes.send.verify();
  t.context.mockRes.status.verify();
  t.context.mockRes.writeHead.verify();
};

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockReq = {
    app: {
      locals: {
        fs: { readFile: sinon.mock() },
        uploadDir: 'testDir',
      },
    },
    params: {
      image: 'img.jpeg',
    },
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockRes = {
    end: sinon.mock(),
    send: sinon.mock(),
    status: sinon.mock(),
    writeHead: sinon.mock(),
  };
});

test.cb('should send a buffer of the image', (t) => {
  t.context.mockReq.app.locals.fs.readFile
    .once()
    .callsFake((path, cb) => {
      t.is(path, 'testDir/img.jpeg');
      cb(null, new Buffer('foo'));
    });

  t.context.mockRes.status.never();
  t.context.mockRes.send.never();

  t.context.mockRes.writeHead
    .once()
    .withArgs(200);

  t.context.mockRes.end
    .once()
    .callsFake((data, type) => {
      t.is(data.toString(), 'foo');
      t.is(type, 'binary');
      verifyMocks(t);
      t.end();
    });

  getImage(t.context.mockReq, t.context.mockRes);
});

test.cb('should 404 if unable to read file', (t) => {
  t.context.mockReq.app.locals.fs.readFile
    .once()
    .callsFake((path, cb) => {
      t.is(path, 'testDir/img.jpeg');
      cb(new Error('oops'));
    });

  t.context.mockRes.status
    .once()
    .withArgs(404)
    .returns(t.context.mockRes);

  t.context.mockRes.send
    .once()
    .callsFake(() => {
      verifyMocks(t);
      t.end();
    });

  t.context.mockRes.writeHead.never();
  t.context.mockRes.end.never();

  getImage(t.context.mockReq, t.context.mockRes);
});

