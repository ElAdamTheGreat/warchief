// REQUIREMENT: JS SVG work (2pt) – SVG utility helpers

/**
 * Creates a namespaced SVG element with standard attributes.
 * @param {string} tag - The SVG element tag name (e.g., 'circle', 'path').
 * @param {Object} attrs - Key-value map of attributes to set.
 * @returns {SVGElement} The created SVG element.
 */
export function createSvgElement(tag, attrs = {}) {
  const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, val] of Object.entries(attrs)) {
    elem.setAttribute(key, val);
  }
  return elem;
}

/**
 * Creates an SVG text element.
 * @param {string} content - The text content.
 * @param {Object} attrs - SVG text attributes.
 * @returns {SVGTextElement} The created SVG text element.
 */
export function createSvgText(content, attrs = {}) {
  const textElem = createSvgElement('text', attrs);
  textElem.textContent = content;
  return textElem;
}

/**
 * Creates an SVG circle element.
 * @param {number} cx - Center X.
 * @param {number} cy - Center Y.
 * @param {number} r - Radius.
 * @param {Object} attrs - Additional circle attributes.
 * @returns {SVGCircleElement} The created SVG circle.
 */
export function createCircle(cx, cy, r, attrs = {}) {
  return createSvgElement('circle', { cx, cy, r, ...attrs });
}
