# Zenscroll plus
Rewrited and extended version of the original zenscroll

## Install
### npm
```bash
npm i zenscroll-plus
```
### yarn
```bash
yarn add zenscroll-plus
```

## Use
```javascript
import Zenscroll from 'zenscroll-plus';

const elContainer = document.querySelector('.scrollable');
const el = elContainer.querySelector('.inner-element');
const scroll = new Zenscroll(elContainer, 500, 16);
// 500ms to animate, 16px to offset
scroll.scrollToCenterOf(el); // scroll to center of container's element
scroll.scrollToElemY(el); // scroll to container's element only along the Y axis
scroll.scrollToElemX(el); // scroll to container's element only along the X axis
scroll.scrollToCenterOfY(el) // scroll to container's element ceneter only along the Y axis
scroll.scrollToCenterOfX(el) // scroll to container's element ceneter only along the X axis
```

For more methods you can read JSDoc in the [zenscroll.js source file][1]

If you want to use transpiled version, you must import module from `zenscroll-plus/build/zenscroll`.

[1]: https://github.com/ya-kostik/zenscroll-plus/blob/master/zenscroll.js
