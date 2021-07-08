import React, { Component } from 'react';

class PurchaseLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedVal: "onboard_purchase"
        }

        this.handleRadioChange = this.handleRadioChange.bind(this);
    }

    handleRadioChange(event) {
        this.setState({ selectedVal: event.target.value });
        this.props.onLocChange(event.target.value);
    }

    render() {
        return (
            <div className="purchase-location-container">
                <h1>Where will you purchase the fare?</h1>
                <div className="locations">
                    <label>
                        Onboard
                        <input
                            type="radio"
                            name="purchLoc"
                            value="onboard_purchase"
                            checked={this.state.selectedVal === 'onboard_purchase'}
                            onChange={this.handleRadioChange} />
                    </label>
                    <label>
                        Station Kiosk
                        <input
                            type="radio"
                            name="purchLoc"
                            value="advance_purchase"
                            checked={this.state.selectedVal === 'advance_purchase'}
                            onChange={this.handleRadioChange} />
                    </label>
                </div>
            </div>
        );
    }
}

export default PurchaseLocation;