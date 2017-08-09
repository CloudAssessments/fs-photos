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
const deleteFiles = require('../../src/util/deleteFiles');

const verifyMocks = (t) => {
  t.context.mockFs.unlink.verify();
};

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockFs = { unlink: sinon.mock() };
});

test('should delete a list of files', (t) => {
  t.context.mockFs.unlink
    .twice()
    .callsFake((file, cb) => {
      t.true(['testDir/foo.jpeg', 'testDir/bar.jpeg'].includes(file));
      cb();
    });

  return deleteFiles(t.context.mockFs)(['testDir/foo.jpeg', 'testDir/bar.jpeg'])
    .then((res) => {
      t.is(res.length, 2);
      verifyMocks(t);
    });
});

test('should reject if there is a delete error', (t) => {
  t.context.mockFs.unlink
    .atMost(2)
    .callsFake((file, cb) => {
      cb(new Error('oops'));
    });

  return t.throws(
    deleteFiles(t.context.mockFs)(['testDir/foo.jpeg', 'testDir/bar.jpeg']),
    'oops'
  );
});
