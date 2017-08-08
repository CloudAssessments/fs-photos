const { test } = require('ava');
const sinon = require('sinon');
const homepage = require('../../src/middleware/homepage');

test.cb('should render index', (t) => {
  const render = sinon.mock()
    .once()
    .callsFake((viewFile) => {
      t.is(viewFile, 'index');
      t.end();
    });

  homepage({}, { render });
});

test.cb('should render index with err if req query has err', (t) => {
  const req = {
    query: { err: 'oops' },
  };

  const render = sinon.mock()
    .once()
    .callsFake((viewFile, ctx) => {
      t.is(viewFile, 'index');
      t.is(ctx.err, 'oops');
      t.end();
    });

  homepage(req, { render });
});
