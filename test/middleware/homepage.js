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
