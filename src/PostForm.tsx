import * as React from 'react';
import { Button, Form } from 'semantic-ui-react';

interface IPropFormState {
  AccessToken: string;
}

export default class PostForm extends React.Component<{}, IPropFormState> {
  constructor(props: any) {
    super(props);
    this.state = {
      AccessToken: '',
    };
  }

  public render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Access Token"
            value={this.state.AccessToken}
            onChange={this.onChangeToken}
          />

          <Button onClick={this.onSubmit}>Add User to Backend</Button>
        </Form>
      </div>
    );
  }

  private onSubmit = () => {
    fetch('https://mobile.dev.heyolly.com/v1/users', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this.state.AccessToken,
        'Content-Type': 'application/json',
      },

      method: 'POST',
      mode: 'cors',
    }).then(response => {
      if (response.ok) {
        window.alert('User Added');
      }
    });
  }

  private onChangeToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ AccessToken: event.target.value });
  };

  private handleSubmit = (e: any) => {
    e.preventDefault();
  }
}