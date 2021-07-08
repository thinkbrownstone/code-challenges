import React, { Component } from 'react';

import Header from './Header';
import Destination from './WidgetComponents/Destination';
import Timings from './WidgetComponents/Timings';
import PurchaseLocation from './WidgetComponents/PurchaseLocation';
import RideCount from './WidgetComponents/RideCount';
import SpecialHint from './WidgetComponents/SpecialHint';

import '../../scss/SeptaFareCalculator.scss';

class SeptaFareCalculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            zone: 1,
            time: "weekday",
            purchaseAt: "onboard_purchase",
            numRides: 1,
            specialFareState: false,
            specialFareCount: 0
        }
    }

    onZoneChange(newZone) {
        this.setState({ zone: newZone });
    }

    onTimingChange(newTime) {
        this.setState({ time: newTime });
    }

    onPurchaseLocChange(newLoc) {
        this.setState({ purchaseAt: newLoc });
    }

    onRideCountChange(newCount) {
        this.setState({ numRides: newCount });
    }

    calculateFare() {
        if (this.props.faresData.zones.length > 0) {
            let zoneFares = this.props.faresData.zones[this.state.zone - 1].fares,
                associatedFare = zoneFares.filter(fare => {
                    return (fare.type === this.state.time) && (fare.purchase === this.state.purchaseAt)
                })[0];

            let finalFare;
            if (associatedFare == undefined) {
                finalFare = 'Not an Option';
                if (this.state.specialFareState) this.setState({ specialFareState: false, specialFareCount: 0 });
            } else {
                if (associatedFare.trips > 1) { // Special fare for more than 1 tickets
                    finalFare = associatedFare.price;
                    if (this.state.specialFareCount != associatedFare.trips) {
                        this.setState({
                            specialFareState: true,
                            specialFareCount: associatedFare.trips
                        });
                    }
                } else {
                    finalFare = associatedFare.price * this.state.numRides;
                    if (this.state.specialFareState) this.setState({ specialFareState: false, specialFareCount: 0 });
                }

                finalFare = '$ ' + finalFare.toFixed(2);
            }
            return finalFare;
        }
    }


    render() {
        return (
            <div id="septa-fare-calculator">
                <Header />

                <Destination zones={ this.props.faresData.zones } zoneChange={ this.onZoneChange.bind(this) } />

                <Timings
                    timings={ this.props.timings }
                    timingChange={ this.onTimingChange.bind(this) }
                    keyInfo={ this.props.faresData.info} />

                <PurchaseLocation onLocChange={ this.onPurchaseLocChange.bind(this) } />

                <RideCount onCountChange={ this.onRideCountChange.bind(this) } />

                <div className="final-fare-container">
                    <p>Your fare will cost</p>
                    <h1 className="final-fare">{this.calculateFare()}</h1>
                    <SpecialHint isSpecial={this.state.specialFareState} specialCount={this.state.specialFareCount} />
                </div>
            </div>
        );
    }
}
export default SeptaFareCalculator;
