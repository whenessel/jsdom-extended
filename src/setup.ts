import { patchGeometry } from './mocks/geometry';
import { patchRAF } from './mocks/raf';
import { patchResizeObserver } from './mocks/resize-observer';
import { patchLocation } from './mocks/location';

/**
 * Applies the bundled jsdom-extended mocks to the provided window.
 * @param window - Window instance to patch with geometry, RAF, ResizeObserver, and location helpers.
 * @remarks
 * Usage (local references):
 * - None found in non-test sources.
 */
export function applyJsdomExtended(window: Window & typeof globalThis) {
  patchGeometry(window);
  patchRAF(window);
  patchResizeObserver(window);
  patchLocation(window);
}
