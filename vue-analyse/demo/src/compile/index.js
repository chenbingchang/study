const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性的
const startTagClose = /^\s*(\/?)>/ // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// 根
let root
// 当前父元素
let currentParent
// 堆，用来匹配标签类似连连消除
let stack = []
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3

function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null
  }
}

function start(tagName, attrs) {
  // console.log(tagName, attrs)

  let element = createASTElement(tagName, attrs)

  if(!root) {
    root = element
  }
  currentParent = element
  stack.push(element)
}

function end(tagName) {
  // console.log(tagName)
  
  let element = stack.pop()
  currentParent = stack[stack.length - 1]
  
  // 判断是否存在父元素
  if(currentParent) {
    element.parent = currentParent
    currentParent.children.push(element)
  }
}

function chars(text) {
  // console.log(text)

  text = text.replace(/\s/g, '')
  if(text) {
    currentParent.children.push({
      type: TEXT_TYPE,
      text
    })
  }
}

function parseHTML(html) {
  while (html) {
    let textEnd = html.indexOf("<")
    if (textEnd == 0) {
      const startTagMatch = parseStartTag()

      if (startTagMatch) {
        // 创建虚拟元素
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        // 确定父元素和子元素
        end(endTagMatch[1])
        continue
      }
    }

    let text
    if (textEnd >= 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      // 创建虚拟文本节点，并确定父元素
      chars(text)
    }
  }

  function advance(n) {
    html = html.substring(n)
  }
  
  function parseStartTag() {
    // 匹配标签
    const start = html.match(startTagOpen)

    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      }
      advance(start[0].length)

      // 匹配标签的属性
      let attr, end
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        match.attrs.push({ name: attr[1], value: attr[3] })
      }
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }
}

function gen(node) {
  if(node.type === ELEMENT_TYPE) {
    // 元素节点
    return generate(node)
  } else {
    // 文本节点
    let text = node.text

    // 判断文本中是否存在{{ xxx }}内容
    if(!defaultTagRE.test(text)) {
      // 文本中不存在{{ xxx }}内容
      return `_v(${JSON.stringify(text)})`
    }

    // 重置RegExp的开始下标
    let lastIndex = defaultTagRE.lastIndex = 0
    let tokens = []
    let match
    let index

    // 遍历查找{{ xxx }}内容
    while(match = defaultTagRE.exec(text)) {
      index = match.index
      if(index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      // 绑定的变量用_s函数处理
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }

    if(lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }

    // 文本用_v函数处理
    return `_v(${tokens.join('+')})`
  }
}

function getChildren(el) {// 生成儿子节点
  const children = el.children

  if(children) {
    return `${children.map(c => gen(c)).join(',')}`
  } else {
    return false
  }
}

function getProps(attrs) {// 生成属性
  let str = ''

  for(let i = 0, len = attrs.length; i < len; i++) {
    let attr = attrs[i]

    if(attr.name === 'style') {
      let obj = {}

      // 分割样式，并且遍历。把字符串变成对象的形式
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }

    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }

  return `{${str.slice(0, -1)}}`
}

function generate(el) {
  let children = getChildren(el)
  // 生成渲染函数代码字符串
  let code = `_c('${el.tag}',${
    el.attrs.length ? `${getProps(el.attrs)}` : 'undefined'
  }${
    children ? `,${children}` : ''
  })`

  return code
}

export function compileToFunctions(template) {
  parseHTML(template)
  let code = generate(root)
  // with语句用法参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with
  let render = `with(this){return ${code}}`
  let renderFn = new Function(render)

  return renderFn
}
