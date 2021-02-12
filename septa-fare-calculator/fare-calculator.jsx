import React from 'react';

import Zones from './zones';
import Timings from './timings';
import Purchase from './purchase';
import Rides from './rides';

class FareCalculator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      zone: "1",
      time: "weekday",
      purchase: "advance_purchase",
      rides: 1,
    };

    this.updateZone = this.updateZone.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.updatePurchase = this.updatePurchase.bind(this);
    this.updateRides = this.updateRides.bind(this);
  }

  updatePurchase(e) {
    this.setState({ purchase: e.currentTarget.value });
  }

  updateRides(e) {
    if (this.state.time === 'anytime') {
      const newRidesValue = Math.ceil(e.currentTarget.value/10) * 10;
      this.setState({ rides: newRidesValue })
    } else {
      this.setState({ rides: e.currentTarget.value });
    }
  }

  updateTime(e) {
    const timing = e.currentTarget.value;
    if (timing === 'anytime') {
      const newRidesValue = Math.round(this.state.rides/10) * 10;
      this.setState({ time: timing, rides: newRidesValue })
    } else {
      this.setState({ time: timing });
    }
  }

  updateZone(e) {
    this.setState({ zone: e.currentTarget.value });
  }

  calculateTotalFare() {
    const state = this.state;
    const { faresData } = this.props;

    const chosenZone = faresData.zones[parseInt(this.state.zone) - 1];
    const chosenRate = chosenZone.fares.filter(fare => {
      return (fare.type === state.time && fare.purchase === state.purchase)
    })[0];

    let finalPrice = chosenRate.price * state.rides;

    if (state.rides >= 10) {
      if (state.time !=='anytime') {
        const remainedRides = (state.rides % 10);
        const specialRides = (state.rides - remainedRides);
        const specialPrice = (chosenZone.fares[4].price * (specialRides / 10));
        const regularPrice = (remainedRides * chosenRate.price);
        finalPrice = specialPrice + regularPrice;
      } else {
        finalPrice = (state.rides / 10) * chosenRate.price;
      }
    }

    return finalPrice;
  }

  render() {
    const { faresData } = this.props;
    if (!faresData.zones) return null;

    return(
      <div className="calculator-container">
        <div className="calculator-header">
          <div className="septa-logo-small">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/SEPTA.svg/500px-SEPTA.svg.png"
              alt="Septa logo" />
          </div>
          <h1>Regional Rail Fares</h1>
        </div>
        <Zones availableZones={faresData.zones} updateZone={this.updateZone} />
        <Timings timeInfo={faresData.info[this.state.time]} updateTime={this.updateTime} />
        <Purchase
          purchaseInfo={faresData.info[this.state.purchase]}
          selected={this.state.purchase}
          updatePurchase={this.updatePurchase} />
        <Rides ridesAmount={this.state.rides} updateRides={this.updateRides} />
        <div className="fare-price-container">
          <h2>Your fare will cost</h2>
          <h1>$&nbsp;{this.calculateTotalFare()}</h1>
        </div>
      </div>
    );
  }
}

export default FareCalculator;
