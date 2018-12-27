export {
  getElementOffset,
  throttle,
}

/**
 *
 * @param {HTMLElement} Element
 * @returns {{top: number, left: number}}
 */
function getElementOffset(Element) {
  const rect = Element.getBoundingClientRect();

  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  };
}

/**
 *
 * @param {number} milliseconds
 * @param {function} callback
 * @param {null|object} [ctx]
 * @returns {Function}
 */
function throttle(milliseconds, callback, ctx) {
  const getTime = () => new Date().getTime();
  let time = getTime();

  return function (...args) {
    const context = ctx || this;
    const currTime = getTime();

    if (currTime - time >= milliseconds) {
      time = currTime;

      callback.apply(context, args);
    }
  };
}
