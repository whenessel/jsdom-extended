/**
 * Minimal ResizeObserver mock that immediately reports a fixed contentRect.
 * @remarks
 * Usage (local references):
 * - packages/jsdom-extended/src/mocks/resize-observer.ts:32-32 - value-ref; installed on the window by patchResizeObserver.
 */
export class FakeResizeObserver {
  private cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
  }
  observe(el: Element) {
    this.cb(
      [
        { target: el, contentRect: { width: 100, height: 100 } },
      ] as ResizeObserverEntry[],
      this as unknown as ResizeObserver,
    );
  }
  disconnect() {}
  unobserve() {}
}

/**
 * Installs the FakeResizeObserver on the provided window.
 * @param win - Window instance to patch with ResizeObserver support.
 * @remarks
 * Usage (local references):
 * - packages/jsdom-extended/src/setup.ts:15-15 - call; applied as part of the default jsdom-extended setup.
 */
export function patchResizeObserver(win: Window & typeof globalThis) {
  win.ResizeObserver = FakeResizeObserver as typeof ResizeObserver;
}
