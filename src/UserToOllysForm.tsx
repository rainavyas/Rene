import * as React from 'react';
import { Button, Form, Label } from 'semantic-ui-react';

interface IDisplayOllysLabel {
    display: boolean;
}

const DisplayOllysLabel = (props: IDisplayOllysLabel) => {
    if (props.display) {
        return (
            <Label color="orange">Getting Ollys</Label>
        );
    } else {
        return null;
    }
}

const DisplayRefreshMsg = (props: IDisplayOllysLabel) => {
    if (props.display) {
        return (
            <Label color="orange">Refresh page to see change</Label>
        );
    } else {
        return null;
    }
}

interface IUserToOllysFormState {
    accessToken: string;
    displayFamName: boolean;
    displayMsg: boolean;
    displayName: boolean;
    displayNickname: boolean;
    familyName: string;
    givenName: string;
    nickname: string;
}

interface IUserToOllysFormProps {
    userID: number;
    changeOllyTable(accessToken: string): void;
}

export default class UserToOllysForm extends React.Component<IUserToOllysFormProps, IUserToOllysFormState>{

    constructor(props: IUserToOllysFormProps) {
        super(props);
        this.state = {
            accessToken:'',
            displayFamName:false,
            displayMsg:false,
            displayName:false,
            displayNickname:false,
            familyName:'',
            givenName:'',
            nickname:''
        };
    }

    public render(){
        return(
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <input
                    type="text"
                    placeholder="Access token"
                    value={this.state.accessToken}
                    onChange={this.onChangeToken}
                    />
                    <Button onClick={this.onSubmit}>Display Ollys</Button>
                    <DisplayOllysLabel display={this.state.displayMsg} />
                </Form>
                
                <p>&nbsp;</p>

                <Form onSubmit={this.handleSubmit}>
                    <input
                    type="text"
                    placeholder="Access token"
                    value={this.state.accessToken}
                    onChange={this.onChangeToken}
                    />
                </Form>

                <Form onSubmit={this.handleSubmit}>
                    <input
                    type="text"
                    placeholder="New Given Name"
                    value={this.state.givenName}
                    onChange={this.onChangeGivenName}
                    />
                    <Button onClick={this.changeName}>Change Name</Button>
                    <DisplayRefreshMsg display={this.state.displayName} />
                </Form>

                <p>&nbsp;</p>

                <Form onSubmit={this.handleSubmit}>
                    <input
                    type="text"
                    placeholder="Access token"
                    value={this.state.accessToken}
                    onChange={this.onChangeToken}
                    />
                </Form>

                <Form onSubmit={this.handleSubmit}>
                    <input
                    type="text"
                    placeholder="New Family Name"
                    value={this.state.familyName}
                    onChange={this.onChangeFamilyName}
                    />
                    <Button onClick={this.changeFamName}>Change Family Name</Button>
                    <DisplayRefreshMsg display={this.state.displayFamName} />
                </Form>

                <p>&nbsp;</p>

                <Form onSubmit={this.handleSubmit}>
                    <input
                    type="text"
                    placeholder="Access token"
                    value={this.state.accessToken}
                    onChange={this.onChangeToken}
                    />
                </Form>

                <Form onSubmit={this.handleSubmit}>
                    <input
                    type="text"
                    placeholder="New Nickname"
                    value={this.state.nickname}
                    onChange={this.onChangeNickname}
                    />
                    <Button onClick={this.changeNickname}>Change Nickname</Button>
                    <DisplayRefreshMsg display={this.state.displayNickname} />
                </Form>

            </div>
        );
    }

    private handleSubmit = (e: any) => {
        e.preventDefault();
    }

    private onChangeToken = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ accessToken: event.target.value });
    };

    private onSubmit = () => {
        if (this.state.accessToken !== '') {
            this.setState({displayMsg: true});
        }
        this.props.changeOllyTable(this.state.accessToken);
    }

    private onChangeGivenName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ givenName: event.target.value });
    }

    private changeName = () => {

        fetch('https://mobile.dev.heyolly.com/v1/users', {
            
            body: JSON.stringify({ 
                "UserAuth0": {
                    "given_name": this.state.givenName
                } 
            }),
        
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer ' + this.state.accessToken,
              'Content-Type': 'application/json',
            },
      
            method: 'PUT',
            mode: 'cors',
          }).then(response => {
            if (response.ok) {
              this.setState({displayName: true});
            }
          });

    }

    private onChangeFamilyName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ familyName: event.target.value });
    }

    private changeFamName = () => {

        fetch('https://mobile.dev.heyolly.com/v1/users', {
            
            body: JSON.stringify({ 
                "UserAuth0": {
                    "family_name": this.state.familyName
                } 
            }),
        
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer ' + this.state.accessToken,
              'Content-Type': 'application/json',
            },
      
            method: 'PUT',
            mode: 'cors',
          }).then(response => {
            if (response.ok) {
                this.setState({displayFamName: true});
            }
          });

    }

    private onChangeNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ nickname: event.target.value });
    }

    private changeNickname = () => {

        fetch('https://mobile.dev.heyolly.com/v1/users', {
            
            body: JSON.stringify({ 
                "UserAuth0": {
                    "nickname": this.state.nickname
                } 
            }),
        
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer ' + this.state.accessToken,
              'Content-Type': 'application/json',
            },
      
            method: 'PUT',
            mode: 'cors',
          }).then(response => {
            if (response.ok) {
                this.setState({displayNickname: true});
            }
          });

    }
}