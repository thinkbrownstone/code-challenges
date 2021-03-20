/**
 * Hi :)
 * Purpose: A widget to calulator the cost of Septa Regional Rail 
 * Mindset: Divide widget parts into mutiple components
 * Worst Case: O(n)
 * Files used in:
 *    -index.js
 */

import React, { Component } from 'react';
import './App.css';

//Import json file
//haven't figure out how to do a ajax call to retrieve data 
import fareData from './fares.json';

//Anytime restriction constant
const ANYTIME_RESTRICTION = 10;

//Not really scalable :( 
const ticketTypeName = [
  {
    value: 'weekday',
    name: 'Weekdays'
  },
  {
    value: 'evening_weekend',
    name: 'Evening Weekends'
  },
  {
    value: 'anytime',
    name: 'Anytime'
  }
]

//Not really scalable :(
const purchaseName = [
  {
    value: 'advance_purchase',
    name: 'Station Kiosk'
  },
  {
    value: 'onboard_purchase',
    name: 'Onboard'
  }
]

//------------------------------------------------------------------------------------Header Component------------------------------------------------------------
class HeaderComponent extends Component{
  render(){
    const header = this.props.header;
    return(
        <h1 className="gray-section">{header}</h1>
    );
  }
}

//----------------------------------------------------------Form Components------------------------------------------------------------------------

class FormSubInfo extends Component{
  render(){
    const info = this.props.info
    return(
      <div>
        <br/>
        <span className="gray-info">{info}</span>
      </div>
    )
  }
}

function RideInputComponent (props) {
  
    //Input cannot be less than 1
  const inputValue = (props.dataValue < 1) ? 1 : props.dataValue;
  const purchaseType = props.purchaseType;
  const changeHandler = props.changeHandler;

  //Restricted number input
  if(purchaseType === 'anytime'){
    return(<div>
      <input className="ride-input" onChange={changeHandler} value={ANYTIME_RESTRICTION} type='number' disabled/>
      <br/>
      <br/>
      <span><b>Anytime</b> tickets are only avaliable for <b>{ANYTIME_RESTRICTION}</b> rides</span>
    </div>
    );
  }

  //Non-restricted number input
  else{
     return(
     <input className="ride-input" onChange={changeHandler} value={inputValue} type='number'/>
     );
  }
}

function RadioComponent(props){
  const dataName = props.dataName;
  const dataValue = props.dataValue;
  const selectedValue = props.selectedValue;
  const purchaseType = props.purchaseType;
  const changeHandler = props.changeHandler;

  //Disabled radio input
  if(purchaseType === 'anytime' && dataValue === 'onboard_purchase'){
    return(
      <div>
        <input type="radio" value={dataValue} checked={false} disabled onChange={changeHandler}/>
        <label className="gray-info">{dataName}</label>
        <br/>
        <span><b>Anytime</b> tickets are only avaliable from <b>Station Kiosk</b></span>
      </div>
    );  
  }

  //Enabled radio input
  else{
    return(
      <div>
        <input value={dataValue}  type="radio" checked={selectedValue === dataValue} onChange={props.onChange}/>
        <label>{dataName}</label>
      </div>
    );
  }
}

//Create form depended on input type
function formFactory (props, changeHandler) {
  const formType = props.formType;
  const dataSet = props.dataSet;
  const dataName = props.dataName;
  const dataValue = props.dataValue;
  const purchaseType = props.purchaseType;

  //Input form 
  if(formType === 'input'){
    return(<RideInputComponent dataValue={dataValue} purchaseType={purchaseType} changeHandler={changeHandler}/>)
  }

  //Option form
  else if(formType === 'option'){
    return (
      <select onChange={changeHandler}>
        {dataSet.map((info,i) => <option value={info[dataValue]} key={i}>{info[dataName]}</option>)}
      </select>
    )
  }

  //Radio Form
  else if(formType === 'radio'){
    return(
      <div className="radio-input">
        {dataSet.map((info,i) => <RadioComponent dataValue={info[dataValue]} dataName={info[dataName]} key={i} 
          onChange={changeHandler} selectedValue={props.selectedValue} purchaseType={purchaseType}/>)}
      </div>
    )
  }
}

//Component for header and form
class FormComponent extends Component{
  constructor(props){
    super(props);

    //Handler that updates on form change
    this.changeFormHandler = this.changeFormHandler.bind(this);
  }

  changeFormHandler(event){

    //Update parent change handler with form value
    this.props.changeHandler(event.target.value);
  }

  render(){
    const header = this.props.header
    return(
      <div>
        <h3>{header}</h3>
        {formFactory(this.props, this.changeFormHandler)}
      </div>
    );
  }
}

//-----------------------------------------------------------------------------Total Cost Component------------------------------------------------------------------

/**
 * Get total cost of cumulated data 
 * Worst Case: O(n)
 */
function getTotalCost (state) {
  //Filter to get specfic fare
  let fares = fareData.zones.filter(info => info.name === state.zone).map(info => info.fares)[0];

  //Filter to get specfic price
  let price = fares.filter(info => (info.type === state.type && info.purchase === state.purchase)).map(info => info.price)[0];

  return (state.type === 'anytime') ? price : price * state.rides
}

class TotalCostComponent extends Component {
  render(){
    const header = this.props.header;
    const total = this.props.totalCost;
    return(
      <div className="gray-section">
        <h3 id="total-header">{header}</h3>
        <h1 id="total">$ {total}</h1>
      </div>
    )
  }
}

//------------------------------------------------------------------------------Main Component------------------------------------------------------------------------
class App extends Component {
  constructor(props){
    super(props);

    //Set default values
    this.state={
      rides: 1,
      zone : fareData.zones[0].name,
      type: ticketTypeName[0].value,
      purchase: purchaseName[0].value
    }

    //Define change handlers
    this.zoneChangeHandler = this.zoneChangeHandler.bind(this);
    this.typeChangeHandler = this.typeChangeHandler.bind(this);
    this.purchaseChangeHandler = this.purchaseChangeHandler.bind(this);
    this.ridesChangeHandler = this.ridesChangeHandler.bind(this); 
  }

  zoneChangeHandler (value) {
    this.setState({
      zone: value
    })
  }

  typeChangeHandler (value) {

    //Call other handlers depended on restriction
    if(value === 'anytime'){
      this.purchaseChangeHandler(purchaseName[0].value);
      this.ridesChangeHandler(ANYTIME_RESTRICTION);
    }

    this.setState({
      type: value
    })
  }

  purchaseChangeHandler (value) {  
    this.setState({
      purchase: value
    })
  }

  ridesChangeHandler (value) {
    this.setState({
      rides: value
    })
  }

  render() {
    const totalCost = getTotalCost(this.state).toFixed(2);

    return (
      <div id="widget">
        {/*Top header*/ }
        <HeaderComponent header = "Regional Rail Fares"/>

        {/*Zone form*/ }
        <FormComponent formType="option" changeHandler={this.zoneChangeHandler} dataSet={fareData.zones} header = 'Where are you going?' dataValue='name' dataName ='name'/>
        <hr/>

        {/*Ticket type form*/ }
        <FormComponent formType="option" changeHandler={this.typeChangeHandler} dataSet={ticketTypeName} header = 'When are you riding?' dataValue='value' dataName ='name'/>
        <FormSubInfo info = {fareData.info[this.state.type]} />
        <hr/>

        {/*Purchase location form*/ }
        <FormComponent formType="radio" changeHandler={this.purchaseChangeHandler} dataSet={purchaseName} header = 'Where will you purchase the fare?' dataValue='value'
          purchaseType={this.state.type} dataName ='name' selectedValue={this.state.purchase}/>
        <FormSubInfo info = {fareData.info[this.state.purchase]} />
        <hr/>

        {/*Ride input form*/ }
        <FormComponent formType='input' dataValue={this.state.rides} changeHandler ={this.ridesChangeHandler} header='How many rides will you need?' purchaseType={this.state.type}/>
        
        {/*Total cost*/ }
        <TotalCostComponent totalCost={totalCost} header="Your fare will cost"/>
      </div>
    );
  }
}

export default App;
