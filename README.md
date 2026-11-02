# JSON Detective

Two editors for checking JSON documents side by side.

Edit either document independently and see live validation, line counts, and character counts. Errors identify the source or target and include the browser’s syntax explanation, with a location when available. Valid JSON can be an object, array, string, number, boolean, or null. Validation keeps your text intact; reset one or both editors to restore the examples.

Each valid document has a tree below its editor. Click a container’s arrow, or focus its summary and press Enter or Space, to browse nested objects and arrays. Keys, array indexes, value types, root primitives, and empty containers are shown explicitly. Editing rebuilds that side’s tree; invalid JSON replaces it with a prompt to fix the input.

Choose **Compare JSON** for a summary of added, removed, and changed values from source to target. Object key order and formatting do not matter. Missing properties differ from `null`, and changing a value's type counts as a change. Added or removed properties count once, even when they contain a whole object. Arrays preserve element order and currently count as one change when their contents differ; object key order inside them is still ignored.

Both documents must be valid to compare. Editing or resetting either side clears the old result so you can compare again. Documents stay in browser memory and clear when you reload.

## Run locally

Use Node.js 20.19.x or Node.js 22.12+ and npm. From the repository folder:

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal.

## Development

```sh
npm test        # Run regression checks
npm run check   # Check TypeScript
npm run build   # Check types and build into dist/
npm run preview # Serve the build locally
```

Built with TypeScript and Vite.
