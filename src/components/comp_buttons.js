import React, {Component} from 'react';
import '../css/comp_button.css';

export class ButtonList extends Component{
    constructor(props){
        super(props);

        this.state = {
            buttonState: "none"
        };

        this.startRecordHandler = this.startRecordHandler.bind(this);
        this.playRecordHandler = this.playRecordHandler.bind(this);
        this.downloadRecordHandler = this.downloadRecordHandler.bind(this);
    }

    startRecordHandler = (e) => {
        console.log(e.target);

        if(this.state.buttonState === "recording"){
            this.setState({buttonState: "recorded"});
            this.props.handler("recorded");
        }else{
            this.setState({ buttonState: "recording" });
            this.props.handler("recording");
        }
    }

    playRecordHandler = (e) => {
        console.log(e.target);
        
        this.setState({buttonState: "play"});
        this.props.handler("play");
    }

    downloadRecordHandler = (e) => {
        console.log(e.target);

        this.setState({buttonState: "download"});
        this.props.handler("download");
    }

    render(){
        return(
            <div id="btn_list">
                <Button handler={this.startRecordHandler} name={this.state.buttonState !== "recording" ? "start recording" : "stop recording"} />
                <Button handler={this.playRecordHandler} 
                        name="play" 
                        disabled={this.state.buttonState === "recorded" || this.state.buttonState === "play" ? false : true}/>
                <Button handler={this.downloadRecordHandler} 
                        name="Download" 
                        disabled={this.state.buttonState === "recorded" || this.state.buttonState === "play" ? false : true}/>
            </div>
        );
    }
}

class Button extends Component{
    render(){
        return(
            <button onClick={this.props.handler} 
                    disabled={this.props.disabled}
                    className="btn">{this.props.name}</button>
        );
    }
}
