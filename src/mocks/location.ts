/**
 * Ensures window.location is properly configured with a valid URL.
 * Warns if location is about:blank to guide proper JSDOM setup.
 * @param win - Window instance to validate
 * @remarks
 * Usage (local references):
 * - packages/jsdom-extended/src/setup.ts - call; applied as part of the default jsdom-extended setup.
 */
export function patchLocation(win: Window & typeof globalThis): void {
  if (win.location.href === 'about:blank') {
    console.warn(
      '[jsdom-extended] window.location is about:blank. ' +
      'For full location support, create JSDOM with a URL: ' +
      'new JSDOM(html, { url: "http://localhost/" })'
    );
  }
}

/**
 * Checks if window.location has a valid URL.
 * @param win - Window instance to check
 * @returns true if location has a valid origin, false if it's about:blank
 */
export function hasValidLocation(win: Window & typeof globalThis): boolean {
  return win.location.href !== 'about:blank';
}

/**
 * Navigates the window to a new URL by setting location.href.
 * Useful for testing navigation and URL changes.
 * @param win - Window instance
 * @param url - URL to navigate to
 * @remarks
 * Note: JSDOM has limited navigation support. Navigating to a different
 * document will log "Not implemented: navigation to another Document".
 * For testing URL changes, create a new JSDOM instance with the desired URL.
 */
export function navigateTo(win: Window & typeof globalThis, url: string): void {
  win.location.href = url;
}

/**
 * Gets the current location details as a plain object.
 * Useful for testing and assertions.
 * @param win - Window instance
 * @returns Object with all location properties
 */
export function getLocationInfo(win: Window & typeof globalThis) {
  const { href, origin, protocol, host, hostname, port, pathname, search, hash } = win.location;
  return { href, origin, protocol, host, hostname, port, pathname, search, hash };
}
