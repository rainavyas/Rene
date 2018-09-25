import * as React from 'react';
import { Input, Table } from 'semantic-ui-react';
import PostForm from './PostForm';
import { IUser } from './UserMetaData';
import './UserTable.css';

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
      </Table.Row>
    </Table.Header>
  );
};

const TableBody = (props: IUserTableProps) => {
  const users = props.users.map((user, index) => {
    return (
      <Table.Row key={index}>
        <Table.Cell>{user.id}</Table.Cell>
        <Table.Cell>{user.user_auth0_id}</Table.Cell>
        <Table.Cell>{user.given_name}</Table.Cell>
        <Table.Cell>{user.family_name}</Table.Cell>
        <Table.Cell>{user.nickname}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>{user.personality}</Table.Cell>
      </Table.Row>
    );
  });
  return <Table.Body>{users}</Table.Body>;
};

interface IUserTableProps {
  users: IUser[];
}

interface IUserTableState {
  filterQuery: string;
}

export default class UserTable extends React.Component< IUserTableProps, IUserTableState > {

  constructor(props: IUserTableProps) {
    super(props);
    this.state = {
      filterQuery: '',
    };
  }

  public render() {
    const filteredUsers: IUser[] = this.props.users.filter(this.isInFilterQuery);

    return (
      <div>
        <h2> User Table </h2>
        <p>This table displays all the users stored in the backend.</p>
        <Input
          icon="filter"
          placeholder="Filter..."
          id="buildFilter"
          value={this.state.filterQuery}
          onChange={this.setFilterQuery}
        />
        <Table id="mainTable">
          <TableHead />
          <TableBody users={filteredUsers} />
        </Table>

        <h2>Add User to backend</h2>
        <p>
          {' '}
          To add a user to the back-end, run the other React app and obtain the
          access token printed in the console. Paste the access token in the
          form below to make the POST request to the backend to append this user
          to the backend database.
        </p>
        <PostForm />
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

}