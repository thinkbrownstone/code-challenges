'use strict';

import React from 'react';

class Zones extends React.Component {
  constructor(props){
    super(props)
  }
  _onChange(event){
    this.props._onSelect(event.target.value)
  }
	render() {
    const zones = this.props.fares.zones.map( (zone, index) => {
      return (
        <option 
          key={index}
          value={zone.zone}>
            Zone {zone.zone}
        </option>
        )
    })
		return (
			<div className="zones">
        <div className="question q-zones">
          Where are you going?
        </div>
          <select 
            value={this.props.zoneValue}
            onChange={ this._onChange.bind(this) }
            className="zone-select">
            {zones}
          </select>
      </div>
			)
	}
}

export default Zones


/*

() => this.props._onSelect()
*/