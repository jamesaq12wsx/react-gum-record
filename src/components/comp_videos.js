import React, { Component } from 'react';
import '../css/comp_video.css';

class Videos extends Component{

    stream = null;

    constraints = {
        audio: true,
        video: {
            width: 1920, height: 1080
        }
    };

    recordedBlobs = [];
    mediaRecorder = null;

    constructor(props){
        super(props);

        this.state = {
            errorMessageElement: null
        };
    }

    componentDidUpdate(){
        if (this.props.recordingState === "recording"){
            this.startRecording();
        }
        else if (this.props.recordingState === "recorded"){
            this.stopRecording();
        }
        else if(this.props.recordingState === "play"){
            this.playRecord();
        }
        else if(this.props.recordingState === "download"){
            this.downloadRecord();
        }
    }

    stopRecording() {
        this.mediaRecorder.stop();
        console.log('Recorded Blobs: ', this.recordedBlobs);
    }

    startRecording = () => {
        this.recordedBlobs = [];

        let options = { mimeType: 'video/webm;codecs=vp9' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not Supported`);
            // errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
            this.setState({ errorMsgElement: `${options.mimeType} is not Supported`});
            options = { mimeType: 'video/webm;codecs=vp8' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.error(`${options.mimeType} is not Supported`);
                this.setState({ errorMsgElement: `${options.mimeType} is not Supported` });
                // errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
                options = { mimeType: 'video/webm' };
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.error(`${options.mimeType} is not Supported`);
                    // errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
                    this.setState({ errorMsgElement: `${options.mimeType} is not Supported` });
                    options = { mimeType: '' };
                }
            }
        }

        try {
            this.mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
            // errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
            this.setState({ errorMsgElement: `Exception while creating MediaRecorder: ${JSON.stringify(e)}` });
            return;
        }

        console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);
        // recordButton.textContent = 'Stop Recording';
        // playButton.disabled = true;
        // downloadButton.disabled = true;
        this.mediaRecorder.onstop = (event) => {
            console.log('Recorder stopped: ', event);
        };
        this.mediaRecorder.ondataavailable = this.handleDataAvailable;
        this.mediaRecorder.start(10); // collect 10ms of data
        console.log('MediaRecorder started', this.mediaRecorder);
    }

    handleDataAvailable = (event) => {

        console.log('handleDataAvailable');

        if (event.data && event.data.size > 0) {
            this.recordedBlobs.push(event.data);
        }
    }

    playRecord = () => {
        const superBuffer = new Blob(this.recordedBlobs, { type: 'video/webm' });
        var recordedVideo = document.querySelector('video#recorded');
        recordedVideo.src = null;
        recordedVideo.srcObject = null;
        recordedVideo.src = window.URL.createObjectURL(superBuffer);
        recordedVideo.controls = true;
        recordedVideo.play();
    }

    downloadRecord = () => {
        const blob = new Blob(this.recordedBlobs, { type: 'video/webm' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    handleSuccess = (stream) => {
        // recordButton.disabled = false;
        console.log('getUserMedia() got stream:', stream);
        window.stream = stream;

        const gumVideo = document.querySelector('video#gum');
        gumVideo.srcObject = stream;
        this.props.handler('streaming');
    }

    handleError = (e) => {
        console.error('navigator.getUserMedia error:', e);
        // errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
        this.props.handler('stream_fail')
        this.setState({errorMessageElement: e.name});
    }

    componentDidMount(){
        navigator.mediaDevices.getUserMedia(this.constraints).then(this.handleSuccess).catch(this.handleError);
    }

    render(){
        return(
            <div id="video_list">
                <p id="error_message">{this.state.errorMsgElement}</p>
                <video id="gum" playsInline autoPlay={true} muted={true} ></video>
                <video id="recorded" playsInline></video>
            </div>
        );
    }
}

export default Videos;
