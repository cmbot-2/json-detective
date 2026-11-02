import type { JsonValue } from './tree.js';

export type Change =
  | { kind: 'added'; path: string[]; after: JsonValue }
  | { kind: 'removed'; path: string[]; before: JsonValue }
  | { kind: 'changed'; path: string[]; before: JsonValue; after: JsonValue };

function isObject(value: JsonValue): value is { [key: string]: JsonValue } {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// Arrays are compared in order, with object key order ignored inside them too.
function equal(source: JsonValue, target: JsonValue): boolean {
  const pending = [[source, target]];
  while (pending.length) {
    const [before, after] = pending.pop()! as [JsonValue, JsonValue];
    if (before === after) continue;
    if (Array.isArray(before) && Array.isArray(after)) {
      if (before.length !== after.length) return false;
      before.forEach((value, index) => pending.push([value, after[index]!]));
    } else if (isObject(before) && isObject(after)) {
      const keys = Object.keys(before);
      if (keys.length !== Object.keys(after).length) return false;
      for (const key of keys) {
        if (!Object.hasOwn(after, key)) return false;
        pending.push([before[key]!, after[key]!]);
      }
    } else return false;
  }
  return true;
}

export function compareJson(source: JsonValue, target: JsonValue): Change[] {
  const changes: Change[] = [];
  const pending = [{ before: source, after: target, path: [] as string[] }];
  while (pending.length) {
    const { before, after, path } = pending.pop()!;
    if (before === after) continue;
    if (isObject(before) && isObject(after)) {
      for (const key of Object.keys(before).sort()) {
        if (!Object.hasOwn(after, key)) changes.push({ kind: 'removed', path: [...path, key], before: before[key]! });
      }
      for (const key of Object.keys(after).sort().reverse()) {
        if (!Object.hasOwn(before, key)) changes.push({ kind: 'added', path: [...path, key], after: after[key]! });
        else pending.push({ before: before[key]!, after: after[key]!, path: [...path, key] });
      }
    } else if (!equal(before, after)) {
      // Until element-level comparisons are available, a changed array is one change.
      changes.push({ kind: 'changed', path, before, after });
    }
  }
  return changes;
}
