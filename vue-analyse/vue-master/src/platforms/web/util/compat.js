/* @flow */

import { inBrowser } from 'core/util/index'

// check whether current browser encodes a char inside attribute values
function shouldDecode (content: string, encoded: string): boolean {
  const div = document.createElement('div')
  div.innerHTML = `<div a="${content}"/>`
  return div.innerHTML.indexOf(encoded) > 0
}

// IE在属性值内编码换行，而其他浏览器则不编码
// #3663
// IE encodes newlines inside attribute values while other browsers don't
export const shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false
