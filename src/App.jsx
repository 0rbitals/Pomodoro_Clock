import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      sessionLength: 1500000,
      breakLength: 300000,
      timeLeft: 1500000,
      timerOn: false,
      currentState: 'session',
    };
    this.now = new Date().getTime();
    this.incrementTime = this.incrementTime.bind(this);
    this.decrementTime = this.decrementTime.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.SessionTimer = this.SessionTimer.bind(this);
  }

  componentDidUpdate() {
    const { timerOn } = this.state;
    if (timerOn) {
      setTimeout(this.startTimer, 1000);
    }
  }

  incrementTime(event) {
    const { name } = event.target;
    const { state } = this;
    if (state[name] < 60 * 60 * 1000 && !state.timerOn) {
      this.setState((prevState) => ({
        [name]: prevState[name] + 60000,
      }));
    }
    if (name === 'sessionLength' && state.sessionLength < 60 * 60 * 1000 && !state.timerOn) {
      this.setState((prevState) => ({
        timeLeft: prevState.timeLeft + 60000,
      }));
    }
  }

  decrementTime(event) {
    const { name } = event.target;
    const { state } = this;
    if (state[name] > 1 * 60 * 1000 && !state.timerOn) {
      this.setState((prevState) => ({
        [name]: prevState[name] - 60000,
      }));
    }
    if (name === 'sessionLength' && state.sessionLength > 1 * 60 * 1000 && !state.timerOn) {
      this.setState((prevState) => ({
        timeLeft: prevState.timeLeft - 60000,
      }));
    }
  }

  startTimer() {
    const { currentState } = this.state;
    if (currentState === 'session') {
      this.SessionTimer();
    } else if (currentState === 'break') {
      this.BreakTimer();
    }
  }

  SessionTimer() {
    const { timeLeft } = this.state;
    if (timeLeft <= 5) {
      this.setState({
        currentState: 'break',
      });
    } else {
      this.setState((prevState) => ({
        timeLeft: prevState.timeLeft - 1000,
      }));
    }
  }

  toggleTimer() {
    const { timerOn } = this.state;
    if (!timerOn) {
      this.setState({
        timerOn: true,
      });
    } else {
      this.setState({
        timerOn: false,
      });
    }
  }

  reset() {
    this.setState({
      sessionLength: 25,
      breakLength: 5,
      timeLeft: '25:00',
    });
  }

  render() {
    const { sessionLength, breakLength, timeLeft } = this.state;
    return (
      <div>
        <h1>Pomodoro Clock</h1>
        <div id="break-label">
          Break Length:
          <div id="break-length">{breakLength / 60000}</div>
          <button id="break-increment" name="breakLength" onClick={this.incrementTime} type="button">Up</button>
          <button id="break-decrement" name="breakLength" onClick={this.decrementTime} type="button">Down</button>
        </div>
        <div id="session-label">
          Session Length
          <div id="session-length">{sessionLength / 60000}</div>
          <button id="session-increment" name="sessionLength" onClick={this.incrementTime} type="button">Up</button>
          <button id="session-decrement" name="sessionLength" onClick={this.decrementTime} type="button">Down</button>
        </div>
        <div id="timer-label">
          Session:
          <div id="time-left">{ `${Math.floor(timeLeft / 60000)}:${Math.floor((timeLeft % (1000 * 60)) / 1000)}` }</div>
          <button type="button" onClick={this.toggleTimer} id="start_stop">Start/Pause</button>
          <button type="button" id="reset">Reset</button>
        </div>
      </div>
    );
  }
}

export default App;
