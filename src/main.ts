import './style.css';
import { validateJson } from './validation';
import { createTree } from './tree';
import { compareJson } from './compare';

const examples = {
  source: {
    project: 'lunar-outpost',
    crew: 3,
    supplies: ['water', 'seeds'],
    coordinates: { sector: 'north', bay: 7 },
    ready: false,
  },
  target: {
    project: 'lunar-outpost',
    crew: 4,
    supplies: ['water', 'seeds', 'tools'],
    coordinates: { sector: 'north', bay: 7 },
    ready: true,
  },
};
type Side = keyof typeof examples;
const sides: Side[] = ['source', 'target'];
const inputs: Record<Side, HTMLTextAreaElement> = {
  source: document.querySelector('#source')!,
  target: document.querySelector('#target')!,
};
const announcement = document.querySelector<HTMLElement>('#announcement')!;
const compare = document.querySelector<HTMLButtonElement>('#compare')!;
const comparison = document.querySelector<HTMLElement>('#comparison-result')!;

function invalidateComparison() {
  const invalid = sides.filter((side) => !validateJson(inputs[side].value).valid);
  compare.disabled = invalid.length > 0;
  comparison.dataset.state = invalid.length ? 'invalid' : 'pending';
  comparison.textContent = invalid.length
    ? `Fix the ${invalid.join(' and ')} JSON before comparing.`
    : 'Ready to compare. Choose Compare JSON to check the current documents.';
}

function updateDocument(side: Side) {
  const text = inputs[side].value;
  const lines = text.split('\n').length;
  document.querySelector('#' + side + '-count')!.textContent =
    lines + (lines === 1 ? ' line' : ' lines') + ' · ' + text.length + ' characters';
  const validation = validateJson(text);
  const feedback = document.querySelector<HTMLElement>('#' + side + '-validation')!;
  const name = side === 'source' ? 'Source' : 'Target';
  inputs[side].setAttribute('aria-invalid', String(!validation.valid));
  feedback.dataset.valid = String(validation.valid);
  feedback.textContent = validation.valid
    ? `${name}: valid JSON.`
    : `${name}: ${validation.message}`;
  const tree = document.querySelector<HTMLElement>('#' + side + '-tree')!;
  if (validation.valid) tree.replaceChildren(createTree(JSON.parse(text)));
  else {
    const note = document.createElement('p');
    note.className = 'tree-empty';
    note.textContent = `Fix the ${side} JSON to browse its tree.`;
    tree.replaceChildren(note);
  }
  invalidateComparison();
}

function reset(side: Side) {
  inputs[side].value = JSON.stringify(examples[side], null, 2);
  updateDocument(side);
}

for (const side of sides) {
  reset(side);
  inputs[side].addEventListener('input', () => updateDocument(side));
  document.querySelector('#reset-' + side)!.addEventListener('click', () => {
    reset(side);
    inputs[side].focus();
    announcement.textContent = (side === 'source' ? 'Source' : 'Target') + ' example restored.';
  });
}

document.querySelector('#reset-both')!.addEventListener('click', () => {
  for (const side of sides) reset(side);
  inputs.source.focus();
  announcement.textContent = 'Both examples restored.';
});

compare.addEventListener('click', () => {
  invalidateComparison();
  if (compare.disabled) return;
  const changes = compareJson(JSON.parse(inputs.source.value), JSON.parse(inputs.target.value));
  comparison.dataset.state = changes.length ? 'different' : 'equal';
  const count = (kind: string) => changes.filter((change) => change.kind === kind).length;
  comparison.textContent = changes.length
    ? `${changes.length} ${changes.length === 1 ? 'change' : 'changes'}: ${count('added')} added, ${count('removed')} removed, ${count('changed')} changed.`
    : 'The documents are structurally equal.';
});
