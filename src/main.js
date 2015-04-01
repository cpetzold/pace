import reactMixin from 'react-mixin'

var state = new Firebase('https://pace-timer.firebaseio.com');

class Timer extends React.Component {
  handleChange({target}) {
    state.set({text: target.value});
  }

  render() {
    return <input value={this.props.text} onChange={this.handleChange} />
  }
}

class App extends React.Component {
  componentWillMount() {
    this.bindAsObject(state, 'state');
  }

  render() {
    return <Timer {...(this.state ? this.state.state : {})} />;
  }
}

reactMixin(App.prototype, ReactFireMixin);

React.render(<App />, document.body);