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
const getImageNamesInDir = require('../../src/util/getImageNamesInDir');

const verifyMocks = (t) => {
  t.context.mockFs.readdir.verify();
};

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockFs = { readdir: sinon.mock() };
});

test('should get image file names in directory', (t) => {
  t.context.mockFs.readdir
    .once()
    .callsFake((path, cb) => {
      t.is(path, 'testDir');
      cb(null, ['test.jpg', 'test.gif', 'test.png']);
    });

  return getImageNamesInDir(t.context.mockFs)('testDir')
    .then((res) => {
      t.deepEqual(res, ['test.jpg', 'test.png']);
      verifyMocks(t);
    });
});

test('should reject if error when reading directory', (t) => {
  t.context.mockFs.readdir
    .once()
    .callsFake((path, cb) => {
      t.is(path, 'testDir');
      cb(new Error('oops'));
    });

  return t.throws(
    getImageNamesInDir(t.context.mockFs)('testDir'),
    'oops'
  );
});
