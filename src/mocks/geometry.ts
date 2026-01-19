/**
 * Applies geometry-related mocks to the provided window.
 * @param win - Window instance to patch with geometry helpers.
 * @remarks
 * Usage (local references):
 * - packages/jsdom-extended/src/setup.ts:13-13 - call; applied as part of the default jsdom-extended setup.
 */
export function patchGeometry(win: Window & typeof globalThis) {
  Object.defineProperty(win.HTMLElement.prototype, 'getBoundingClientRect', {
    value() {
      return {
        width: 100,
        height: 50,
        top: 0,
        left: 0,
        bottom: 50,
        right: 100,
        x: 0,
        y: 0,
      };
    },
  });

  // win.innerWidth = 1280;
  // win.innerHeight = 720;
  Object.defineProperty(win, 'innerWidth', {
    value: 1280,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(win, 'innerHeight', {
    value: 720,
    writable: true,
    configurable: true,
  });
}
