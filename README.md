# jsdom-extended

Extended JSDOM mocks: geometry, `requestAnimationFrame`, `ResizeObserver`, and browser-like helpers for testing environments.

## Overview

`jsdom-extended` provides a set of patches for [JSDOM](https://github.com/jsdom/jsdom) to simulate browser behaviors that are missing or incomplete in the base JSDOM environment. This is particularly useful for unit testing UI components that rely on layout information or animation frames.

## Features

- ✅ **Geometry mocks**: `getBoundingClientRect` returns fixed dimensions (100x50), and `window` dimensions are set (1280x720).
- ✅ **RequestAnimationFrame (RAF)**: Polyfill with `cancelAnimationFrame` support, simulating ~60fps using `setTimeout`.
- ✅ **ResizeObserver**: Minimal mock that immediately triggers with a fixed `contentRect`.
- ✅ **TypeScript support**: First-class TS support with included type definitions.
- ✅ **Vite-ready**: Optimized for modern build pipelines.

## Requirements

- **Node.js**: 16+ (recommended)
- **jsdom**: ^27.2.0
- **Package Manager**: Yarn (1.22.22+)

## Installation

```bash
yarn add jsdom-extended
```

## Usage

### Applying all mocks

The easiest way is to use `applyJsdomExtended` which applies all available patches.

```typescript
import { JSDOM } from 'jsdom';
import { applyJsdomExtended } from 'jsdom-extended';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const window = dom.window as unknown as Window & typeof globalThis;

// Apply all extended mocks
applyJsdomExtended(window);

// Now you can use browser-like APIs
const element = window.document.createElement('div');
const rect = element.getBoundingClientRect();
console.log(rect.width); // 100
```

### Individual Mocks

You can also apply patches individually if you don't need all of them:

```typescript
import { patchGeometry, patchRAF, patchResizeObserver } from 'jsdom-extended';

// Apply only specific mocks
patchGeometry(window);
patchRAF(window);
patchResizeObserver(window);
```

## Scripts

The following scripts are available via `yarn`:

- `yarn build`: Checks types and builds the project using Vite.
- `yarn build:watch`: Builds the project in watch mode.
- `yarn types:check`: Runs `tsc` to verify type safety.

## Project Structure

```text
.
├── dist/                # Compiled output (ESM, UMD, Types)
├── src/                 # Source code
│   ├── mocks/           # Individual mock implementations
│   │   ├── geometry.ts  # getBoundingClientRect and window size mocks
│   │   ├── raf.ts       # requestAnimationFrame polyfill
│   │   └── resize-observer.ts # ResizeObserver mock
│   ├── setup.ts         # Main applyJsdomExtended logic
│   └── index.ts         # Public entry point
├── vite.config.ts       # Vite configuration
└── package.json         # Project metadata and dependencies
```

## Environment Variables

No specific environment variables are required for this project.

## Publishing

### Release Process

This project uses GitHub Actions to automate publishing to npm. Follow these steps to release a new version:

1. Update the version in `package.json`:
   ```bash
   # Edit package.json manually or use npm version
   npm version patch  # or minor, major, prerelease
   ```

2. Create and push a git tag:
   ```bash
   git tag v0.1.0  # Must match version in package.json
   git push origin v0.1.0
   ```

3. GitHub Actions will automatically:
   - Build the package
   - Run type checking
   - Publish to npm registry

**Note:** Only tags matching `v*` pattern will trigger the publish workflow.

## Tests

TODO: Add information about running tests once test suite is implemented.
Currently, `vitest` is listed as a devDependency, but no tests were found in `src/`.

## API

### `applyJsdomExtended(window)`
Applies all mocks to the provided window object.

### `patchGeometry(window)`
Patches `HTMLElement.prototype.getBoundingClientRect` and sets `window.innerWidth`/`innerHeight`.

### `patchRAF(window)`
Implements `requestAnimationFrame` and `cancelAnimationFrame`.

### `patchResizeObserver(window)`
Provides a `FakeResizeObserver` implementation.

## License

MIT
