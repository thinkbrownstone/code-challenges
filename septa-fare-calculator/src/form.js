import React from "react";
import axios from "axios";
import Where from "./components/where";
import When from "./components/when";
import How from "./components/how";
import Tickets from "./components/tickets";

export default class Form extends React.PureComponent {
  //Initialize state
  state = {
    error: null,
    railwayData: [],
    where: 1,
    when: "weekday",
    how: "onboard_purchase",
    tickets: 0,
    anytimeCheck: false,
    total: 0
  };

  componentWillMount = () => {
    // Locally import the JSON object and move it to state for easy access.
    // An alternitive to axios is the built in React fetch api
    axios
      .get("./info.json")
      .then(response => {
        this.setState({
          railwayData: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  //Handle changes to the destination
  //Update the price using a callback to ensure the price is updated asynchronously.
  //Attach this asynch callback to all handlers

  handleWhere(event) {
    this.setState({ where: event.target.value }, this.updatePrice);
  }

  //Handle changes to the time of day a rider wants to take the train
  //Use this check to signal whether or not the special case of "anytime" is active
  handleWhen(event) {
    event.target.value === "anytime"
      ? this.setState(
          { when: "anytime", how: "advance_purchase", anytimeCheck: true },
          this.updatePrice
        )
      : this.setState(
          { when: event.target.value, anytimeCheck: false },
          this.updatePrice
        );
    this.updatePrice();
  }

  //Handle change to the method of purchase
  handleHow(event) {
    this.state.anytimeCheck === true
      ? this.setState({ how: "advance_purchase" }, this.updatePrice)
      : this.setState({ how: event.target.value }, this.updatePrice);
  }

  //Handle change to the number of tickets requested
  //Should check against strange inputs and have a limit for ticket requests
  handleTickets(evt) {
    const tickets = evt.target.validity.valid
      ? evt.target.value
      : this.state.tickets;

    this.setState({ tickets }, this.updatePrice);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  //Update the price by using the values of the form in a JSON query that fetches the price of ticket
  //An alternative would be a recursive function to dive into nested arrays
  //Another alternative would perhaps to be to flatten the array using reduce before querying

  updatePrice() {
    const calculatedPrice =
      this.state.railwayData.zones[this.state.where - 1].fares
        .filter(fare => fare.type === this.state.when)
        .filter(fare => fare.purchase === this.state.how)[0].price *
      this.state.tickets;
    console.log(calculatedPrice + "  woah look, it's the price");

    this.setState({ total: calculatedPrice });
  }

  render() {
    return (
      <main>
        {/* Component the header out and remove harded logo/name for reusablility*/}

        <div className="header">
          <img
            alt="Logo for SEPTA Railyway"
            src="logo.png"
            width="50px"
            height="50px"
          />
          <h2>Regional Rail Fares</h2>
        </div>
        {/* Are forms IE8 compt? Check to see.*/}

        <form onSubmit={this.handleSubmit} className="form">
          {/*The Where comp allows users to select a destination and updates state accordingly*/}
          <Where
            change={this.handleWhere.bind(this)}
            where={this.state.where}
          />
          {/*The When comp allows users to select what time of day they want the ticket and updates state accordingly*/}
          <When change={this.handleWhen.bind(this)} when={this.state.when} />
          {/*The Hoe comp allows users to select their desired method for buying the ticket and updates state accordingly*/}
          <How change={this.handleHow.bind(this)} how={this.state.how} />
          {/*The Tickets comp keeps track of tickets needed and updates state accordingly*/}
          <Tickets
            change={this.handleTickets.bind(this)}
            tickets={this.state.tickets}
            anytimeCheck={this.state.anytimeCheck}
          />
        </form>
        {/*This should be swapped out for a functional component if there is extra time*/}
        <h4>Your fare will cost</h4>
        <h1>${this.state.total}</h1>
      </main>
    );
  }
}
