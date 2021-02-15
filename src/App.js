import React, { Component } from 'react';
import './App.css';
import SelectBox from './SelectBox.js';
import axios from 'axios';
import RadioButtons from './RadioButtons';
import InputBox from './InputBox';
import logo from './septa.png'; // Tell Webpack this JS file uses this image

class App extends Component {
  constructor(props) {
    super(props);
    // 
    this.state = {
      selected: {
        zone: null,
        type: null,
        location: null,
        count: 1
      }
    }
  
    // bind functions in container to this class, per react standards
    this.getData = this.getData.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.calcTotal = this.calcTotal.bind(this);
    this.HeaderImage = this.HeaderImage.bind(this);
    this.Footer = this.Footer.bind(this);

    this.getData();
  }

  // get septa data from github
  getData () {
    axios.get(`https://raw.githubusercontent.com/thinkcompany/code-challenges/master/septa-fare-calculator/fares.json`)
    .then(response => {
      const data = response.data;

      // define a function to take a convert a string
      // from snake_case to Title Case for displaying
      // options
      let prettify = function(str){
        return str.toLowerCase().replace(/_/, ' ').replace( /\b\w/g, function (m) {
            return m.toUpperCase();
        });
      };

      // define a function to return only unique
      // values in an array of options for a 
      // particular question
      let unique = function(arr) {
        return arr.filter(function (elem, index, self) {
          var value = elem.value; 
          return self.findIndex(elem => elem.value === value) === index;
        });
      }

      /*       
        define an array of objects representing possibles zones for a user
        to select from
      */
      var zones = data.zones.map(zone => {
        return {
          value: parseInt(zone.zone), //the value with which the app will do logic and make selections
          display: zone.name //what the user will see when selecting this zone
        }
      });
  
      /* 
        map over the fares in the first zone to create a list of possible 
        purchase "types" and "locations" (aka "purchase") from which a user 
        can choose.

        assumes that the all zones have the same organizational structure for
        their fares, where the price has been broken down by type, then purchase. 
      */
      var types = unique(data.zones[0].fares.map(fare => { //implemented the above "unique" function to make sure that there weren't duplicate values
        return {
          value: fare.type, //the value with which the app will do logic and make selections
          display: prettify(fare.type), //what the user will see when selecting this option, converted to Title Case
          info: data.info[fare.type] //additional information for the user to make sense of this selection
        }
      })) 
      
      // same logice as the types
      var locations = unique(data.zones[0].fares.map(fare => {
        return {
          value: fare.purchase,
          display: prettify(fare.purchase),
          info: data.info[fare.purchase]
        }
      }));

        this.setState({
          data: data, //core data retrieved for pricing reference and Math
          options: { // options from which the user can select a zone, type, or location
            zones: zones, 
            types: types, 
            locations: locations,
          },
          // object defining what the user has selected
          selected: { //setting default values for when the user first sees the page
            zone: zones[0].value, 
            type: types[0].value,
            location: locations[0].value,
            count: 1
          }
        });
        
        // calculate first total
        this.calcTotal();
    })
  }

  // set the user's selected option for 
  // the question
  handleSelect(question, event) {
    let selected = this.state.selected;
    var value = event.target.value;
    // if the value is count, set it to an int, otherwise fine as is
    selected[question] = (question !== 'count') ? value : parseInt(value);
    this.setState({selected});
    this.calcTotal();
  } 

  // return the header image
  HeaderImage() {
    // Import header image
    return <img src={logo} alt="Logo" className="logo" />;
  }

  /* sets the validitiy of user input
     if the selected type is not 'anytime', anything over 0 is fine
     otherwise, anytime tickets can only be bought in multiples of 10
  */
  valid() {
    if (this.state.selected.type !== 'anytime') {
      return this.state.selected.count >= 1;
    } else {
      return this.state.selected.count >= 10 && this.state.selected.count % 10 === 0;      
    }
  }
  

  /* 
    calculates the total based on the currently selected options for each question
    if the total is greater than 10 and tickets are bought in advanced, the anytime
    bulk price is applied to the total in multiples of ten, with the rest of the 
    price being based on the type and location of the ticket.  
  */
  calcTotal() {
    let selected = this.state.selected;
    let data = this.state.data;
    let zone = data.zones.find(zone => zone.zone === selected.zone);
    let total = 0.0;

    // anywhere price is needed if the selcted type is "anytime" or the location
    // is "advanced_purchase" and the count is greater than 10
    let needAnywherePrice = (selected.location === 'advance_purchase' 
      && selected.count >= 10) || (selected.type === 'anytime');
    
    if (needAnywherePrice) {
      let anytimeFare = zone.fares.find(fare => fare.type === 'anytime').price;
      let lowerFare = zone.fares.find(fare => fare.type === selected.type && 
        fare.purchase === selected.location).price;
      let lowerCount = selected.count % 10;
      let anytimeCount = Math.floor(selected.count / 10);
      
      // total = the bulk ticket price * the amount of tickets that can be bought
      // in bulk (i.e. highest multiple of 10) + regular ticket price * the amount
      // tickets that must be bought based on the time and location (i.e. the remainder
      // of the count / 10) 
      total = anytimeCount * anytimeFare + lowerCount * lowerFare;
    } else {
      let fare = zone.fares.find(fare => fare.type === selected.type 
        && fare.purchase === selected.location);
        // total = the fare with the same type and location's price * the count
      total = fare.price * selected.count;
    }
    // set the total to pad 2 0's if the total is a whole number
    total = total.toFixed(2);

    this.setState({
      total: total
    });
  }

  // return the appropriate footer based on the validity of the user input
  Footer() {
    if (this.valid()) {
      return (<footer>Your Total Is <br /><span className="total">${this.state.total}</span></footer>)
    } else if (this.state.selected.type === 'anytime') {
      return <footer className="invalid">Tickets bought in bulk for any time must be bought in groups of 10.</footer>      
    } else {
      return <footer className="invalid">Invalid Count</footer>      
    }
  }

  render() {
    let data = this.state.data;
    // only return the app if the data has loaded
    if (data) {
      // define the info for the type based on what's selected
      let typeInfo = data.info[this.state.selected.type]
      
      return (
        <div className="container">
          <header> <this.HeaderImage /> Regional Rails Fares</header>
          <form> 
            <SelectBox // a component that returns a select box and
              question="zone" //the type of question that this component is controller
              label="Where are you going?" //the label that this component will have
              options={this.state.options.zones} //an array of options from which to select
              onChange={this.handleSelect.bind(this, "zone")} //the function that sets the currently selected input
            />
            <SelectBox question="type" label="When are you leaving?" options={this.state.options.types} onChange={this.handleSelect.bind(this, "type")} 
              info={typeInfo} //descriptive information on the currently selected option
            />
            <RadioButtons question="location" label="What kind of purchase is this?"  options={this.state.options.locations} onChange={this.handleSelect.bind(this, "location")} 
            selected={this.state.selected.location} //currently selected location to show which radio buttio should be selected
            />
            <InputBox question="count" label="How Many Tickets will you need?" type="number" onChange={this.handleSelect.bind(this, "count")} value={this.state.selected.count} v
            alid={this.validInput} //function returning the validity of the user input
            />
          </form>
          <this.Footer></this.Footer>
        </div>
      );        
    } else {
      return '';
    }
  }
}


export default App;
