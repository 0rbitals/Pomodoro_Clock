import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      sessionLength: 1500000,
      breakLength: 300000,
      timeLeft: 1500000,
      timerOn: false,
      currentState: 'Session',
    };
    this.timerID = 0;
    this.incrementTime = this.incrementTime.bind(this);
    this.decrementTime = this.decrementTime.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.sessionTimer = this.sessionTimer.bind(this);
    this.breakTimer = this.breakTimer.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidUpdate() {
    const { timerOn } = this.state;
    if (timerOn) {
      this.timerID = setTimeout(this.startTimer, 1000);
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
    if (currentState === 'Session') {
      this.sessionTimer();
    } else if (currentState === 'Break') {
      this.breakTimer();
    }
  }

  sessionTimer() {
    const { timeLeft, breakLength } = this.state;
    if (timeLeft <= 0) {
      this.setState({
        currentState: 'Break',
        timeLeft: breakLength,
      });
      this.audioBeep.play();
    } else {
      this.setState((prevState) => ({
        timeLeft: prevState.timeLeft - 1000,
      }));
    }
  }

  breakTimer() {
    const { timeLeft, sessionLength } = this.state;
    if (timeLeft <= 0) {
      this.setState({
        currentState: 'Session',
        timeLeft: sessionLength,
      });
      this.audioBeep.play();
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
      clearTimeout(this.timerID);
      this.setState({
        timerOn: false,
      });
    }
  }

  reset() {
    clearTimeout(this.timerID);
    this.setState({
      sessionLength: 1500000,
      breakLength: 300000,
      timeLeft: 1500000,
      timerOn: false,
      currentState: 'Session',
    });
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }

  render() {
    const {
      sessionLength,
      breakLength,
      timeLeft,
      currentState,
    } = this.state;
    let minutes = Math.floor(timeLeft / 60000).toString();
    let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000).toString();
    if (minutes.split('').length < 2) {
      minutes = minutes.split('');
      minutes.unshift('0');
      minutes = minutes.join('');
    }
    if (seconds.split('').length < 2) {
      seconds = seconds.split('');
      seconds.push('0');
      seconds = seconds.join('');
    }
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
          {currentState}
          <div id="time-left">{ `${minutes}:${seconds}` }</div>
          <button type="button" onClick={this.toggleTimer} id="start_stop">Start/Pause</button>
          <button type="button" onClick={this.reset} id="reset">Reset</button>
        </div>
        <audio
          id="beep"
          ref={(audio) => { this.audioBeep = audio; }}
        >
          <source src="http://soundbible.com/grab.php?id=2197&type=wav" />
          <track
            kind="captions"
            label="beep"
          />
        </audio>
      </div>
    );
  }
}

export default App;
