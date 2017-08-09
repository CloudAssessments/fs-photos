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
const homepage = require('../../src/middleware/homepage');

const verifyMocks = (t) => {
  t.context.mockRes.render.verify();
};

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockRes = {
    locals: {
      images: ['uploads/img1.jpeg', 'uploads/img2.jpeg'],
    },
    render: sinon.mock(),
  };
});

test.cb('should render index', (t) => {
  t.context.mockRes.render
    .once()
    .callsFake((viewFile, ctx) => {
      t.is(viewFile, 'index');
      t.is(ctx.images, t.context.mockRes.locals.images);
      verifyMocks(t);
      t.end();
    });

  homepage({}, t.context.mockRes);
});

test.cb('should render index with err if req query has err', (t) => {
  const req = {
    query: { err: 'oops' },
  };

  t.context.mockRes.render
    .once()
    .callsFake((viewFile, ctx) => {
      t.is(viewFile, 'index');
      t.is(ctx.err, 'oops');
      t.is(ctx.images, t.context.mockRes.locals.images);
      verifyMocks(t);
      t.end();
    });

  homepage(req, t.context.mockRes);
});

test.cb('should render index with err if res locals has an error', (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockRes.locals.error = new Error('oops');

  t.context.mockRes.render
    .once()
    .callsFake((viewFile, ctx) => {
      t.is(viewFile, 'index');
      t.is(ctx.err, '{"message":"oops"}');
      t.is(ctx.images, t.context.mockRes.locals.images);
      verifyMocks(t);
      t.end();
    });

  homepage({}, t.context.mockRes);
});
