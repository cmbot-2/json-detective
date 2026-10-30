import assert from 'node:assert/strict';
import test from 'node:test';
import { validateJson } from '../.test-build/validation.js';

test('accepts every JSON root type, escaped strings, and unusual keys', () => {
  for (const text of ['{}', '[]', 'null', 'false', 'true', '42', '-1.2e+3', '"hello"',
    '{"__proto__": {"polluted": true}, "a/b~": [null, "a\\nb"]}']) {
    assert.deepEqual(validateJson(text), { valid: true }, text);
  }
  assert.equal({}.polluted, undefined);
});

test('reports malformed and incomplete documents without throwing', () => {
  for (const text of ['{', '{"a":1,}', '[1,]', '{\n "a": }', 'undefined',
    'NaN', '01', '{"a":1} trailing', '"unterminated', '{/*comment*/}']) {
    const result = validateJson(text);
    assert.equal(result.valid, false, text);
    assert(result.message.length > 0);
  }
});

test('empty input has actionable feedback and valid input clears an earlier error', () => {
  assert.match(validateJson(' \n\t').message, /Enter a JSON value/);
  assert.equal(validateJson('{broken').valid, false);
  assert.deepEqual(validateJson('{"fixed":true}'), { valid: true });
});
