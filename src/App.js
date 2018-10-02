import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Videos from './components/comp_videos'
import { ButtonList} from './components/comp_buttons';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      recordingState: ""
    };

    this.recordStateHandler = this.recordStateHandler.bind(this);
  }

  recordStateHandler = (recordingState) => {
    console.log(recordingState);
    
    this.setState({
      recordingState: recordingState
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <h1>React-Gum-recording</h1>
        <Videos handler={this.recordStateHandler} recordingState={this.state.recordingState} />
        <ButtonList handler={this.recordStateHandler}/>
      </div>
    );
  }
}

export default App;
