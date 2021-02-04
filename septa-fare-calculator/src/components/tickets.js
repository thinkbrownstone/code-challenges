import React from "react";

export default class Where extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        {/*React Fragment is used in place of a div and because not all browsers support <><> tags*/}
        <label>
          How many
          {this.props.anytimeCheck ? <strong> packs of </strong> : " "}
          tickets will you need?
        </label>
        {/*Prevent anything but numbers from being typed and set the lowest possible number to 0 tickets*/}
        <input
          type="number"
          pattern="[0-9]*"
          name="tickets"
          min="0"
          onChange={this.props.change}
          value={this.props.tickets}
        />
      </React.Fragment>
    );
  }
}
