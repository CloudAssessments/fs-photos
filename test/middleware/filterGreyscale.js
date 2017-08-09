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
const filterGreyscale = require('../../src/middleware/filterGreyscale.js');

const verifyMocks = (t) => {
  t.context.mockRes.redirect.verify();
  t.context.mockReq.app.locals.jimp.read.verify();
  t.context.mockNext.verify();
};

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockRes = {
    locals: {
      image: { buffer: new Buffer('foo') },
    },
    redirect: sinon.mock(),
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockReq = {
    app: {
      locals: {
        jimp: {
          read: sinon.mock(),
          AUTO: 'auto',
        },
      },
    },
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockNext = sinon.mock();
});

test.cb('should return apply filterGreyscale filter to given image buffer', (t) => {
  const mockImage = {
    greyscale: sinon.mock(),
    getBuffer: sinon.mock(),
  };

  mockImage.greyscale
    .once()
    .withArgs()
    .returns(mockImage);

  mockImage.getBuffer
    .once()
    .callsFake((type, cb) => {
      cb(null, new Buffer('grey-foo'));
    });

  t.context.mockReq.app.locals.jimp.read
    .once()
    .callsFake((buffer, cb) => {
      t.is(buffer.toString(), 'foo');
      cb(null, mockImage);
    });

  t.context.mockRes.redirect.never();

  t.context.mockNext
    .once()
    .callsFake(() => {
      t.is(t.context.mockRes.locals.editedImage.toString(), 'grey-foo');
      verifyMocks(t);
      t.end();
    });

  filterGreyscale(t.context.mockReq, t.context.mockRes, t.context.mockNext);
});

test.cb('should return error if could not get buffer for filtered image', (t) => {
  const mockImage = {
    greyscale: sinon.mock(),
    getBuffer: sinon.mock(),
  };

  mockImage.greyscale
    .once()
    .withArgs()
    .returns(mockImage);

  mockImage.getBuffer
    .once()
    .callsFake((type, cb) => {
      cb(new Error('oops'));
    });

  t.context.mockReq.app.locals.jimp.read
    .once()
    .callsFake((buffer, cb) => {
      t.is(buffer.toString(), 'foo');
      cb(null, mockImage);
    });

  t.context.mockRes.redirect
    .once()
    .callsFake((url) => {
      t.is(url, '/?err={"message":"oops"}');
      verifyMocks(t);
      t.end();
    });

  t.context.mockNext.never();

  filterGreyscale(t.context.mockReq, t.context.mockRes, t.context.mockNext);
});

test.cb('should return error if image buffer cannot be read', (t) => {
  const mockImage = {
    greyscale: sinon.mock(),
    getBuffer: sinon.mock(),
  };

  mockImage.greyscale
    .once()
    .withArgs()
    .returns(mockImage);

  mockImage.getBuffer
    .once()
    .callsFake((type, cb) => {
      cb(null, new Buffer('grey-foo'));
    });

  t.context.mockReq.app.locals.jimp.read
    .once()
    .callsFake((buffer, cb) => {
      t.is(buffer.toString(), 'foo');
      cb(new Error('oops'));
    });

  t.context.mockRes.redirect
    .once()
    .callsFake((url) => {
      t.is(url, '/?err={"message":"oops"}');
      verifyMocks(t);
      t.end();
    });

  t.context.mockNext.never();

  filterGreyscale(t.context.mockReq, t.context.mockRes, t.context.mockNext);
});
