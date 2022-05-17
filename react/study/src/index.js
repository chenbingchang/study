const root = ReactDOM.createRoot(document.getElementById('root'))

/* function Clock(props) {
  return (
    <div>
      <h1>Hello, world</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  )
}

function tick() {
  root.render(<Clock date={new Date()}></Clock>)
}

setInterval(tick, 1000) */

class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }

  // 挂载后的钩子
  componentDidMount() {
    this.timerID = setInterval(() => {
      this.tick()
    }, 1000)
  }

  // 销毁前的钩子
  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  tick() {
    this.setState({
      date: new Date()
    })
  }

  render() {
    return (
      <div>
        <h1>Hello, world</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

function App() {
  return (
    <div>
      <Clock></Clock>
      <Clock></Clock>
      <Clock></Clock>
    </div>
  )
}

root.render(<App></App>)