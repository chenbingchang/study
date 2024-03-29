/* @flow */

import he from 'he'
import { parseHTML } from './html-parser'
import { parseText } from './text-parser'
import { parseFilters } from './filter-parser'
import { cached, no, camelize } from 'shared/util'
import { genAssignmentCode } from '../directives/model'
import { isIE, isEdge, isServerRendering } from 'core/util/env'

import {
  addProp,
  addAttr,
  baseWarn,
  addHandler,
  addDirective,
  getBindingAttr,
  getAndRemoveAttr,
  pluckModuleFunction
} from '../helpers'

export const onRE = /^@|^v-on:/ // 事件绑定属性
export const dirRE = /^v-|^@|^:/ // 指令、事件、绑定值
export const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/ // v-for别名正则，非贪婪?只能出现在*或+后面
export const forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/ // 迭代正则，每次循环的变量

const argRE = /:(.*)$/ // 参数正则
const bindRE = /^:|^v-bind:/ // bind正则
const modifierRE = /\.[^.]+/g // 修饰符正则

// 缓存解码的HTML字符串
const decodeHTMLCached = cached(he.decode)

// configurable state
export let warn: any
let delimiters
let transforms
let preTransforms
let postTransforms
let platformIsPreTag
let platformMustUseProp
let platformGetTagNamespace

type Attr = { name: string; value: string };

export function createASTElement (
  tag: string, // 标签名
  attrs: Array<Attr>, // 属性
  parent: ASTElement | void // 父级
): ASTElement {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent,
    children: []
  }
}

/**
 * 转换HTML字符串到AST(抽象语法树)
 * Convert HTML string to AST.
 */
export function parse (
  template: string,
  options: CompilerOptions
): ASTElement | void {
  // 警告
  warn = options.warn || baseWarn

  platformIsPreTag = options.isPreTag || no // 是否是pre标签
  platformMustUseProp = options.mustUseProp || no // 是否必须使用属性来绑定值
  platformGetTagNamespace = options.getTagNamespace || no // 获取标签的命名空间

  // 截取各模块对应的函数放到数组里面
  transforms = pluckModuleFunction(options.modules, 'transformNode')
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')

  delimiters = options.delimiters

  const stack = [] // AST堆栈
  const preserveWhitespace = options.preserveWhitespace !== false
  let root // 根结点
  let currentParent // 当前的父级
  let inVPre = false // AST是否有v-pre指令，有的话可以跳过编译
  let inPre = false // AST是否是pre标签，pre标签里面的内容需要原样输出
  let warned = false // 是否有警告

  // 只警告一次
  function warnOnce (msg) {
    if (!warned) {
      warned = true
      warn(msg)
    }
  }

  // 结束pre
  function endPre (element) {
    // 检查pre的状态，如果是pre则重置inVPre
    // check pre state
    if (element.pre) {
      inVPre = false
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false
    }
  }

  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldKeepComment: options.comments, // 是否保留注释
    // 开始标签。标签名tag；标签属性attrs；标签是否自闭合unary；
    start (tag, attrs, unary) {
      // 标签的命名空间
      // check namespace.
      // inherit parent ns if there is one
      const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag)

      // 处理IE svg的bug
      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs)
      }

      // 创建抽象语法树
      let element: ASTElement = createASTElement(tag, attrs, currentParent)
      if (ns) {
        element.ns = ns
      }

      // 不解析的标签style/script
      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true
        process.env.NODE_ENV !== 'production' && warn(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          `<${tag}>` + ', as they will not be parsed.'
        )
      }

      // 预转换
      // apply pre-transforms
      for (let i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element
      }

      if (!inVPre) {
        // 判断是否有v-pre指令
        processPre(element)
        if (element.pre) {
          inVPre = true
        }
      }
      // 是否是pre标签
      if (platformIsPreTag(element.tag)) {
        inPre = true
      }
      // 如果有v-pre指令，处理原始属性
      if (inVPre) {
        processRawAttrs(element)
      } else if (!element.processed) {
        // 如果没有被处理过，则处理
        // structural directives  结构指令
        processFor(element) // v-for
        processIf(element) // v-if
        processOnce(element) // v-once
        // element-scope stuff
        processElement(element, options) // 处理DOM相关的数据
      }

      // 检查根节点约束
      function checkRootConstraints (el) {
        if (process.env.NODE_ENV !== 'production') {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              `Cannot use <${el.tag}> as component root element because it may ` +
              'contain multiple nodes.'
            )
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            )
          }
        }
      }

      // tree management 根节点
      if (!root) {
        // 没有根节点，则当前的元素就是根节点
        root = element
        checkRootConstraints(root)
      } else if (!stack.length) {
        /*
          root在解析HTML中不会清空。有根节点，并且stack为空数组。如下：
          <template>
            <div v-if="isHello">Hello</div>
            <div v-else>Hi</div>
          </template>
        */
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element)
          addIfCondition(root, {
            exp: element.elseif, // 如果是element.else则elseif为undefined，判断时!exp为true就算成功
            block: element // 条件表达式对应的AST
          })
        } else if (process.env.NODE_ENV !== 'production') {
          warnOnce(
            `Component template should contain exactly one root element. ` +
            `If you are using v-if on multiple elements, ` +
            `use v-else-if to chain them instead.`
          )
        }
      }
      if (currentParent && !element.forbidden) {
        // 有父级，并且当前元素不是禁止的
        if (element.elseif || element.else) { // 处理v-else(-if)
          processIfConditions(element, currentParent)
        } else if (element.slotScope) { // scoped slot  作用域插槽
          currentParent.plain = false
          const name = element.slotTarget || '"default"' // 目标插槽
          ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element // 保存作用域插槽
        } else {
          currentParent.children.push(element) // 父级保存子级
          element.parent = currentParent // 子级保存父级
        }
      }
      // 如果没有闭合
      if (!unary) {
        currentParent = element // 当前父级指向  当前节点
        stack.push(element) // 添加到堆栈
      } else {
        // 已经闭合
        endPre(element)
      }
      // apply post-transforms
      for (let i = 0; i < postTransforms.length; i++) {
        postTransforms[i](element, options)
      }
    },
    // 结束标签
    end () {
      // remove trailing whitespace
      const element = stack[stack.length - 1]
      const lastNode = element.children[element.children.length - 1]
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        // 删除尾随空格节点
        element.children.pop()
      }
      // pop stack  删除最后一个节点
      stack.length -= 1
      currentParent = stack[stack.length - 1] // 变更当前的父级
      endPre(element)
    },
    // 当解析到标签的文本时，触发chars
    chars (text: string) {
      // 如果没有父级，文本AST报错
      if (!currentParent) {
        if (process.env.NODE_ENV !== 'production') {
          if (text === template) {
            // 组件模板需要根元素，而不是只有文本
            warnOnce(
              'Component template requires a root element, rather than just text.'
            )
          } else if ((text = text.trim())) {
            // 根节点外的文本将被忽略
            warnOnce(
              `text "${text}" outside root element will be ignored.`
            )
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      const children = currentParent.children // 父级子节点
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : ''
      if (text) { // text是带变量的动态文本
        let expression
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2, // 动态文本
            expression, // 表达式
            text
          })
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3, // 静态文本
            text
          })
        }
      }
    },
    // 注释节点
    comment (text: string) {
      currentParent.children.push({
        type: 3, // 静态文本，注释节点都是静态的
        text,
        isComment: true
      })
    }
  })
  return root
}

// 处理v-pre指令。v-pre表示跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签
function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true // 标记是pre标签
  }
}

// 处理原始属性
function processRawAttrs (el) {
  const l = el.attrsList.length
  if (l) {
    // 从attrsList属性，移到attrs属性
    const attrs = el.attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      }
    }
  } else if (!el.pre) {
    // 没有任何属性，则标记简单
    // non root node in pre blocks with no attributes
    el.plain = true
  }
}

// 处理AST
export function processElement (element: ASTElement, options: CompilerOptions) {
  processKey(element) // 处理key

  // 在删除结构属性后确定此元素是否为普通元素
  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length

  processRef(element) // 处理ref
  processSlot(element) // 处理插槽相关
  processComponent(element) // 处理内置组件Component
  // 遍历调用所有的转换对AST进行处理
  for (let i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element
  }
  processAttrs(element) // 处理属性数组
}

// 处理key属性
function processKey (el) {
  // 获取绑定的key属性
  const exp = getBindingAttr(el, 'key')
  if (exp) {
    // 警告，template中的key
    if (process.env.NODE_ENV !== 'production' && el.tag === 'template') {
      warn(`<template> cannot be keyed. Place the key on real elements instead.`)
    }
    el.key = exp // 保存表达式或值
  }
}

// 处理ref属性
function processRef (el) {
  // 获取绑定的ref属性
  const ref = getBindingAttr(el, 'ref')
  if (ref) {
    el.ref = ref // 保存表达式或值
    el.refInFor = checkInFor(el) // 是否是v-for中的ref
  }
}

// 处理v-for指令
export function processFor (el: ASTElement) {
  let exp
  // 获取v-for属性值
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    const inMatch = exp.match(forAliasRE)
    if (!inMatch) {
      // 没有匹配，警告，返回
      process.env.NODE_ENV !== 'production' && warn(
        `Invalid v-for expression: ${exp}`
      )
      return
    }
    el.for = inMatch[2].trim() // 循环的变量
    // 每项的别名，如(item, index, arr)、item、({name, age, desc}, index, arr)
    const alias = inMatch[1].trim()
    const iteratorMatch = alias.match(forIteratorRE)
    if (iteratorMatch) {
      // 匹配成功
      el.alias = iteratorMatch[1].trim() // 元素值，有可能是解构赋值
      el.iterator1 = iteratorMatch[2].trim() // 元素下标
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim() // 元素所在的数组
      }
    } else {
      // 匹配失败，则只有一个参数即元素值
      el.alias = alias
    }
  }
}

// 处理v-if指令
function processIf (el) {
  // 获取v-if属性值
  const exp = getAndRemoveAttr(el, 'v-if')
  if (exp) {
    // 有v-if
    el.if = exp // 保存表达式
    addIfCondition(el, {
      exp: exp,
      block: el
    })
  } else {
    // 判断是否是v-else
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true // 标记v-else
    }
    // 获取v-else-if
    const elseif = getAndRemoveAttr(el, 'v-else-if')
    if (elseif) {
      el.elseif = elseif // 保存表达式
    }
  }
}

// 处理v-else和v-else-if条件表达式，在父级中找到前面有v-if的节点，然后添加到v-if的节点哪里
function processIfConditions (el, parent) {
  const prev = findPrevElement(parent.children)
  if (prev && prev.if) {
    // 找到v-if节点，添加表达式
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    })
  } else if (process.env.NODE_ENV !== 'production') {
    // 警告，有v-elseif或者v-else，而前面没有v-if
    warn(
      `v-${el.elseif ? ('else-if="' + el.elseif + '"') : 'else'} ` +
      `used on element <${el.tag}> without corresponding v-if.`
    )
  }
}

// 在子节点中找到前面一个元素节点
function findPrevElement (children: Array<any>): ASTElement | void {
  let i = children.length
  // 倒序查找
  while (i--) {
    // 判断节点类型
    if (children[i].type === 1) {
      // 元素节点，直接返回
      return children[i]
    } else {
      // 非元素节点
      if (process.env.NODE_ENV !== 'production' && children[i].text !== ' ') {
        // 文本节点。警告，v-if和v-else(-if)之间的文本节点会被忽略
        warn(
          `text "${children[i].text.trim()}" between v-if and v-else(-if) ` +
          `will be ignored.`
        )
      }
      // 删除v-if和v-else(-if)之间的文本节点
      children.pop()
    }
  }
}

// 添加if条件
export function addIfCondition (el: ASTElement, condition: ASTIfCondition) {
  if (!el.ifConditions) {
    el.ifConditions = [] // 初始化
  }
  el.ifConditions.push(condition) // 保存到数组
}

// 处理v-once指令。只渲染元素和组件一次
function processOnce (el) {
  const once = getAndRemoveAttr(el, 'v-once')
  if (once != null) {
    el.once = true
  }
}

// 处理slot
function processSlot (el) {
  if (el.tag === 'slot') {
    // slot标签
    // 获取绑定的name属性，即具名插槽
    el.slotName = getBindingAttr(el, 'name')
    // 警告slot不能有key属性
    if (process.env.NODE_ENV !== 'production' && el.key) {
      warn(
        `\`key\` does not work on <slot> because slots are abstract outlets ` +
        `and can possibly expand into multiple elements. ` +
        `Use the key on a wrapping element instead.`
      )
    }
  } else {
    // 不是slot标签
    let slotScope
    if (el.tag === 'template') {
      // template标签
      // 已抛弃的插槽作用域写法
      slotScope = getAndRemoveAttr(el, 'scope')
      // template有scope属性警告，应该使用slot-scope
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && slotScope) {
        warn(
          `the "scope" attribute for scoped slots have been deprecated and ` +
          `replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ` +
          `can also be used on plain elements in addition to <template> to ` +
          `denote scoped slots.`,
          true
        )
      }
      // 插槽作用域
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      // slot-scope属性，可以写在所有标签
      el.slotScope = slotScope
    }
    // 目标插槽
    const slotTarget = getBindingAttr(el, 'slot')
    if (slotTarget) {
      // 为空，则默认default
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (!el.slotScope) {
        addAttr(el, 'slot', slotTarget)
      }
    }
  }
}

// 处理内置组件Component
function processComponent (el) {
  let binding
  // 获取绑定is属性
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding // 保存表达式或值
  }
  // 内联模板
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true // 标记是内联模板
  }
}

// 处理属性数组
function processAttrs (el) {
  const list = el.attrsList // 属性列表
  let i, l, name, rawName, value, modifiers, isProp
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name // 属性名
    value = list[i].value // 属性值
    // 判断属性名是否是指令、事件、绑定值
    if (dirRE.test(name)) {
      // 指令、事件、绑定值属性
      // mark element as dynamic  将元素标记为动态
      el.hasBindings = true
      // modifiers  修饰符对象
      modifiers = parseModifiers(name)
      if (modifiers) {
        name = name.replace(modifierRE, '') // 去掉修饰符
      }
      if (bindRE.test(name)) { // v-bind指令
        name = name.replace(bindRE, '') // 去掉v-bind指令的特征
        value = parseFilters(value) // 属性值需要解析过滤器
        isProp = false
        // 是否有修饰符
        if (modifiers) {
          // v-bind .prop修饰符，作为一个 DOM property 绑定而不是作为 attribute 绑定
          if (modifiers.prop) {
            isProp = true
            name = camelize(name) // 驼峰命名
            // innerHtml特殊处理，保证和DOM的属性一致
            if (name === 'innerHtml') name = 'innerHTML'
          }
          // .camel 是否转为驼峰命名
          if (modifiers.camel) {
            name = camelize(name)
          }
          // .sync  语法糖，会扩展成一个更新父组件绑定值的 v-on 侦听器
          if (modifiers.sync) {
            addHandler(
              el,
              `update:${camelize(name)}`, // 事件名称
              genAssignmentCode(value, `$event`) // 回调函数体字符串，注意是函数体
            )
          }
        }
        // 判断是否是.prop修饰符
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value)
        } else {
          // 添加属性
          addAttr(el, name, value)
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '') // 去掉v-on指令的特征
        // 添加事件
        addHandler(el, name, value, modifiers, false, warn)
      } else { // normal directives  正常指令（非v-bind、非v-on）
        name = name.replace(dirRE, '')
        // parse arg  解析参数
        const argMatch = name.match(argRE)
        const arg = argMatch && argMatch[1] // 参数名称
        if (arg) {
          name = name.slice(0, -(arg.length + 1)) // 去掉参数后的属性名称
        }
        // 添加指令
        addDirective(el, name, rawName, value, arg, modifiers)
        if (process.env.NODE_ENV !== 'production' && name === 'model') {
          checkForAliasModel(el, value)
        }
      }
    } else {
      // literal attribute  文字属性
      if (process.env.NODE_ENV !== 'production') {
        // 字符串不能包含在   {{}}  中
        const expression = parseText(value, delimiters)
        if (expression) {
          warn(
            `${name}="${value}": ` +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          )
        }
      }
      // 文字属性，直接添加属性
      addAttr(el, name, JSON.stringify(value))
    }
  }
}

// 检查AST是否在v-for指令中，从自己到顶级的父级都要查找
function checkInFor (el: ASTElement): boolean {
  let parent = el
  while (parent) {
    // for属性有值，表示有v-for
    if (parent.for !== undefined) {
      return true
    }
    // 查找父级
    parent = parent.parent
  }
  return false
}

// 解析修饰符
function parseModifiers (name: string): Object | void {
  // 匹配所有修饰符
  const match = name.match(modifierRE)
  if (match) {
    const ret = {}
    // 处理匹配的修饰符，去掉前面的"."
    match.forEach(m => { ret[m.slice(1)] = true })
    return ret
  }
}

// 创建属性的map
function makeAttrsMap (attrs: Array<Object>): Object {
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    // 重复属性警告
    if (
      process.env.NODE_ENV !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn('duplicate attribute: ' + attrs[i].name)
    }
    // key为属性名，value为属性值
    map[attrs[i].name] = attrs[i].value
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el): boolean {
  return el.tag === 'script' || el.tag === 'style'
}

// 是否是禁止标签
function isForbiddenTag (el): boolean {
  return (
    el.tag === 'style' || // style标签
    (el.tag === 'script' && ( // script标签并且是js语言
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

const ieNSBug = /^xmlns:NS\d+/
const ieNSPrefix = /^NS\d+:/

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  const res = []
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '')
      res.push(attr)
    }
  }
  return res
}

// el同时存在v-for和v-model，如果v-for的元素值的变量名和 v-model的变量名相同，则警告
function checkForAliasModel (el, value) {
  let _el = el
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn(
        `<${el.tag} v-model="${value}">: ` +
        `You are binding v-model directly to a v-for iteration alias. ` +
        `This will not be able to modify the v-for source array because ` +
        `writing to the alias is like modifying a function local variable. ` +
        `Consider using an array of objects and use v-model on an object property instead.`
      )
    }
    _el = _el.parent
  }
}
