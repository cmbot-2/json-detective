export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export function describeValue(value: JsonValue) {
  if (Array.isArray(value)) {
    return { type: 'array', preview: value.length ? `[${value.length} items]` : '[]', children: value.map((child, index) => [`[${index}]`, child] as const) };
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value);
    return { type: 'object', preview: entries.length ? `{${entries.length} keys}` : '{}', children: entries.map(([key, child]) => [JSON.stringify(key), child] as const) };
  }
  return { type: value === null ? 'null' : typeof value, preview: JSON.stringify(value), children: [] };
}

export function createTree(value: JsonValue, label = 'root', expanded = true): HTMLElement {
  const description = describeValue(value);
  const name = document.createElement('span');
  name.className = 'tree-key';
  name.textContent = label + ': ';
  const preview = document.createElement('span');
  preview.className = 'tree-value';
  preview.dataset.type = description.type;
  preview.textContent = description.preview;
  const type = document.createElement('span');
  type.className = 'tree-type';
  type.textContent = description.type;
  if (!description.children.length) {
    const leaf = document.createElement('div');
    leaf.className = 'tree-leaf';
    leaf.append(name, preview, type);
    return leaf;
  }
  const container = document.createElement('details');
  const summary = document.createElement('summary');
  summary.append(name, preview, type);
  const children = document.createElement('div');
  children.className = 'tree-children';
  container.append(summary, children);
  let loaded = false;
  const load = () => {
    if (loaded || !container.open) return;
    loaded = true;
    for (const [key, child] of description.children) children.append(createTree(child, key, false));
  };
  container.addEventListener('toggle', load);
  container.open = expanded;
  load();
  return container;
}
