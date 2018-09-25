import * as React from 'react';
import { Button, Icon, Image, Label, Modal } from 'semantic-ui-react';
import imgFaceForward from './FaceRecGraphics/setup_face_scan_0.png';
import imgFaceRight from './FaceRecGraphics/setup_face_scan_1.png';
import imgFaceDown from './FaceRecGraphics/setup_face_scan_2.png';
import imgFaceLeft from './FaceRecGraphics/setup_face_scan_3.png';
import imgFaceUp from './FaceRecGraphics/setup_face_scan_4.png';

interface IFaceRecFinishedTick {
    finished: boolean;
}

const FaceRecFinishedTick = (props: IFaceRecFinishedTick) => {
    if (props.finished) {
        return (
                <Icon name="check" color="green" />
        );
    } else {
        return null;
    }
}

const FaceRecFinishedMsg = (props: IFaceRecFinishedTick) => {
    if (props.finished) {
        return (
            <div>
                <Label color="orange">Click again to redo</Label>
            </div>
        );
    } else {
        return null;
    }
}

const faceImgStyle = {
    height: '1200px',
    marginLeft: '100px'
};

const inlineStyle = {
    modal: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '100px !important',
    }
};

interface IShowFaceImageProps {
    faceStatus: string;
}

const ShowFaceImage = (props: IShowFaceImageProps) => {
    let imgUrl: string = '';
    if (props.faceStatus === 'FACE_FORWARD') {
        imgUrl = imgFaceForward;
    } else if (props.faceStatus === 'FACE_LEFT') {
        imgUrl = imgFaceLeft;
    } else if (props.faceStatus === 'FACE_DOWN') {
        imgUrl = imgFaceDown;
    } else if (props.faceStatus === 'FACE_RIGHT') {
        imgUrl = imgFaceRight;
    } else if (props.faceStatus === 'FACE_UP') {
        imgUrl = imgFaceUp;
    } else if (props.faceStatus === 'COMPLETED') {
        return null;
    } else {
        return null;
    }
    return (
        <Modal
            open={true} 
            centered={true}
            style={inlineStyle.modal}
        >
            <Modal.Content>
            <Image src={imgUrl} style={faceImgStyle}/>
            </Modal.Content>
        </Modal>
    );
};

interface IOllyFunctionsFormState{
    accessToken: string;
    camState: string;
    faceStatus: string;
    finished: boolean;
    micState: string;
    resp: number;
}

interface IOllyFunctionsFormProps{
    accessToken: string;
    ollyName: string;
}

export default class OllyFunctionsForm extends React.Component <IOllyFunctionsFormProps, IOllyFunctionsFormState> {

    constructor(props: IOllyFunctionsFormProps) {
        super(props);
        this.state = {
            accessToken:'',
            camState: '',
            faceStatus: '',
            finished: false,
            micState:'', 
            resp: 0
        };       
    }

    public render(){
        return(
            <div>
                <Button onClick={this.onSubmitMic}>Toggle Mic<br/></Button>
                <p />
                <Button onClick ={this.onSubmitCam}>Toggle Cam</Button>
                <p />
                <Button onClick={this.onSubmitFace}>Learn Face</Button>
                <FaceRecFinishedTick finished={this.state.finished} />
                <FaceRecFinishedMsg finished={this.state.finished} />
                <ShowFaceImage
                    faceStatus={this.state.faceStatus}
                />
          </div>
        );
    }

    private onSubmitMic = () => {
        // make a put request to change the mic status
            
        fetch('https://mobile.dev.heyolly.com/v1/ollys', {
        
        body: JSON.stringify({
            "microphone_enabled": this.state.micState,
            "olly_id": this.props.ollyName
        }),
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + this.props.accessToken,
            'Content-Type': 'application/json',
        },

        method: 'PUT',
        mode: 'cors',
        }).then(response => {
        if (response.ok) {
            window.alert('Microphone toggled');
        }
        });
  }
    

    private onSubmitCam = () => {
        // Make a put request to change the cam status
        fetch('https://mobile.dev.heyolly.com/v1/ollys', {
        
            body: JSON.stringify({
                "camera_enabled": this.state.camState,
                "olly_id": this.props.ollyName
            }),
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + this.props.accessToken,
                'Content-Type': 'application/json',
            },
    
            method: 'PUT',
            mode: 'cors',
            }).then(response => {
                // Change to display a temporary message
            if (response.ok) {
                window.alert('Camera toggled');
            }
            });
    }

    private onSubmitFace = () => {
        this.setState({finished: false});
        // Set first status to face forward
        this.setFirstFaceStatus();
        // Fetch current status for face recognition
        const r: number = window.setInterval(this.updateFaceStatus, 1000);
        this.setState({resp: r});
    }

    private setFirstFaceStatus = () => {
        let url: string = 'https://mobile.dev.heyolly.com/v1/face-recognition/';
        url = url.concat(this.props.ollyName);
        fetch(url, {
            body: JSON.stringify({
                "status": "FACE_FORWARD",
            }),
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + this.props.accessToken,
                'Content-Type': 'application/json',
            },
            method: 'put',
            mode: 'cors',
        });
        this.setState({faceStatus: ''});
    }

    private updateFaceStatus = () => {
        if (this.state.faceStatus !== 'COMPLETED') {
            let url: string = 'https://mobile.dev.heyolly.com/v1/face-recognition/';
            url = url.concat(this.props.ollyName);
            fetch(url, {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + this.props.accessToken,
                    'Content-Type': 'application/json',
                },
                method: 'get',
                mode: 'cors',
            }).then(response => {
                response.json().then(data => {
                    // Display message of fetching status
                    if (data.hasOwnProperty('status')) {
                        this.setState({faceStatus: data.status.toUpperCase()});
                    }
                });
            });
        }
        if (this.state.faceStatus ==='COMPLETED' ) {
            this.setState({finished: true});
            window.clearInterval(this.state.resp);
        }
    }
}