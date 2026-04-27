# GIF Worker Setup

The file `gif.worker.js` is required for animated GIF export in the Reel Generator.

## Auto-setup (recommended)

After running `npm install`, run:

```bash
cp node_modules/gif.js/dist/gif.worker.js public/gif.worker.js
```

Or add this to your `package.json` scripts:

```json
"scripts": {
  "postinstall": "cp node_modules/gif.js/dist/gif.worker.js public/gif.worker.js"
}
```

## Why?

`gif.js` uses a web worker for non-blocking GIF encoding. The worker file must be served from the public folder so the browser can access it.

If `public/gif.worker.js` is missing, animated GIF export will fail. WebM export will still work.
