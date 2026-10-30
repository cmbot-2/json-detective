# JSON Detective

Two editors for viewing JSON documents side by side.

Edit either document independently, reset one or both to the examples, and see live line and character counts. Text stays in browser memory and clears when you reload. The editors accept any text; this version does not parse or compare the documents.

## Run locally

Use Node.js 20.19.x or Node.js 22.12+ and npm. From the repository folder:

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal.

## Development

```sh
npm run check   # Check TypeScript
npm run build   # Check types and build into dist/
npm run preview # Serve the build locally
```

Built with TypeScript and Vite.
