# 配置

## 1. CDN引入Reactjs
版本号可以根据实际修改，把18换成别的版本即可
```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

## 2. JSX配置
```sh
# 初始化package.json文件
npm init -y
# 安装babel和babel-react预设
npm install babel-cli@6 babel-preset-react-app@3
# 执行babel命令，自动监听src目录下的文件转化jsx语法输出到当前目录下，配置预设react-app/prod
npx babel --watch src --out-dir . --presets react-app/prod
```

# 核心概念

## 1. Hello World
```js
ReactDOM
  .createRoot(document.getElementById('root'))
  .render(<h1>Hello, world!</h1>);
```

## 2. JSX简介
JSX是什么：一个 JavaScript 的语法扩展，可以在js中直接写html标签，比如：
```js
const element = <h1>Hello, world!</h1>;
```
基本语法：  
* 在 JSX 中嵌入表达式，用大括号包裹起来，和es6的字符串模版类似
```js
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;
```
* JSX 也是一个表达式，jsx相当于是一个变量可以当函数参数
* JSX 中指定元素属性，注意`class`要改成`className`，`for`要改成`htmlFor`
  * 使用引号，来将属性值指定为字符串字面量  
  * 使用大括号，来在属性值中插入一个 JavaScript 表达式
* 使用 JSX 指定子元素，多行标签要用小括号包裹，比如  
```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```
* JSX会自动转义来避免XSS攻击
* Babel 会把 JSX 转译成一个名为 React.createElement() 函数调用
```js
// jsx
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
// 转译后
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

## 3. 元素渲染
略

## 4. 组件&Props
函数组件
```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```
class组件
```js
class Welcome extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```
**注意**： 组件名称必须以大写字母开头。React 会将以小写字母开头的组件视为原生 DOM 标签。例如，`<div />` 代表 HTML 的 div 标签，而 `<Welcome />` 则代表一个组件

props：传给组件的只读属性(单向数据流)

## 5. State&生命周期
state是组件内部的状态，需要注意如下事项：  
1. 不能直接修改（除了在构造函数中才能通过赋值的方式来初始化），只能通过`setState`函数来修改，
```js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    // 构造函数中初始化状态，唯一可以直接赋值的地方
    this.state = {date: new Date()};
  }

  render() {
    return <div>内容</div>
  }
}
```
2. state修改可能是异步的，React 可能会把多个 `setState()` 调用合并成一个调用，如果需要依赖上一个状态，需要这样处理：
```js
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```
3. React 会把你提供的对象合并到当前的 state。也就是`setState`可以只修改一个或者某几个状态

生命周期和vue的生命周期一样的作用，只是函数名不同比如：  
componentDidMount（挂载后触发）  
componentWillUnmount（销毁前触发） 

## 6. 事件处理
1. React 事件的命名采用小驼峰式（camelCase），而不是纯小写。  
2. 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。
```jsx
<button onClick={activateLasers}>
  Activate Lasers
</button>
```
3. 在 React 中另一个不同点是你不能通过返回 false 的方式阻止默认行为。你必须显式的使用 preventDefault
回调中的`event`是一个合成事件。React 根据 W3C 规范来定义这些合成事件来处理各浏览器兼容性，[更多请点击这里](https://zh-hans.reactjs.org/docs/events.html)
4. 绑定的函数必须手动绑定this，这是js的this的原因（函数单独调用this指向默认值），否则回调中this是window(严格模式下是undefined)，一般有以下几种方式：
    1. 通过`Function.prototype.bind`绑定this
    ```js
    this.handleClick = this.handleClick.bind(this);
    ```
    2. `class`的public class fields 语法（）
    ```js
    handleClick = () => {
      console.log('this is:', this);
    }
    ```
    3. 在jsx中直接使用箭头函数。强烈不推荐使用这种方式。每次渲染时都会创建不同的回调函数，如果传给子组件的`props`则子组件可能会（因为该`props`改变）进行额外的重新渲染
    ```jsx
    <button onClick={() => this.handleClick()}>
      Click me
    </button>
    ```
    <br>
```js
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
```
5. 回调中传递参数，有如下两种方式（不推荐箭头函数这种方式）：
```jsx
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```
在这两种情况下，React 的事件对象 e 会被作为第二个参数传递

## 7. 条件渲染
1. 元素变量
```jsx
let button;
if (isLoggedIn) {
  button = <LogoutButton onClick={this.handleLogoutClick} />;
} else {
  button = <LoginButton onClick={this.handleLoginClick} />;
}
```
2. 与运算符 &&
```js
<div>  
  {unreadMessages.length > 0 && <h2>xxx</h2>}
</div>
```
3. 三目运算符
```jsx
<div>
  {isLoggedIn
    ? <LogoutButton onClick={this.handleLogoutClick} />
    : <LoginButton onClick={this.handleLoginClick} />
  }
</div>
```
4. 阻止组件渲染。`render`方法直接返回`null`，而不进行任何渲染。**注意：**在组件的 `render` 方法中返回 `null` 并不会影响组件的生命周期的执行

## 8. 列表&Key

## 10. 状态提升
子组件共用的状态提升到父组件，不是尝试在不同组件间同步`state`。
父组件给需要的子组件通过`props`传递值（比如`value`），以及传递一个可以修改父组件状态的函数`props`（比如`onXXXChange`，`onXXXChange`定义在父组件中）
```js
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '' // 共用的状态
    }
  }

  handleValueChange = (value) => {
    // 传递给子组件，子组件变化时通知父组件来修改值
    this.setState({value})
  }
  
  render() {
    return (
      <div>
        <Child1 value={value} onValueChange={this.handleValueChange}></Child1>
        <Child2 value={value} onValueChange={this.handleValueChange}></Child2>
      </div>
    );
  }
}
```

## 11. 组合vs继承
1. jsx中组件标签包含的所有内容会作为一个`children` `prop` 传递给组件，组件通过在渲染函数中加`{props.children}`来渲染出来
```js
function FancyBorder(props) {
  return (
    <div className={'fancy-border fancy-border-' + props.color}>
      {props.children}
    </div>
  )
}

function WelcomeDialog(props) {
  return(
    <FancyBorder color='blue'>
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p >
    </FancyBorder>
  )
}
```
2. 预定位置（和vue的插槽类似）  
jsx中元素可以作为变量，而变量也可以插入到jsx中。所以可以循环嵌套😀:sunglasses:  
所以直接通过`props`传递指定的元素，然后在渲染函数中通过嵌套变量的方式来实现  
```js
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```
继承，没有使用的场景，因为props和组合已经可以完全满足，官方是这么说的：
> Props 和组合为你提供了清晰而安全地定制组件外观和行为的灵活方式。注意：组件可以接受任意 props，包括基本数据类型，React 元素以及函数。

## 12. React哲学