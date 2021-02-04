//contact info Noel Farris noel.farris@gmail.com 210-776-6486
//I decided to use react for this challenge. I havent used react in years so I took much more time than usual to complete the challenge.
//npm start to run local server
//Have fun!

import React, { Component } from 'react';
import Fares from './fares.json'
import './App.css';
import Img from './500px-SEPTA.png';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zone: '',
      faresType: '',
      faresPurchase: '',
      faresTrips: '',
      farePrice: null,
      disabled: null
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.checkInputValidation = this.checkInputValidation.bind(this);
    this.getPrice = this.getPrice.bind(this);
  }

  componentWillMount() {
    //importing fares.json instead of using fetch due to local host not recognizing filepath during fetch.
    // fetch('./fares.json').then(response => {
    //   return response.json();
    // }).then(data => {
    //   console.log(data);
    // }).catch(err => {});
    this.zones = [];
    this.fareTypes = [];
    Fares.zones.map(zone => this.zones.push(zone.name));
    Fares.zones[0].fares.map(fare => this.fareTypes.push(fare.type.replace(/_/g," ")));
    this.fareTypes = [...(new Set(this.fareTypes))];
    this.setState({
      zone: this.zones[0],
      faresType: this.fareTypes[0]
    })
  }

  handleInputChange(e) {
    //when you select anytime as the purchace time I am disabling the onboard purchase option. I assume you can only purchace anytime tickets from a kiosk.
    const {value, name} = e.target
    if(name === 'faresType' && value === 'anytime') {
      document.getElementById('onboard_purchase').checked = false;
      document.getElementById('advance_purchase').checked = true;
      this.setState({
        faresPurchase: 'advance_purchase',
        [name]: value
      }, () => {
        this.checkInputValidation();
      })
    } else {
      this.setState({
        [name]: value
      }, () => {
         this.checkInputValidation();
      })
    }
  }

  checkInputValidation() {
    let validated = true;
    Object.keys(this.state).forEach(key => {
      if(this.state[key] === '') {
        validated = false;
      }
    });
    if(validated) {
      this.getPrice();
    }
  }

  getPrice() {
    //when kiosk is selected with a number of 10 tickets I display the discounted anytime price.
    //if you have selected a time where 10 tickets is less than the discounted price I am displaying the cheaper price.
    const anytimeToWeekday = this.state.faresType === 'anytime' ? 'weekday' : this.state.faresType;
    const selectedZone = Fares.zones.find( zone => zone.name === this.state.zone );
    const selectedFareType = selectedZone.fares.filter( fare => fare.type === anytimeToWeekday.replace(/ /g,"_"));
    const selectedFarePurchase = selectedFareType.find( fare => fare.purchase === this.state.faresPurchase);
    const currentPrice = selectedFarePurchase.price * this.state.faresTrips;
    let finalPrice = currentPrice;
    if(this.state.faresTrips === "10" && this.state.faresPurchase === 'advance_purchase' ) {
      const anyPrice = selectedZone.fares.find( fare => fare.type === 'anytime');
      if(anyPrice.price < currentPrice) {
        finalPrice = anyPrice.price;
      }
    }
    this.setState({
      farePrice: "$" + finalPrice.toFixed(2)
    })
  }

  render() {
    //showing message when discounted price conditions are met
    let showSpecialRate = false;
    const isDisabled = this.state.faresType === 'anytime' ? true : false;
    if(this.state.faresTrips === "10" && this.state.faresPurchase === "advance_purchase") {
      showSpecialRate = true;
    }
    return (
      <form className='fareForm'>
        <header className="header">
          <img src={Img} className="logo"/>
          <h3 className="title">Regional Rail Fares</h3>
        </header>
        <div className="formSections">
          <label>
            Where are you going?
            <select
            className='selectForm'
            name={'zone'}
            onChange={this.handleInputChange}>
              {this.zones.map((x,y) => <option key={y}>{x}</option>)}
            </select>
          </label>
        </div>
        <div className="formSections">
          <label>
          When are you riding?
            <select
              id="faresType"
              className='selectForm'
              name={'faresType'}
              onChange={this.handleInputChange}>
              {this.fareTypes.map((x,y) => <option key={y}>{x}</option>)}
            </select>
          </label>
        </div>
        <div className="formSections">
        <label>
        Where will you purchace the fare?
        </label>
        <div className="radioForm top">
        <input
          type="radio"
          id="onboard_purchase"
          name="faresPurchase"
          value="onboard_purchase"
          disabled = {isDisabled}
          onChange={this.handleInputChange}/>
        <label className="radioLabel">Onboard</label>
        </div>
        <div className="radioForm bottom">
        <input
          type="radio"
          id="advance_purchase"
          name="faresPurchase"
          value="advance_purchase"
          onChange={this.handleInputChange}/>
        <label className="radioLabel">Station Kiosk</label>
        </div>
        </div>
        <div className="formSections">
        <label>
          How many rides will you need?
          {showSpecialRate ? <p>Buy 10 tickets in advance for a special rate</p> : null}
          <input
            id={'faresTrips'}
            className="bottom"
            name={'faresTrips'}
            type="number"
            max="10"
            value={this.state.faresTrips}
            onChange={this.handleInputChange}/>
        </label>
        </div>
        <div className="formCost">
        <label>Your fare will cost</label>
        <h2>{this.state.farePrice}</h2>
        </div>
      </form>
    );
  }
}

export default App;
