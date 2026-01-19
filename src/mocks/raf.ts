const rafHandles = new Map<number, NodeJS.Timeout>();

/**
 * Installs a requestAnimationFrame/cancelAnimationFrame shim on the window.
 * @param win - Window instance to patch with RAF shims.
 * @remarks
 * Usage (local references):
 * - packages/jsdom-extended/src/setup.ts:14-14 - call; applied as part of the default jsdom-extended setup.
 */
export function patchRAF(win: Window & typeof globalThis) {
  let rafId = 0;
  win.requestAnimationFrame = (cb: FrameRequestCallback) => {
    const id = ++rafId;
    const timeoutId = setTimeout(() => {
      rafHandles.delete(id);
      cb(win.performance.now());
    }, 16);
    rafHandles.set(id, timeoutId);
    return id;
  };

  win.cancelAnimationFrame = (id: number) => {
    const timeoutId = rafHandles.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      rafHandles.delete(id);
    }
  };
}
