/**
 * Zenscroll 4.0.0
 * https://github.com/zengabor/zenscroll/
 *
 * Copyright 2015–2017 Gabor Lenard
 *
 * Zenscroll-plus 5.0.0
 * Copyright 2017 Constantin Tsukanov
 *
 * This is free and unencumbered software released into the public domain.
 *
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 *
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * For more information, please refer to <http://unlicense.org>
 *
 */


/**
 * Simple class for scroll to elements
 * @class Zenscroll
 * @prop {DOMElement} container  element's parent container
 * @prop {Number}     duration   duration to scroll
 * @prop {Number}     edgeOffset additional offset
 * @prop {Mixed}      scrollTimeoutIdX timeout id for X scrolling
 * @prop {Mixed}      scrollTimeoutIdY timeout id for Y scrolling
 * @prop {Number}     x                current left scroll of container
 * @prop {Number}     y                current top scroll of container
 * @prop {Boolean}    isNativeSmoothScrollEnabled flag, name talking about himself
 * @param {DOMElement} container  element's parent container
 * @param {Number}     duration   duration to scroll
 * @param {Number}     edgeOffset additional offset
 */
class Zenscroll {
  constructor(container, duration, edgeOffset) {
    this.container = container;

    duration = parseInt(duration);
    if (isNaN(duration)) this.duration = 999;
    else this.duration = duration;

    edgeOffset = parseInt(edgeOffset);
    if (isNaN(edgeOffset)) this.edgeOffset = 9;
    else this.edgeOffset = edgeOffset;

    this.__props = {
      scrollTimeoutIdX: null,
      scrollTimeoutIdY: null
    }

    this.stopScroll = this.stopScroll.bind(this);
  }

  get scrollTimeoutIdX() {
    return this.__props.scrollTimeoutIdX;
  }

  get scrollTimeoutIdY() {
    return this.__props.scrollTimeoutIdY;
  }

  set scrollTimeoutIdY(value) {
    this.__props.scrollTimeoutIdY = value;
    return value;
  }

  set scrollTimeoutIdX(value) {
    this.__props.scrollTimeoutIdX = value;
    return value;
  }

  get y() {
    if (this.container === window.document.body) {
      return window.scrollY;
    }
    return this.container.scrollTop;
  }

  get x() {
    if (this.container === window.document.body) {
      return window.scrollX;
    }
    return this.container.scrollLeft;
  }

  get isNativeSmoothScrollEnabled() {
    return ('getComputedStyle' in window) &&
      window.getComputedStyle(this.container)['scroll-behavior'] === 'smooth'
  }

  /**
   * stop scroll
   * @return {Zenscroll} this
   */
  stopScroll() {
    this.stopScrollX();
    this.stopScrollY();
    return this;
  }

  /**
   * stop X scroll
   * @return {Zenscroll} this
   */
  stopScrollX() {
    if (this.scrollTimeoutIdX) {
      clearTimeout(this.scrollTimeoutIdX);
    }
    this.scrollTimeoutIdX = null;
    return this;
  }

  /**
   * stop Y scroll
   * @return {Zenscroll} this
   */
  stopScrollY() {
    if (this.scrollTimeoutIdY) {
      clearTimeout(this.scrollTimeoutIdY);
    }
    this.scrollTimeoutIdY = null;
    return this;
  }

  /**
   * get top element's value
   * @param {DOMElement} el element
   * @return {Number} top of element
   */
  getTopOf(el) {
    return el.offsetTop
  }

  /**
   * get top element's value with edge offset
   * @param {DOMElement} el element
   * @return {Number} top of element
   */
  getTopWithEdgeOffsetOf(el) {
    return Math.max(0, this.getTopOf(el) - this.edgeOffset);
  }

  /**
   * get left element's value
   * @param {DOMElement} el element
   * @return {Number} left of element
   */
  getLeftOf(el) {
    return el.offsetLeft;
  }

  /**
   * get left element's value with edge offset
   * @param {DOMElement} el element
   * @return {Number} left of element
   */
  getLeftWithEdgeOffsetOf(el) {
    return Math.max(0, this.getLeftOf(el) - this.edgeOffset);
  }

  /**
   * get container height
   * @return {Number} height of container
   */
  getHeight() {
    if (this.container === window.document.body) {
      return window.innerHeight
    }
    return this.container.clientHeight;
  }

  /**
   * get width of container
   * @return {Number} width of container
   */
  getWidth() {
    if (this.container === window.document.body) {
      return window.innerWidth
    }
    return this.container.clientWidth;
  }

  /**
   * scroll to Y
   * @param  {Number} y coord
   * @return {Zenscroll} this
   */
  toY(y) {
    if (this.container === window.document.body) {
      window.scrollTo(0, y);
    } else {
      this.container.scrollTop = y;
    }
    return this;
  }

  /**
   * scroll to Y
   * @param  {Number} x coord
   * @return {Zenscroll} this
   */
  toX(x) {
    if (this.container === window.document.body) {
      window.scrollTo(x, 0);
    } else {
      this.container.scrollLeft = x;
    }
    return this;
  }

  /**
   * calculate duration and return it
   * @param  {Number} duration start duration
   * @return {Number} duration
   */
  getDuration(duration) {
    if (!duration) {
      if (this.duration) {
        duration = this.duration;
      } else {
        duration = 300;
      }
    }
    return duration;
  }

  /**
   * scroll to x and y container's destination
   * @param  {Number} targetX  coord
   * @param  {Number} targetY  coord
   * @param  {Number} duration
   * @return {Promise}
   */
  scrollTo(targetX, targetY, duration) {
    return Promise.all([
      this.scrollToX(targetX, duration), this.scrollToY(targetY, duration)
    ]);
  }

  /**
   * scroll to center of container's element
   * @param  {DOMElement} el container's element
   * @param  {Number} duration
   * @param  {Number} offset
   * @return {Promise}
   */
  scrollToCenterOf(el, duration, offset) {
    return this.scrollTo(
      Math.max(0, this.getLeftOf(el) - this.getWidth() / 2 + (offset || el.getBoundingClientRect().width / 2)),
      Math.max(0, this.getTopOf(el) - this.getHeight() / 2 + (offset || el.getBoundingClientRect().height / 2)),
      duration
    )
  }

  /**
   * scroll to Y coord of container
   * @param  {Number} targetY  coord
   * @param  {Number} duration
   * @return {Promise}
   */
  scrollToY(targetY, duration) {
    this.stopScrollY();
    if (duration === 0 || (duration && duration < 0) || this.isNativeSmoothScrollEnabled) {
      this.toY(targetY)
      return Promise.resolve();
    } else {
      var startY = this.y
      var distance = Math.max(0, targetY) - startY
      var startTime = new Date().getTime()
      duration = duration || Math.min(Math.abs(distance), this.duration);
      return new Promise((resolve) => {
        const loopScroll = () => {
          this.scrollTimeoutIdY = setTimeout(() => {
            // Calculate percentage:
            var p = Math.min(1, (new Date().getTime() - startTime) / duration)
            // Calculate the absolute vertical position:
            var y = Math.max(0, Math.floor(startY + distance * (p < 0.5 ? 2 * p * p : p * (4 - p * 2) - 1)))
            this.toY(y)
            if (p < 1 && (this.getHeight() + y) < this.container.scrollHeight) {
              loopScroll();
            } else {
              setTimeout(this.stopScrollY, 99) // with cooldown time
              resolve();
            }
          }, 9)
        }
        loopScroll();
      });
    }
  }

  /**
   * scroll to element of container only along the Y axis
   * @param  {DOMElement} el   container's element
   * @param  {Number} duration
   * @return {Promise}
   */
  scrollToElemY(el, duration) {
    return this.scrollToY(this.getTopWithEdgeOffsetOf(el), duration);
  }

  scrollIntoViewY(el, duration) {
    var elemHeight = el.getBoundingClientRect().height
    var elemBottom = this.getTopOf(el) + elemHeight
    var containerHeight = this.getHeight();
    var y = this.y;
    var containerBottom = y + containerHeight;
    if (this.getTopWithEdgeOffsetOf(el) < y || (elemHeight + this.edgeOffset) > containerHeight) {
      // Element is clipped at top or is higher than screen.
      return this.scrollToElemY(el, duration)
    } else if ((elemBottom + this.edgeOffset) > containerBottom) {
      // Element is clipped at the bottom.
      return this.scrollToY(elemBottom - containerHeight + this.edgeOffset, duration)
    } else {
      return Promise.resolve();
    }
  }

  /**
   * scroll to center of container's element only along the Y axis
   * @param  {DOMElement} el       container's element
   * @param  {Number} duration
   * @param  {Number} offset
   * @return {Promise}
   */
  scrollToCenterOfY(el, duration, offset) {
    return this.scrollToY(Math.max(0, this.getTopOf(el) - this.getHeight() / 2 + (offset || el.getBoundingClientRect().height / 2)), duration)
  }

  /**
   * scroll to X coord of container
   * @param  {Number} targetX  coord
   * @param  {Number} duration
   * @return {Promise}
   */
  scrollToX(targetX, duration) {
    this.stopScrollX();
    if (duration === 0 || (duration && duration < 0) || this.isNativeSmoothScrollEnabled) {
      this.toX(targetX)
      return Promise.resolve();
    } else {
      var startX = this.x
      var distance = Math.max(0, targetX) - startX
      var startTime = new Date().getTime()
      duration = duration || Math.min(Math.abs(distance), this.duration);
      return new Promise((resolve) => {
        const loopScroll = () => {
          this.scrollTimeoutIdX = setTimeout(() => {
            // Calculate percentage:
            var p = Math.min(1, (new Date().getTime() - startTime) / duration)
            // Calculate the absolute vertical position:
            var x = Math.max(0, Math.floor(startX + distance * (p < 0.5 ? 2 * p * p : p * (4 - p * 2) - 1)))
            this.toX(x)
            if (p < 1 && (this.getHeight() + x) < this.container.scrollWidth) {
              loopScroll();
            } else {
              setTimeout(this.stopScrollX, 99) // with cooldown time
              resolve();
            }
          }, 9)
        }
        loopScroll();
      });
    }
  }

  /**
    * scroll to element of container only along the X axis
    * @param  {DOMElement} el   container's element
    * @param  {Number} duration
    * @return {Promise}
    */
  scrollToElemX(el, duration) {
    return this.scrollToX(this.getLeftWithEdgeOffsetOf(el), duration);
  }

  scrollIntoViewX(el, duration) {
    var elemWidth = el.getBoundingClientRect().width;
    var elemRigth = this.getLeftOf(el) + elemWidth;
    var containerWidth = this.getWidth();
    var x = this.x;
    var containerRight = x + containerWidth;
    if (this.getLeftWithEdgeOffsetOf(el) < x || (elemWidth + this.edgeOffset) > containerWidth) {
      // Element is clipped at top or is higher than screen.
      return this.scrollToElemX(el, duration)
    } else if ((elemRigth + this.edgeOffset) > containerRight) {
      // Element is clipped at the bottom.
      return this.scrollToX(elemRigth - containerWidth + this.edgeOffset, duration)
    } else {
      return Promise.resolve();
    }
  }

  /**
   * scroll to center of container's element only along the Y axis
   * @param  {DOMElement} el       container's element
   * @param  {Number} duration
   * @param  {Number} offset
   * @return {Promise}
   */
  scrollToCenterOfX(el, duration, offset) {
    return this.scrollToX(Math.max(0, this.getLeftOf(el) - this.getWidth() / 2 + (offset || el.getBoundingClientRect().width / 2)), duration)
  }

  /**
   * freeze this
   * @return {Zenscroll} this
   */
  freeze() {
    Object.freeze(this);
    return this;
  }
}

export default Zenscroll;
