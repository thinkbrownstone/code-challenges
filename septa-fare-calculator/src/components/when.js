import React from "react";

export default class Where extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <label>When would you like to ride?</label>
        <select value={this.props.when} onChange={this.props.change}>
          <option value="weekday">Weekday</option>
          <option value="evening_weekend">Evening Weekend</option>
          <option value="anytime">Anytime</option>
        </select>
      </React.Fragment>
    );
  }
}
