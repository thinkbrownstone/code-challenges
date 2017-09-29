'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import fares from '../fares'

import Zones from './components/zones'
import When from './components/when'
import Where from './components/purchase'

class Calculator extends React.Component {
  constructor(props){
    super(props)
    this._onSelect = this._onSelect.bind(this)
    this.state = {
      fares: [],
      zoneValue: ""
    }
  }
  componentWillMount(){
    // Because there is no ajax call, the state can 
    // be updated with componentWillMount instead of 
    // componentDidMount
    this.setState({
      fares: fares
    })
  }
  _onSelect(zone){
    this.setState({
      zoneValue: zone
    })
  }
	render() {
		return (
			<div className='calculator-container'>
        <Zones 
          zoneValue={this.state.zoneValue}
          fares={this.state.fares}
          _onSelect={this._onSelect}
        />
        <When when={this.state.fares}/>
        <Where />
        <div className="total">
          {/* 
            The total cost can be calculated with the child component updating the state 
            and then having the parent component add up the values 
            for the total cost. The parent component is <Calculator />.
            I ran out of time, but provided a 
            working example of how the state of the component can be
            updated with the value from the first selector. This is a good example
            of how React data flows. Data down and actions up. 
          */}
          {this.state.zoneValue}
        </div>
      </div>
			)
	}
}

ReactDOM.render(
  <Calculator />,
  document.getElementById('app') 
);