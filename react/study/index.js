var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var root = ReactDOM.createRoot(document.getElementById('root'));

function logProps(Component) {
  var LogProps = function (_React$Component) {
    _inherits(LogProps, _React$Component);

    function LogProps() {
      _classCallCheck(this, LogProps);

      return _possibleConstructorReturn(this, (LogProps.__proto__ || Object.getPrototypeOf(LogProps)).apply(this, arguments));
    }

    _createClass(LogProps, [{
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        console.log('old props:', prevProps);
        console.log('new props:', this.props);
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props,
            forwardRef = _props.forwardRef,
            rest = _objectWithoutProperties(_props, ['forwardRef']);

        return React.createElement(Component, Object.assign({ ref: forwardRef }, this.props));
      }
    }]);

    return LogProps;
  }(React.Component);

  function forwardRef(props, ref) {
    return React.createElement(LogProps, Object.assign({}, props, { forwardRef: ref }));
  }
  var name = Component.displayName || Component.name;
  forwardRef.displayName = 'logProps(' + name + ')';

  return React.forwardRef(forwardRef);
}

var BaseFancyButton = function (_React$Component2) {
  _inherits(BaseFancyButton, _React$Component2);

  function BaseFancyButton(props) {
    _classCallCheck(this, BaseFancyButton);

    var _this2 = _possibleConstructorReturn(this, (BaseFancyButton.__proto__ || Object.getPrototypeOf(BaseFancyButton)).call(this, props));

    _this2.handleClick = function (e) {
      console.log('你点击了我');
      _this2.setState({
        count: _this2.state.count + 1
      });
    };

    _this2.state = {
      count: 0
    };
    return _this2;
  }

  _createClass(BaseFancyButton, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          null,
          '\u6807\u9898'
        ),
        React.createElement(
          'div',
          null,
          '\u8BF7\u8F93\u5165\u5185\u5BB9'
        ),
        React.createElement(
          'button',
          { ref: this.props.forwardRef, onClick: this.handleClick },
          '\u70B9\u51FB\u6309\u94AE'
        ),
        React.createElement(
          'div',
          null,
          '\u70B9\u51FB\u4E86\uFF1A',
          this.state.count,
          '\u6B21'
        )
      );
    }
  }]);

  return BaseFancyButton;
}(React.Component);

var FancyButton = React.forwardRef(function King(props, ref) {
  return React.createElement(BaseFancyButton, Object.assign({}, props, { forwardRef: ref }));
});
FancyButton.displayName = 'Dnf';

var Test = logProps(FancyButton);
var ref = React.createRef();

function Baz(props) {
  return React.createElement(
    'div',
    null,
    '\u4F60\u597D\u554A'
  );
}

var testRef = React.createRef();

root.render(React.createElement(Baz, { ref: testRef }));