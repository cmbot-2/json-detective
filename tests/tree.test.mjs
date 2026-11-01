import assert from 'node:assert/strict';
import test from 'node:test';
import { describeValue } from '../.test-build/tree.js';

test('root primitives and empty containers keep their types and literal values', () => {
  for (const [value, type, preview] of [[null, 'null', 'null'], [true, 'boolean', 'true'], [false, 'boolean', 'false'],
    [0, 'number', '0'], [-1.5, 'number', '-1.5'], ['', 'string', '""'], ['a\nb', 'string', '"a\\nb"'],
    [{}, 'object', '{}'], [[], 'array', '[]']]) {
    assert.deepEqual(describeValue(value), { type, preview, children: [] });
  }
});

test('nested objects and arrays retain keys, indexes, and unusual property names', () => {
  const value = JSON.parse('{"__proto__":{"safe":true},"a/b~":[null,{},[]],"<img onerror=alert(1)>":"<script>"}');
  const description = describeValue(value);
  assert.deepEqual(description.children.map(([key]) => key), ['"__proto__"', '"a/b~"', '"<img onerror=alert(1)>"']);
  const array = describeValue(description.children[1][1]);
  assert.deepEqual(array.children, [['[0]', null], ['[1]', {}], ['[2]', []]]);
  assert.equal(describeValue(description.children[2][1]).preview, '"<script>"');
  assert.equal({}.safe, undefined);
});
