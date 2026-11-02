import assert from 'node:assert/strict';
import test from 'node:test';
import { compareJson } from '../.test-build/compare.js';

test('object key order and whitespace do not matter, including nested objects', () => {
  const before = JSON.parse('{"b": {"y": 2, "x": 1}, "a": false}');
  const after = JSON.parse('{ "a": false, "b": {"x": 1, "y": 2} }');
  assert.deepEqual(compareJson(before, after), []);
  assert.deepEqual(compareJson(-0, 0), []);
});

test('missing, null and type changes stay distinct in both directions', () => {
  assert.deepEqual(compareJson({}, { value: null }), [{ kind: 'added', path: ['value'], after: null }]);
  assert.deepEqual(compareJson({ value: null }, {}), [{ kind: 'removed', path: ['value'], before: null }]);
  for (const [before, after] of [[null, 0], [0, false], [1, '1'], [[], {}], [{}, null]]) {
    assert.deepEqual(compareJson(before, after), [{ kind: 'changed', path: [], before, after }]);
  }
  assert.deepEqual(compareJson({ a: { b: 1 } }, { a: { b: 2 } }),
    [{ kind: 'changed', path: ['a', 'b'], before: 1, after: 2 }]);
});

test('added and removed containers count once and parsed unusual keys are own properties', () => {
  assert.deepEqual(compareJson({}, { a: { b: null } }), [{ kind: 'added', path: ['a'], after: { b: null } }]);
  const before = JSON.parse('{"__proto__": null, "constructor": false, "a/b~": 1}');
  const after = JSON.parse('{"__proto__": {}, "toString": true, "a/b~": 2}');
  const snapshot = JSON.stringify([before, after]);
  const changes = compareJson(before, after);
  assert.equal(changes.length, 4);
  assert(changes.some((change) => change.kind === 'removed' && change.path[0] === 'constructor'));
  assert(changes.some((change) => change.kind === 'added' && change.path[0] === 'toString'));
  assert(changes.some((change) => change.kind === 'changed' && change.path[0] === '__proto__'));
  assert.equal(JSON.stringify([before, after]), snapshot);
  assert.equal({}.polluted, undefined);
});

test('arrays preserve order but ignore object key order, and report one whole-value change', () => {
  assert.deepEqual(compareJson([{ a: 1, b: 2 }], [{ b: 2, a: 1 }]), []);
  for (const [before, after] of [[[1, 2], [2, 1]], [[], [null]], [[1, 1], [1]], [[[1]], [[2]]]]) {
    assert.deepEqual(compareJson(before, after), [{ kind: 'changed', path: [], before, after }]);
  }
  assert.deepEqual(compareJson({ a: [1] }, { a: [2] }), [{ kind: 'changed', path: ['a'], before: [1], after: [2] }]);
});
