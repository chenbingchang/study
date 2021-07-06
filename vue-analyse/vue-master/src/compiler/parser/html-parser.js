/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

import { makeMap, no } from 'shared/util'
import { isNonPhrasingTag } from 'web/compiler/util'

/*
  匹配属性
  比如：class="aa" checked  :key="item.id"
  id='cc' style=""  xxx=yyy  id = 'aaa'
*/
// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 属性
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // 命名捕获
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 开始标签的起始
const startTagClose = /^\s*(\/?)>/ // 开始标签的终点
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 结束标签
const doctype = /^<!DOCTYPE [^>]+>/i // DOCTYPE
const comment = /^<!--/ // 注释
const conditionalComment = /^<!\[/ // 条件注释结尾，以 <![ 开头

let IS_REGEX_CAPTURING_BROKEN = false
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === ''
})

// Special Elements (can contain anything)
export const isPlainTextElement = makeMap('script,style,textarea', true)
const reCache = {}

const decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
}
// 转义的特殊字符
const encodedAttr = /&(?:lt|gt|quot|amp);/g
// &#10;   是换行
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g

// #5992
const isIgnoreNewlineTag = makeMap('pre,textarea', true)
const shouldIgnoreFirstNewline = (tag, html) => tag && isIgnoreNewlineTag(tag) && html[0] === '\n'

// 解码属性
function decodeAttr (value, shouldDecodeNewlines) {
  // 需要转换的正则表达式
  const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr
  // 把转义的字符替换成正常的值；match 是匹配的子串
  return value.replace(re, match => decodingMap[match])
}

export function parseHTML (html, options) {
  const stack = [] // 维护AST节点层级的栈
  const expectHTML = options.expectHTML // 预计是HTML
  const isUnaryTag = options.isUnaryTag || no // 自闭标签映射
  const canBeLeftOpenTag = options.canBeLeftOpenTag || no // 用来检测一个标签是否是可以省略闭合标签的非自闭合标签
  // 解析到的下标
  let index = 0
  // last：存储剩余还未解析的模板字符串; lastTag：存储着位于 stack 栈顶的元素
  let last, lastTag

  // 开启一个 while 循环，循环结束的条件是 html 为空，即 html 被 parse 完毕
  while (html) {
    last = html
    // 确保即将 parse 的内容不是在纯文本标签里 (script,style,textarea)
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      let textEnd = html.indexOf('<')
      /**
       * 如果html字符串是以'<'开头,则有以下几种可能
       * 开始标签:<div>
       * 结束标签:</div>
       * 注释:<!-- 我是注释 -->
       * 条件注释:<!--[if !IE]> <![endif]-->
       * DOCTYPE:<!DOCTYPE html>
       * 需要一一去匹配尝试
       */
      if (textEnd === 0) {
        // 解析是否是注释
        // Comment:
        if (comment.test(html)) {
          const commentEnd = html.indexOf('-->')

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) { // 是否保留注释
              options.comment(html.substring(4, commentEnd))
            }
            advance(commentEnd + 3)
            continue
          }
        }

        // 解析是否是条件注释
        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          const conditionalEnd = html.indexOf(']>')

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2)
            continue
          }
        }

        // 解析是否是DOCTYPE
        // Doctype:
        const doctypeMatch = html.match(doctype)
        if (doctypeMatch) {
          advance(doctypeMatch[0].length)
          continue
        }

        // 解析是否是结束标签
        // End tag:
        const endTagMatch = html.match(endTag)
        if (endTagMatch) {
          const curIndex = index
          advance(endTagMatch[0].length)
          parseEndTag(endTagMatch[1], curIndex, index)
          continue
        }

        // 解析是否是开始标签
        // Start tag:
        const startTagMatch = parseStartTag()
        if (startTagMatch) {
          // 处理解析开始标签结果
          handleStartTag(startTagMatch)
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1)
          }
          continue
        }
      }

      let text, rest, next
      // '<' 不在第一个位置，文本开头
      if (textEnd >= 0) {
        // 如果html字符串不是以'<'开头,说明'<'前面的都是纯文本，无需处理
        // 那就把'<'以后的内容拿出来赋给rest
        rest = html.slice(textEnd)
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          /**
           * 用'<'以后的内容rest去匹配endTag、startTagOpen、comment、conditionalComment
           * 如果都匹配不上，表示'<'是属于文本本身的内容
           */
          // 在'<'之后查找是否还有'<'
          next = rest.indexOf('<', 1)
          // 如果没有了，表示'<'后面也是文本
          if (next < 0) break
          // 如果还有，表示'<'是文本中的一个字符
          textEnd += next
          // 那就把next之后的内容截出来继续下一轮循环匹配
          rest = html.slice(textEnd)
        }
        // '<'是结束标签的开始 ,说明从开始到'<'都是文本，截取出来
        text = html.substring(0, textEnd)
        advance(textEnd)
      }

      // 整个模板字符串里没有找到`<`,说明整个模板字符串都是文本
      if (textEnd < 0) {
        text = html
        html = ''
      }

      // 把截取出来的text转化成textAST
      if (options.chars && text) {
        // 调用配置的字符串钩子
        options.chars(text)
      }
    } else {
      // 父元素为script、style、textarea时，其内部的内容全部当做纯文本处理
      let endTagLength = 0
      const stackedTag = lastTag.toLowerCase()
      // 拼凑文本和结束标签的正则表达式
      const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'))
      const rest = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1')
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1)
        }
        if (options.chars) {
          options.chars(text)
        }
        return ''
      })
      index += html.length - rest.length
      html = rest
      parseEndTag(stackedTag, index - endTagLength, index)
    }

    // 将整个字符串作为文本对待
    if (html === last) {
      options.chars && options.chars(html)
      if (process.env.NODE_ENV !== 'production' && !stack.length && options.warn) {
        options.warn(`Mal-formatted tag at end of template: "${html}"`)
      }
      break
    }
  }

  // 当html === last时，需要清空所有的打开元素
  // Clean up any remaining tags
  parseEndTag()

  // 裁剪已经解析过的
  function advance (n) {
    index += n
    html = html.substring(n)
  }

  // 解析开始标签
  function parseStartTag () {
    // '<div></div>'.match(startTagOpen)  => ['<div','div',index:0,input:'<div></div>']
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1], // 标签名
        attrs: [], // 匹配到的属性数组，元素都是match结果
        start: index // 开始下标
      }
      advance(start[0].length)
      let end, attr
      /**
       * <div a=1 b=2 c=3></div>
       * 从<div之后到开始标签的结束符号'>'之前，一直匹配属性attrs
       * 所有属性匹配完之后，html字符串还剩下
       * 自闭合标签剩下：'/>'
       * 非自闭合标签剩下：'></div>'
       */
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push(attr) // 保存属性匹配的结果
      }
      /**
       * 这里判断了该标签是否为自闭合标签
       * 自闭合标签如:<input type='text' />
       * 非自闭合标签如:<div></div>
       * '></div>'.match(startTagClose) => [">", "", index: 0, input: "></div>", groups: undefined]
       * '/><div></div>'.match(startTagClose) => ["/>", "/", index: 0, input: "/><div></div>", groups: undefined]
       * 因此，我们可以通过end[1]是否是"/"来判断该标签是否是自闭合标签
       */
      if (end) {
        match.unarySlash = end[1] // 保存自闭合结果
        advance(end[0].length)
        match.end = index // 结束下标

        return match // 返回解析结果
      }
    }
  }

  // 处理开始标签
  function handleStartTag (match) {
    const tagName = match.tagName // 开始标签的标签名
    const unarySlash = match.unarySlash // 是否为自闭合标签的标志，自闭合为"/",非自闭合为""

    // 如果HTML标签
    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag)
      }
      // 如果当前标签是可以省略结束标签，并且和当前标签相等
      if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
        parseEndTag(tagName) // 处理结束标签
      }
    }

    const unary = isUnaryTag(tagName) || !!unarySlash // 布尔值，标志是否为自闭合标签，如：link/img/input

    const l = match.attrs.length // match.attrs 数组的长度
    const attrs = new Array(l) // 一个与match.attrs数组长度相等的数组
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i]
      // 使用交替捕获多个匹配项的 Javascript 正则表达式将某些结果的捕获字段设置为未定义
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        // 如果总的匹配中没有找到包裹的双引号，则把3/4/5中的空字符串清空
        if (args[3] === '') { delete args[3] }
        if (args[4] === '') { delete args[4] }
        if (args[5] === '') { delete args[5] }
      }
      // 属性的值
      const value = args[3] || args[4] || args[5] || ''
      attrs[i] = {
        name: args[1], // 属性名称
        // 属性值
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      }
    }

    if (!unary) {
      // 不是自闭合标签。要放到AST节点层级中
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs })
      // 栈顶元素
      lastTag = tagName
    }

    // 调用配置参数里面的start钩子创建AST节点
    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }

  // 解析结束标签
  function parseEndTag (tagName, start, end) {
    // pos：标签在stack中的下标；lowerCasedTagName：标签名的小写；
    let pos, lowerCasedTagName
    if (start == null) start = index
    if (end == null) end = index

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase() // 转成小写
    }

    // 如果标签名存在
    // Find the closest opened tag of the same type
    if (tagName) {
      // 在stack中找到名称一样的标签，并记录位置
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // 标签名不存在，清空stack
      // If no tag name is provided, clean shop
      pos = 0
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        /* 正常情况下，stack栈的栈顶元素应该和当前的结束标签tagName 匹配，也就是说正常的pos应该是栈顶位置，
        后面不应该再有元素，如果后面还有元素，那么后面的元素就都缺少闭合标签 */
        if (process.env.NODE_ENV !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            `tag <${stack[i].tag}> has no matching end tag.`
          )
        }
        if (options.end) {
          // 调用关闭标签钩子
          options.end(stack[i].tag, start, end)
        }
      }

      // 删除已经关闭的标签
      // Remove the open elements from the stack
      stack.length = pos
      lastTag = pos && stack[pos - 1].tag // 保存栈顶的标签名
    } else if (lowerCasedTagName === 'br') {
      /*
      浏览器会自动把</br>标签解析为正常的 <br>标签，而对于</p>浏览器则自动将其补全为<p></p>，
      所以Vue为了与浏览器对这两个标签的行为保持一致，故对这两个便签单独判断处理
      */
      if (options.start) {
        options.start(tagName, [], true, start, end) // 创建<br>AST节点
      }
    } else if (lowerCasedTagName === 'p') {
      // 补全p标签并创建AST节点
      if (options.start) {
        options.start(tagName, [], false, start, end)
      }
      if (options.end) {
        options.end(tagName, start, end)
      }
    }
  }
}
