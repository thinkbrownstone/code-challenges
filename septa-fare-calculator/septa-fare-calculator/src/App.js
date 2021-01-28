import React, { Component } from 'react';
import axios from 'axios';
import Header from './components/Header';
import FareForm from './components/FareForm';
import Fare from './components/Fare';
import './styles/styles.css';



export default class App extends Component {

  state = {
      faresData: undefined,
      selectedFareZone: 1,
      selectedTravelPeriod: 'weekday',
      selectedPurchaseLoc: 'advance_purchase',
      selectedRidesTotal: 1,
      totalFare: 4.75,
    }

  handleSelection = (zoneSelection, travelPeriodSelection, purchaseLocSelection, ridesSelection, totalFare) => {
    
    this.setState({
      selectedFareZone: zoneSelection,
      selectedTravelPeriod: travelPeriodSelection,
      selectedPurchaseLoc: purchaseLocSelection,
      selectedRidesTotal: ridesSelection,
      totalFare: totalFare
    });
  }

  componentWillMount = () => {
    // Get JSON data form source and store in state
    axios.get('https://raw.githubusercontent.com/KingYam/code-challenges/master/septa-fare-calculator/fares.json') // path to JSON here
    .then(response => {
      this.setState({
        faresData: response.data
      });
    })
    .catch(function (error) {
       console.log(error);
     });
  }

  render() {
    if(!this.state.faresData){
      return(
        // make sure fares data was gathered from JSON
        <div className="App">
          <Header />
          <h1>We're Sorry</h1>
          <h3>There appears to be an issue with our data source, please check back again later.</h3>
        </div>
        );
    }
    else {
      return (
        <div className="App">
          <Header />
          <FareForm 
            faresData={this.state.faresData}
            handleSelection={this.handleSelection} 
            selectedFareZone={this.state.selectedFareZone}
            selectedTravelPeriod={this.state.selectedTravelPeriod}
            selectedPurchaseLoc={this.state.selectedPurchaseLoc}
            selectedRidesTotal={this.state.selectedRidesTotal}
          />
          <Fare 
            totalFare={this.state.totalFare}
          />
        </div>
      );
    }    
  }
}