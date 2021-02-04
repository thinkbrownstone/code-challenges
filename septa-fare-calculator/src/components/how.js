import React from "react";

export default class Where extends React.PureComponent {
  render() {
    return (
      <div>
        <label htmlFor="radio">
          <input
            type="radio"
            value="advance_purchase"
            checked={this.props.how === "advance_purchase"}
            onChange={this.props.change}
          />
          In Advance
        </label>
        <label htmlFor="radio1">
          <input
            type="radio"
            value="onboard_purchase"
            checked={this.props.how === "onboard_purchase"}
            onChange={this.props.change}
          />
          Onboard
        </label>
      </div>
    );
  }
}
