import './style.css';
import { validateJson } from './validation';
import { createTree } from './tree';

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
