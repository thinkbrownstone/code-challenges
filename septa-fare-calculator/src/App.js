import React, { Component } from 'react';
import axios from './config';
import './App.css';

class App extends Component {

  // Set initial state
  state = {
    zones: [],
    info: {},
    selectedZone: "",
    rideTimes: ["weekday", "evening_weekend"],
    selectedTime: "",
    purchaseOptions: ["advance_purchase", "onboard_purchase"],
    selectedPurchase: "",
    numberOfRides: 1
  }

  //Fetch JSON file utilizing Axios Mock Adapter, alternative to using standard fetch since receiving errors 
  componentDidMount() {
    axios.get('/fares')
      .then((response) => {
        const { fares } = response.data
        this.setState({
          zones: fares.zones,
          info: fares.info
        })
      })
      .catch((error) => {
      })
  }

  // Update React state
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  // Handle change in selected purchase
  handlePurchaseChange = (event) => {
    this.setState({
      selectedPurchase: event.target.value
    })
  }

  // Handle calculating the cost of fare including if 10+ tickets are purcahsed add discounted price
  calculateFareCost = () => {
    const { numberOfRides, selectedZone, selectedPurchase, selectedTime, zones } = this.state;
    const zone = zones.filter((zone) => zone.name === selectedZone)[0]
    const unitPrice = zone.fares.filter((fare) => fare.type === selectedTime && fare.purchase === selectedPurchase)[0].price

    if (numberOfRides >= 10) {
      const firstTenPrice = this.showDiscountedPrice()
      const otherTrips = numberOfRides - 10
      return (unitPrice * otherTrips) + firstTenPrice
    } else {
      return numberOfRides * unitPrice
    }
  }

  // calculate discounted price if purchase is anytime
  showDiscountedPrice = () => {
    const { zones, selectedZone } = this.state
    const zone = zones.filter((zone) => zone.name === selectedZone)[0]
    const price = zone.fares.filter((fare) => fare.type === "anytime")[0].price
    return price
  }

  render() {
    const { zones, info, selectedZone, rideTimes, selectedTime, selectedPurchase, purchaseOptions, numberOfRides } = this.state
    return (
      <div className="app">
        <header className="app-header">Regional Rail Fares</header>
        <div>
          <div>
            <h3> Where are you going?</h3>
            <select onChange={this.handleChange} name="selectedZone" value={selectedZone}>
              <option value=""></option>
              {
                zones.map((zone, index) => {
                  return <option key={index} value={zone.name}>{zone.name}</option>
                })
              }
            </select>
          </div>
          <div>
            <h3>When are you riding?</h3>
            <select onChange={this.handleChange} name="selectedTime" value={selectedTime}>
              <option value=""></option>
              {
                rideTimes.map((time, index) => {
                  return <option key={index} value={time}>{time}</option>
                })
              }
            </select>
            {selectedTime && <h5>{info[selectedTime]}</h5>}
          </div>
          <div>
            <h3>Where will you purchase the fare?</h3>
            <div>
              {
                purchaseOptions.map((option, index) => {
                  return <div key={index}>
                    <input onChange={this.handlePurchaseChange} type="radio" name={option} value={option} checked={option === selectedPurchase} />
                    <span>{option === "advance_purchase" ? "Station Kiosk" : "Onboard"}</span></div>
                })
              }
            </div>
          </div>
          <div>
            <h3>How many rides will you need?</h3>
            {selectedZone && selectedPurchase === "advance_purchase" && <div className="notice"> {`Get 10 trips at a discounted price of 
               $${this.showDiscountedPrice().toFixed(2)}`}. Valid anytime!
            </div>}
            <input type="number" value={numberOfRides} name="numberOfRides" onChange={this.handleChange} min={1} />
          </div>
          {numberOfRides && selectedPurchase && selectedTime && selectedZone && <div>
            <h3>Fare cost</h3>

            <h2>${this.calculateFareCost().toFixed(2)}</h2>
          </div>}
        </div>
      </div>
    );
  }
}

export default App;
