/**
 * Checks if a URL is valid. A URL's definition of valid in this context is a URL is a valid HTTP URL:
 * For example:
 * * http://example.com - valid
 * * https://example.com - valid
 * * ipfs://example.com - invalid
 * * exmaple.com - invalid
 * @param {string} input - the string to test.
 * @returns {boolean} true if the URL is valid, false otherwise.
 */
export default function isValidUrl(input: string): boolean {
  try {
    const url: URL = new URL(input);

    return new RegExp('^(http|https):', 'i').test(url.protocol);
  } catch (_) {
    // if a TypeError is thrown, it is invalid
    return false;
  }
}
