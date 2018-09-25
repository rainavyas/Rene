import * as React from 'react';
import { Input, Table } from 'semantic-ui-react';
import { IUser } from './UserMetaData';
import UserToOllysForm from './UserToOllysForm';

const TableHead = () => {
    return (
      <Table.Header>
      <Table.Row>
        <Table.HeaderCell>UserID</Table.HeaderCell>
        <Table.HeaderCell>user_auth0_id</Table.HeaderCell>
        <Table.HeaderCell>Given Name</Table.HeaderCell>
        <Table.HeaderCell>Family Name</Table.HeaderCell>
        <Table.HeaderCell>Nickname</Table.HeaderCell>
        <Table.HeaderCell>Email</Table.HeaderCell>
        <Table.HeaderCell>Personality</Table.HeaderCell>
        <Table.HeaderCell>Password</Table.HeaderCell>
        <Table.HeaderCell>Actions</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    );
  };

  const TableBody = (props: ITableBodyProps) => {
    let pwd: string|undefined = '';

    const users = props.users.map((user, index) => {
      if (props.isIDInDemoUserIds(user.id)) {
        for (const demoUser of props.demoUsersData ) {
          if (demoUser.id === user.id) {
            pwd = demoUser.password;
          }
        }
        return (
          <Table.Row key={index}>
            <Table.Cell>{user.id}</Table.Cell>
            <Table.Cell>{user.user_auth0_id}</Table.Cell>
            <Table.Cell>{user.given_name}</Table.Cell>
            <Table.Cell>{user.family_name}</Table.Cell>
            <Table.Cell>{user.nickname}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>{user.personality}</Table.Cell>
            <Table.Cell>{pwd}</Table.Cell>
            <Table.Cell>
              <UserToOllysForm changeOllyTable={props.changeOllyTable} userID={user.id}/>
            </Table.Cell>
          </Table.Row>
        );
      } else {
        return null;
      }
    });
    return <Table.Body>{users}</Table.Body>;
  };

interface ITableBodyProps {
    users: IUser[];
    demoUsersData: IDemoUserData[];
    changeOllyTable(accessToken: string): void;
    isIDInDemoUserIds(id: number): boolean;
}

interface IDemoUserData {
    id: number;
    password?: string;
}

interface IDemoUserTableProps {
    users: IUser[];
    changeOllyTable(accessToken: string): void;
}

interface IDemoUserTableStates {
    demoUsers: IUser[];
    demoUsersData: IDemoUserData[];
    filterQuery: string;
    
}

export default class DemoUserTable extends React.Component < IDemoUserTableProps, IDemoUserTableStates> {

    constructor(props: IDemoUserTableProps) {
        super(props);
        this.state = {
          demoUsers: [],
          // Add passwords for new demo users here
          demoUsersData: [{id: 103, password:"Olly123!"},
                            {id: 107,password:"Olly123!"},
                          {id: 80, password: "test123"},
                          {id: 200, password: "mehul123"}],
          filterQuery: '',
        };
    }

    public render() {
      const filteredUsers: IUser[] = this.props.users.filter(this.isInFilterQuery);
      return (
          <div>
              <h2> Demo User Table </h2>
              <p>This table allows you to perform actions on the users shown.</p>
              <Input
                  icon="filter"
                  placeholder="Filter..."
                  id="buildFilter"
                  value={this.state.filterQuery}
                  onChange={this.setFilterQuery}
              />
              <Table>
                  <TableHead />

                  <TableBody 
                    users={filteredUsers} 
                    demoUsersData={this.state.demoUsersData} 
                    changeOllyTable = {this.props.changeOllyTable}
                    isIDInDemoUserIds = {this.isIDInDemoUserIds}
                  />
              </Table>
          </div>
      );
    }

    private setFilterQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ filterQuery: e.target.value });
    }

    private isInFilterQuery = (user:IUser, index:number, usersList:IUser[]) :boolean => {
      return ( user.id.toString().includes(this.state.filterQuery) ||
              user.given_name.toLowerCase().includes(this.state.filterQuery.toLowerCase()) ||
              user.family_name.toLowerCase().includes(this.state.filterQuery.toLowerCase()) ||
              user.nickname.toLowerCase().includes(this.state.filterQuery.toLowerCase()) ||
              // user.email.toString().includes(this.state.filterQuery) ||
              user.personality.toLowerCase().includes(this.state.filterQuery.toLowerCase()) );
    }

    private isIDInDemoUserIds = (userID: number) => {
      for (const demoUser of this.state.demoUsersData ) {
          if (userID===demoUser.id) {
              return true
          }
      }
      return false
    }
}