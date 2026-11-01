# JSON Detective

Two editors for checking JSON documents side by side.

Edit either document independently and see live validation, line counts, and character counts. Errors identify the source or target and include the browser’s syntax explanation, with a location when available. Valid JSON can be an object, array, string, number, boolean, or null. Validation keeps your text intact; reset one or both editors to restore the examples.

Each valid document has a tree below its editor. Click a container’s arrow, or focus its summary and press Enter or Space, to browse nested objects and arrays. Keys, array indexes, value types, root primitives, and empty containers are shown explicitly. Editing rebuilds that side’s tree; invalid JSON replaces it with a prompt to fix the input.

Documents stay in browser memory and clear when you reload. Structural comparison is not available yet.

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
