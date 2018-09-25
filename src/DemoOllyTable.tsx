import * as React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import './App.css';
import DemoUserTable from './DemoUserTable';
import OllyFunctionsForm from './OllyFunctionsForm';
import { IUser } from './UserMetaData';


export interface IOllyObject {
    cam: string;
    location: string;
    mic: string;
    ollyID: string;
    ollyName: string;
    personality: string;
    ssid: string;
}

interface ICamIconProps {
    cam: string;
}

const CamIcon = (props: ICamIconProps) => {
    if (props.cam === 'true') {
        return (
            <Icon name='thumbs up' color='green' size='huge' />
        );
    } else {
        return (
            <Icon name='thumbs down' color='red' size='huge' />
        );
    }
}

interface IMicIconProps {
    mic: string;
}

const MicIcon = (props: IMicIconProps) => {
    if (props.mic === 'true') {
        return (
            <Icon name='thumbs up' color='green' size='huge' />
        );
    } else {
        return (
            <Icon name='thumbs down' color='red' size='huge' />
        );
    }
}

const TableHead = () => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Olly Name</Table.HeaderCell>
          <Table.HeaderCell>Personality</Table.HeaderCell>
          <Table.HeaderCell>SSID</Table.HeaderCell>
          <Table.HeaderCell>Location</Table.HeaderCell>
          <Table.HeaderCell>Cam Enabled</Table.HeaderCell>
          <Table.HeaderCell>Mic Enabled</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

interface IDemoOllyTableState { 
    accessToken: string;
    ollys: IOllyObject[];
}

const TableBody = (props: IDemoOllyTableState) => {
    const ollys = props.ollys.map((olly, index) => {
        return (
        <Table.Row key={index}>
            <Table.Cell>{olly.ollyID}</Table.Cell>
            <Table.Cell>{olly.ollyName}</Table.Cell>
            <Table.Cell>{olly.personality}</Table.Cell>
            <Table.Cell>{olly.ssid}</Table.Cell>
            <Table.Cell>{olly.location}</Table.Cell>
            <Table.Cell>
                <CamIcon cam={olly.cam} />
            </Table.Cell>
            <Table.Cell>
                <MicIcon mic={olly.mic} />
            </Table.Cell>
            <Table.Cell>
                <OllyFunctionsForm
                    ollyName = {olly.ollyName}
                    accessToken = {props.accessToken}
                />
            </Table.Cell>
        </Table.Row>
        );
    });
    return <tbody>{ollys}</tbody>;
};

interface IDemoOllyTableProps {
    users: IUser[];
}

export default class DemoOllyTable extends React.Component <IDemoOllyTableProps, IDemoOllyTableState> {

    constructor(props: any) {
        super(props);
        this.state = {
            accessToken: '',
            ollys: [],
        };
    }

    public render(){
        return(
            <div className="flex-container">
                <div className="left">
                    <DemoUserTable
                         changeOllyTable = {this.changeOllyTable}
                         users = {this.props.users}
                    />
                </div>
                <div className="right">
                    <h2>Corresponding Ollys</h2>
                    <p>This table allows actions to be performed on the Ollys of the selected user.</p>
                    <Table>
                        <TableHead />
                        <TableBody
                            ollys={this.state.ollys}
                            accessToken={this.state.accessToken}
                        />
                    </Table>
                </div>
          </div>
            
        );
    }

    private changeOllyTable = (accToken:string) => {
        this.setState({accessToken: accToken});
        let tempOllys: IOllyObject[] = [];

        fetch('https://mobile.dev.heyolly.com/v1/users/ollys', {
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer ' + accToken,
              'Content-Type': 'application/json',
            },
      
            method: 'GET',
            mode: 'cors',
        }).then(response => {
            response.json().then(data => {
                        
              for (const olly of data) {
                // deal with inconsistent input keys
      
                const currOlly: IOllyObject = {
                  cam:'',
                  location: '',
                  mic:'',
                  ollyID: '',
                  ollyName: '',
                  personality: '',
                  ssid: '',
                };
      
                if (olly.hasOwnProperty('ID')) {
                  currOlly.ollyID = olly.ID;
                }
                if (olly.hasOwnProperty('olly_id')) {
                  currOlly.ollyName = olly.olly_id;
                }
                if (olly.hasOwnProperty('personality')) {
                  currOlly.personality = olly.personality;
                }
      
                if (olly.hasOwnProperty('ssid')) {
                  currOlly.ssid = olly.ssid;
                }

                if (olly.hasOwnProperty('microphone_enabled')) {
                    currOlly.mic = olly.microphone_enabled;
                  }

                if (olly.hasOwnProperty('camera_enabled')) {
                    currOlly.cam = olly.camera_enabled;
                }

                if (olly.hasOwnProperty('olly_location')) {
                  if (olly.olly_location.hasOwnProperty('country')) {
                    currOlly.location = olly.olly_location.country;
                  }
                }
      
                // append this olly to tempOllys
                tempOllys = [...tempOllys,currOlly]
                this.setState({ollys: tempOllys});
              }
            });
        }); 
    }
}