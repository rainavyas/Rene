import * as React from 'react';

interface IUserProfileProps {
  name: string;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default class UserProfile extends React.Component<IUserProfileProps> {
  public render() {
    return (
      <div>
        <h1>{this.props.name}</h1>
        <input value={this.props.name} onChange={this.props.onChangeName} />
      </div>
    );
  }
}
