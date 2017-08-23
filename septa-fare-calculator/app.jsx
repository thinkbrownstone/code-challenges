import React from 'react';

import FareCalculator from './fare-calculator';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: 'https://raw.githubusercontent.com/thinkcompany/code-challenges/master/septa-fare-calculator/fares.json',
      dataType: 'json',
    }).then(result => {
      debugger;
      this.setState(result);
      });
  }

  render() {
    return(
      <FareCalculator faresData={this.state}/>
    );
  }
}
