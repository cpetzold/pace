import reactMixin from 'react-mixin'

var state = window.state = new Firebase('https://pace-timer.firebaseio.com');

var initialState = {
  isStarted: false,
  secondsSinceStart: 0,
  secondsPerTurn: 60,
  minPlayers: 2,
  maxPlayers: 6,
  players: [createPlayer(), createPlayer()]
};

function createPlayer(name = '') {
  return { name: name, secondsPast: 0 };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(n, max));
}

class CreateTimer extends React.Component {

  changeNumPlayers({target}) {
    var players = this.props.players;
    var desiredNumPlayers = clamp(target.value, this.props.minPlayers, this.props.maxPlayers);
    
    if (players.length >= desiredNumPlayers) {
      players.length = desiredNumPlayers;
    } else {
      while (players.length < desiredNumPlayers) {
        players.push(createPlayer());
      }
    }

    state.update({players: players});
  }

  changePlayerName(i, newName) {
    var players = this.props.players;
    players[i].name = newName;
    state.update({players: players});
  }

  changeSecondsPerTurn({target}) {
    state.update({secondsPerTurn: target.value});
  }

  allPlayersNamed() {
    return this.props.players.every((player) => {
      return player.name && player.name.trim() !== '';
    });
  }

  start() {
    state.update({isStarted: true});
    return false;
  }

  render() {
    var self = this;
    return (
      <form onSubmit={this.start.bind(this)}>
        <input type="number"
               autoFocus={true}
               min={this.props.minPlayers} max={this.props.maxPlayers}
               value={this.props.players.length}
               onChange={this.changeNumPlayers.bind(this)} />
        {this.props.players.map((player, i) => {
          return (
            <div>
              <input value={player.name}
                     placeholder={`Player ${i+1}`}
                     onChange={(e) => self.changePlayerName(i, e.target.value)} />
            </div>
          );
        })}
        <input type="number"
               value={this.props.secondsPerTurn}
               min={0} max={1000}
               onChange={this.changeSecondsPerTurn.bind(this)} />
        <input type="submit"
               value="Start"
               disabled={!this.allPlayersNamed()} />
      </form>
    )
  }
}

class App extends React.Component {
  componentWillMount() {
    this.bindAsObject(state, 'state');
    // reset();
  }

  render() {
    var self = this;
    if (!this.state) {
      return null;
    } else {
      return this.state.state.isStarted ?
        <div>
          <button onClick={() => state.set(initialState)}>Reset</button>
          {JSON.stringify(this.state.state)}
        </div>
        :
        <CreateTimer {...this.state.state} />;
    }
  }
}

reactMixin(App.prototype, ReactFireMixin);

React.render(<App />, document.body);