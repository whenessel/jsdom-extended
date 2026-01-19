# @visual-coverage/jsdom-extended

Extended JSDOM mocks: geometry, raf, ResizeObserver, and browser-like helpers for testing environments.

## Features

- ✅ Geometry mocks (getBoundingClientRect, window dimensions)
- ✅ RequestAnimationFrame (RAF) polyfill with cancelAnimationFrame support
- ✅ ResizeObserver mock
- ✅ Browser-like environment for testing
- ✅ TypeScript support
- ✅ Zero dependencies (except jsdom)
- ✅ Easy integration with Vitest via setup files

## Installation

```bash
npm install @visual-coverage/jsdom-extended
```

## Requirements

- jsdom 27.x+
- Node.js 16+

## Usage

### Basic Example

```typescript
import { JSDOM } from 'jsdom';
import { applyJsdomExtended } from '@visual-coverage/jsdom-extended';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'https://example.com',
  pretendToBeVisual: true,
  resources: 'usable',
});

const window = dom.window;

// Apply extended mocks
applyJsdomExtended(window);

// Now you can use browser-like APIs
const element = window.document.createElement('div');
const rect = element.getBoundingClientRect();
console.log(rect.width); // 100 (mocked)

window.requestAnimationFrame((timestamp) => {
  console.log('RAF called', timestamp);
});
```

### Individual Mocks

```typescript
import {
  patchGeometry,
  patchRAF,
  patchResizeObserver,
} from '@visual-coverage/jsdom-extended';

const window = dom.window;

// Apply specific mocks
patchGeometry(window);
patchRAF(window);
patchResizeObserver(window);
```

### With Testing Frameworks

#### Vitest Setup File (Recommended)

Create a `vitest.setup.ts` file in your project root:

```typescript
import { applyJsdomExtended } from '@visual-coverage/jsdom-extended';

// Apply extended mocks automatically for all tests
if (typeof window !== 'undefined') {
  applyJsdomExtended(window);
}
```

Then configure vitest to use it in `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

#### Manual Application in Tests

```typescript
import { describe, it, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { applyJsdomExtended } from '@visual-coverage/jsdom-extended';

describe('My Tests', () => {
  let window: Window;

  beforeEach(() => {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    window = dom.window as unknown as Window;
    applyJsdomExtended(window);
  });

  it('should have geometry mocks', () => {
    const element = window.document.createElement('div');
    const rect = element.getBoundingClientRect();
    expect(rect.width).toBe(100);
    expect(rect.height).toBe(50);
  });

  it('should have RAF support', (done) => {
    const id = window.requestAnimationFrame(() => {
      done();
    });
    // Can cancel if needed
    window.cancelAnimationFrame(id);
  });

  it('should have ResizeObserver', () => {
    const observer = new window.ResizeObserver(() => {});
    expect(observer).toBeDefined();
  });
});
```

## API

### `applyJsdomExtended(window: any): void`

Applies all extended mocks to the provided window object.

**Parameters:**

- `window` - JSDOM window object to patch

**Applied mocks:**

- `patchGeometry(window)` - Geometry APIs
- `patchRAF(window)` - RequestAnimationFrame
- `patchResizeObserver(window)` - ResizeObserver

### `patchGeometry(window: any): void`

Patches geometry-related APIs:

- `HTMLElement.prototype.getBoundingClientRect()` - Returns mocked rect:
  ```typescript
  {
    width: 100,
    height: 50,
    top: 0,
    left: 0,
    bottom: 50,
    right: 100,
    x: 0,
    y: 0
  }
  ```
- `window.innerWidth` - Set to 1280
- `window.innerHeight` - Set to 720

### `patchRAF(window: any): void`

Patches `window.requestAnimationFrame` and `window.cancelAnimationFrame` to use `setTimeout` with 16ms delay (simulating 60fps).

**Implementation:**

```typescript
const rafHandles = new Map<number, NodeJS.Timeout>();
let rafId = 0;

window.requestAnimationFrame = (cb: any) => {
  const id = ++rafId;
  const timeoutId = setTimeout(() => {
    rafHandles.delete(id);
    cb(window.performance.now());
  }, 16);
  rafHandles.set(id, timeoutId);
  return id;
};

window.cancelAnimationFrame = (id: number) => {
  const timeoutId = rafHandles.get(id);
  if (timeoutId) {
    clearTimeout(timeoutId);
    rafHandles.delete(id);
  }
};
```

**Features:**

- Returns unique ID for each animation frame request
- Supports cancellation via `cancelAnimationFrame(id)`
- Uses `setTimeout` with 16ms delay (simulating 60fps)

### `patchResizeObserver(window: any): void`

Patches `window.ResizeObserver` with a mock implementation.

**Mock behavior:**

- `observe(element)` - Immediately calls callback with mocked contentRect
- `disconnect()` - No-op
- `unobserve()` - No-op

**Mocked contentRect:**

```typescript
{
  width: 100,
  height: 100
}
```

## Use Cases

### Testing Browser APIs in Node.js

```typescript
import { JSDOM } from 'jsdom';
import { applyJsdomExtended } from '@visual-coverage/jsdom-extended';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const window = dom.window as unknown as Window;
applyJsdomExtended(window);

// Test code that uses browser APIs
function getElementSize(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

const div = window.document.createElement('div');
const size = getElementSize(div);
console.log(size); // { width: 100, height: 50 }
```

### Testing Animation Code

```typescript
import { applyJsdomExtended } from '@visual-coverage/jsdom-extended';

applyJsdomExtended(window);

let frameCount = 0;
function animate() {
  frameCount++;
  if (frameCount < 10) {
    window.requestAnimationFrame(animate);
  }
}

window.requestAnimationFrame(animate);

// After 10 frames, frameCount will be 10
```

### Testing ResizeObserver

```typescript
import { applyJsdomExtended } from '@visual-coverage/jsdom-extended';

applyJsdomExtended(window);

const observer = new window.ResizeObserver((entries) => {
  entries.forEach((entry) => {
    console.log('Resized:', entry.contentRect);
  });
});

const element = window.document.createElement('div');
observer.observe(element);
// Callback is called immediately with mocked contentRect
```

## Limitations

- **Geometry mocks return fixed values** - Not suitable for tests requiring actual layout calculations
- **RAF uses setTimeout** - Timing may differ from real browser behavior
- **ResizeObserver is simplified** - Doesn't track actual size changes
- **No actual layout engine** - Elements don't have real dimensions

## Best Practices

### DO

✅ Use for unit tests that need browser API presence:

```typescript
// Test doesn't need real dimensions, just API presence
applyJsdomExtended(window);
```

✅ Apply mocks before test setup:

```typescript
beforeEach(() => {
  const dom = new JSDOM('...');
  window = dom.window;
  applyJsdomExtended(window); // Apply before tests
});
```

✅ Use individual patches if you only need specific APIs:

```typescript
patchRAF(window); // Only need RAF
```

### DON'T

❌ Don't use for layout-dependent tests:

```typescript
// Won't work - mocks return fixed values
const element = window.document.createElement('div');
element.style.width = '200px';
const rect = element.getBoundingClientRect();
console.log(rect.width); // Still 100 (mocked), not 200
```

❌ Don't rely on actual timing:

```typescript
// RAF timing is mocked, not real
window.requestAnimationFrame(() => {
  // This runs after ~16ms, but not synchronized with real frame rate
});
```

## Troubleshooting

### "getBoundingClientRect is not a function"

Make sure to apply geometry patch:

```typescript
patchGeometry(window);
// or
applyJsdomExtended(window);
```

### "requestAnimationFrame is not defined"

Make sure to apply RAF patch:

```typescript
patchRAF(window);
// or
applyJsdomExtended(window);
```

### "ResizeObserver is not defined"

Make sure to apply ResizeObserver patch:

```typescript
patchResizeObserver(window);
// or
applyJsdomExtended(window);
```

## Related Packages

- [jsdom](https://github.com/jsdom/jsdom) - DOM implementation for Node.js
- [@visual-coverage/vc-core](../core) - Core Visual Coverage SDK (uses this package in tests)

## License

MIT
# jsdom-extended
