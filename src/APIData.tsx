import * as React from 'react';

interface IAPIDataState {
  userPersonality: any;
}

interface IAPIDataProps {
  dummyProp: string;
}

export default class APIData extends React.Component<
  IAPIDataProps,
  IAPIDataState
> {
  constructor(props: IAPIDataProps) {
    super(props);
    this.state = {
      userPersonality: 'no data',
    };
  }

  public componentDidMount() {
    fetch('https://mobile.dev.heyolly.com/v1/users/84', {
      headers: {
        Accept: 'application/json',
        // 'Access-Control-Allow-Methods':'GET',
        // 'Access-Control-Allow-Origin':'*',
        'Content-Type': 'application/json',
      },
      method: 'get',
      // mode: "no-cors"
      mode: 'cors',
    }).then(response => {
      response.json().then(data => {
        this.setState({ userPersonality: data.Personality });
      });
    });
  }

  public render() {
    return <div>{this.state.userPersonality}</div>;
  }
}
