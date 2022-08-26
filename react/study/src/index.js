const root = ReactDOM.createRoot(document.getElementById('root'))

function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      const {forwardRef, ...rest} = this.props

      return <Component ref={forwardRef} {...this.props} />;
    }
  }

  function forwardRef(props, ref) {
    return <LogProps {...props} forwardRef={ref}></LogProps>
  }
  const name = Component.displayName || Component.name
  forwardRef.displayName = `logProps(${name})`

  return React.forwardRef(forwardRef);
}

class BaseFancyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }
  }

  handleClick = (e) => {
    console.log('你点击了我');
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    return (
      <div>
        <h1>标题</h1>
        <div>请输入内容</div>
        <button ref={this.props.forwardRef} onClick={this.handleClick}>点击按钮</button>
        <div>点击了：{this.state.count}次</div>
      </div>
    );
  }
}

const FancyButton = React.forwardRef(function King(props, ref) {
  return <BaseFancyButton {...props} forwardRef={ref}></BaseFancyButton>
})
FancyButton.displayName = 'Dnf'

const Test = logProps(FancyButton)
const ref = React.createRef()

function Baz(props) {
  return (
    <div>
      你好啊
    </div>
  )
}

const testRef = React.createRef()

root.render(<Baz ref={testRef}></Baz>)
