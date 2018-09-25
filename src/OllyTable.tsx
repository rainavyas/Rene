import * as React from 'react';
import { Table } from 'semantic-ui-react';
import './UserTable.css';

const TableHead = () => {
  return (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>ID</Table.HeaderCell>
        <Table.HeaderCell>Olly Name</Table.HeaderCell>
        <Table.HeaderCell>Personality</Table.HeaderCell>
        <Table.HeaderCell>SSID</Table.HeaderCell>
        <Table.HeaderCell>Location</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );
};

const TableBody = (props: IOllyTableState) => {
 
  const ollys = props.ollys.map((olly, index) => {
    let color: string;
    if (olly.wifiStatus) {
      color = 'green';
    } else {
      color = 'red';
    }
    return (
      <Table.Row key={index}>
        <Table.Cell style={{backgroundColor:color}}>{olly.ollyID}</Table.Cell>
        <Table.Cell>{olly.ollyName}</Table.Cell>
        <Table.Cell>{olly.personality}</Table.Cell>
        <Table.Cell>{olly.ssid}</Table.Cell>
        <Table.Cell>{olly.location}</Table.Cell>
      </Table.Row>
    );
  });
  return <Table.Body>{ollys}</Table.Body>;
};

export interface IOllyObject {
  location: string;
  ollyID: string;
  ollyName: string;
  personality: string;
  ssid: string;
  wifiStatus: boolean;
}

export interface IOllyTableState {
  ollys: IOllyObject[];
}

class OllyTable extends React.Component<{}, IOllyTableState> {
  constructor(props: any) {
    super(props);
    this.state = {
      ollys: [],
    };
  }

  public componentDidMount() {
    let tempOllys: IOllyObject[] =[];
    fetch('https://mobile.dev.heyolly.com/v1/ollys', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'get',
      mode: 'cors',
    }).then(response => {
      response.json().then(data => {
        for (const olly of data) {
          // deal with inconsistent input keys

          const currOlly: IOllyObject = {
            location: '',
            ollyID: '',
            ollyName: '',
            personality: '',
            ssid: '',
            wifiStatus: false,
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
          if (olly.hasOwnProperty('olly_location')) {
            if (olly.olly_location.hasOwnProperty('country')) {
              currOlly.location = olly.olly_location.country;
            }
          }

          // get the wifi status of this olly
          currOlly.wifiStatus= this.getWifiStatus(currOlly.ollyID)

          // append this olly to tempOllys
          tempOllys = [...tempOllys,currOlly]
          this.setState({ollys: tempOllys});
        }
      });
    });
  }

  public render() {
    return (
      <div>
        <h2> Olly Table </h2>
        <p>This table displays all the Ollys stored in the backend.</p>
        <Table>
          <TableHead />
          <TableBody ollys={this.state.ollys} />
        </Table>

        <Table>
            <Table.Body>
              <Table.Row>
                  <Table.Cell style={{backgroundColor:'green'}}>Wifi Connected</Table.Cell>
                  <Table.Cell style={{backgroundColor:'red'}}>Wifi Not Connected</Table.Cell>
              </Table.Row>
            </Table.Body>
        </Table>
      </div>
    );
  }

  private getWifiStatus = (ollyID:string) : boolean => {
    fetch('https://oobe.dev.heyolly.com/v1/heartbeat/ '+ollyID, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'get',
      mode: 'cors',
    }).then(response => {
      response.json().then(data => {
        return (data.wifi)
        });
      });
      return false
  }
}

export default OllyTable;