/**
 * Element virdual-dom 对象定义
 * @param {String} tagName - dom 元素名称
 * @param {Object} props - dom 属性
 * @param {Array<Element|String>} - 子节点
 */
function Element(tagName, props, children) {
  this.tagName = tagName;
  this.props = props;
  this.children = children;
  // dom 元素的 key 值，用作唯一标识符
  if (props.key) {
    this.key = props.key;
  }
  var count = 0;
  children.forEach(function (child, i) {
    if (child instanceof Element) {
      count += child.count;
    } else {
      children[i] = "" + child;
    }
    count++;
  });
  // 子元素个数
  this.count = count;
}

Element.prototype.render = function () {
  let el = document.createElement(this.tagName);
  let props = this.props;

  for (let propName in props) {
    let propValue = props[propName];
    el.setAttribute(propName, propValue);
  }

  let children = this.children || [];
  children.forEach(function (child) {
    let childEl =
      child instanceof Element
        ? child.render() // 如果子节点也是虚拟DOM，递归构建DOM节点
        : document.createTextNode(child); // 如果字符串，只构建文本节点
    el.appendChild(childEl);
  });

  return el
};

function createElement(tagName, props, children) {
  return new Element(tagName, props, children)
}

var ul = createElement('div',{id:'virtual-dom'},[
  createElement('p',{},['Virtual DOM']),
  createElement('ul', { id: 'list' }, [
	createElement('li', { class: 'item' }, ['Item 1']),
	createElement('li', { class: 'item' }, ['Item 2']),
	createElement('li', { class: 'item' }, ['Item 3'])
  ]),
  createElement('div',{},['Hello World'])
]); 

console.log(ul);

let ulRoot = ul.render();
document.body.appendChild(ulRoot);
