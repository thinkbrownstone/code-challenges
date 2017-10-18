import React from 'react';
import ReactDOM from 'react-dom';

import FARES from './fares-service';

import './index.css';

const FaresProvider = {
    data: FARES,
    info: FARES.info,
    zones: FARES.zones,
    times: [
        {
            id: 'weekday',
            name: 'Weekday',
        },
        {
            id: 'evening_weekend',
            name: 'Evening & Weekend',
        },
        {
            id: 'anytime',
            name: 'Anytime',
        },
    ],
    locations: [
        {
            id: 'advance_purchase',
            name: 'Station Kiosk',
        },
        {
            id: 'onboard_purchase',
            name: 'Onboard',
        }
    ]
}

class RegionalRailFaresForm extends React.Component {
    constructor(props) {
        super(props);
        this.provider = FaresProvider;
        this.state = {
            zone: this.provider.zones[0],
            time: this.provider.times[0],
            helperText: this.provider.info[this.provider.times[0].id],
            location: this.provider.locations[0],
            quanity: 1,
            cost: ''
        }
    }

    componentDidMount() {
        this.updateCost(); // Calculate initial cost after render
    }

    updateZone(e) {
        const zones = this.provider.zones;
        const target = e.target;
        const value = target.value;
        const selectedZone = zones.find((x) => x.name === value );
        
        this.setState({ zone: selectedZone }, this.updateCost);
    }

    updateTime(e) {
        const times = this.provider.times;
        const target = e.target;
        const value = target.value;
        const selectedTime = times.find((x) => x.name === value );
        
        this.setState({ 
            time: selectedTime,
            helperText: this.provider.info[selectedTime.id]
        }, this.updateCost);
    }

    updateLocation(e) {
        const locations = this.provider.locations;
        const target = e.target;
        const value = target.value;
        const selectedLocation = locations.find((x) => x.name === value );

        this.setState({ location: selectedLocation }, this.updateCost);
    }

    updateQuanity(e) {
        this.setState({ quanity: e.target.value }, this.updateCost);
    }

    updateCost() {
        const zone = this.state.zone;
        const time = this.state.time;
        const location = this.state.location;
        const quanity = this.state.quanity;
        const fares = zone.fares.filter((x) => {
            return (
                x.type === time.id &&
                x.purchase === location.id
            );
        });

        let cost = parseFloat( fares[0].price * quanity ).toFixed(2);
            
        this.setState({ cost: cost })
    }

    render() {
        return (
            <div className="regional-rail-fares-form-container">
                <div className="component-header">
                    <h2>Regional Rail Fares</h2>
                </div>
                <form>
                    <div className="form-input">
                        <label htmlFor="zone">Where are you going?</label>
                        <select
                            onChange={(e) => this.updateZone(e)}
                            name="zone"
                            value={this.state.zone.name}
                        >
                            {this.provider.zones.map((zone) =>
                                <option key={zone.name}>{zone.name}</option>
                            )}
                        </select>
                    </div>
                    
                    <div className="form-input"> 
                        <label htmlFor="time">When are you riding?</label>
                        <select
                            onChange={(e) => this.updateTime(e)}
                            name="time"
                            value={this.state.time.name}                    
                        >
                            {this.provider.times.map((time) =>
                                <option key={time.name}>{time.name}</option>
                            )}
                        </select>
                        <em>{this.state.helperText}</em>
                    </div>
                    
                    <div className="form-input">                    
                        <label htmlFor="location">Where will you purchase the fare?</label>
                        {this.provider.locations.map(
                            (location) =>
                                <div key={location.name}>
                                    <input 
                                        onChange={(e) => this.updateLocation(e)}
                                        type="radio"
                                        id={location.id} 
                                        name="location"
                                        value={location.name}
                                        checked={this.state.location.id === location.id ? true : false}/>
                                    <label htmlFor={location.id}>{location.name}</label>
                                </div>
                        )}
                    </div>
                    
                    <div className="form-input">                    
                        <label htmlFor="quanity">How many rides will you need?</label>
                        <input
                            onChange={(e) => this.updateQuanity(e)}
                            type="number"
                            name="quanity"
                            value={this.state.quanity}
                        />
                    </div>

                    <div className="component-footer">                    
                        <span>${this.state.cost}</span>
                    </div>
                </form>
            </div>
        )
    }
}

ReactDOM.render(
    <RegionalRailFaresForm/>,
    document.getElementById('root')
)
