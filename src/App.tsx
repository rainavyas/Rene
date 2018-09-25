import * as React from 'react';
import './App.css';
import DemoOllyTable from './DemoOllyTable';
import OllyTable from './OllyTable';
import { IUser } from './UserMetaData';
import UserTable from './UserTable';

interface IAppState {
  users: IUser[];
}

export default class App extends React.Component <{}, IAppState> {

  constructor(props: any) {
    super(props);
    this.state = {
      users: [],
    };
  }

  public componentDidMount() {
    this.loadUserData();
  }

  public render() {
    return (
      <div className="overall-container">
        <h1 className="title">Descartes Dashboard</h1>
        <img 
          src="https://pbs.twimg.com/profile_images/923618276663492608/LRu2pr_v_400x400.jpg"
          className="imageDes"
        />
        <a href="">Go to User Login page</a>
        <h1 className="subheading">ACTIONS AREA</h1>
        <div className="flex-container">
          <DemoOllyTable users = {this.state.users} />
        </div>
        <p className="subheading">&nbsp;</p> 
        <h1 className="subheading">DISPLAY AREA</h1>
        <div className="flex-container">
          <div className="left">
            <UserTable users = {this.state.users} />
          </div>
          <div className="right">
            <OllyTable />
          </div>
          
        </div>
        <p className="subheading">&nbsp;</p>
      </div>
    );
  }

  private loadUserData = () => {
    fetch('https://mobile.dev.heyolly.com/v1/users/list-users', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'get',
      mode: 'cors',
    }).then(response => {
      response.json().then(data => {
        let tempUsers: IUser[] = [];
        for (const user of data) {
          // deal with inconsistent input keys

          const currUser: IUser = {
            email: '',
            family_name: '',
            given_name: '',
            id: 0,
            nickname: '',
            personality: '',
            user_auth0_id: '',
          };

          if (user.hasOwnProperty('ID')) {
            currUser.id = user.ID;
          }
          if (user.hasOwnProperty('user_auth0_id')) {
            currUser.user_auth0_id = user.user_auth0_id;
          }
          if (user.hasOwnProperty('Personality')) {
            currUser.personality = user.Personality;
          }
          if (user.hasOwnProperty('UserAuth0')) {
            if (user.UserAuth0.hasOwnProperty('given_name')) {
              currUser.given_name = user.UserAuth0.given_name;
            }
            if (user.UserAuth0.hasOwnProperty('family_name')) {
              currUser.family_name = user.UserAuth0.family_name;
            }
            if (user.UserAuth0.hasOwnProperty('nickname')) {
              currUser.nickname = user.UserAuth0.nickname;
            }
            if (user.UserAuth0.hasOwnProperty('email')) {
              currUser.email = user.UserAuth0.email;
            }
          }

          // add this user to tempUsers
          tempUsers = [...tempUsers, currUser];
        }
        // set the state of users to tempUsers
        this.setState({
          users: tempUsers
        });
      });
    });
  }
}
