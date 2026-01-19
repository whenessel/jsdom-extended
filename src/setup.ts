import { patchGeometry } from './mocks/geometry';
import { patchRAF } from './mocks/raf';
import { patchResizeObserver } from './mocks/resize-observer';

/**
 * Applies the bundled jsdom-extended mocks to the provided window.
 * @param window - Window instance to patch with geometry, RAF, and ResizeObserver mocks.
 * @remarks
 * Usage (local references):
 * - None found in non-test sources.
 */
export function applyJsdomExtended(window: Window & typeof globalThis) {
  patchGeometry(window);
  patchRAF(window);
  patchResizeObserver(window);
}
