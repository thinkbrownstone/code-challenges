import React, { Component} from 'react';

class renderTotal extends Component {

  render() {
    const {zone, type, amount, purchase, data} = this.props

    const findZone = (zones) => {
      return zones.zone === parseInt(zone.input.value);
    }

    const findPrice = (fares) => {
      return fares.type === type.input.value && fares.purchase === purchase.input.value
    }

    const price = data.find(findZone)["fares"].find(findPrice)["price"]

    const total = amount.input.value ? price * parseInt(amount.input.value) : "please enter a vaild amount for number of tickets"

    return (<div className="title">
      <h2>Your fare will cost</h2>
      <h1>${total}</h1>
    </div>
    );
  }
}

export default renderTotal
