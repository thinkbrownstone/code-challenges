import React from "react";

export default class Where extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <label>Where would you like to go?</label>
        <select value={this.props.where} onChange={this.props.change}>
          <option value={1}>Zone 1</option>
          <option value={2}>Zone 2</option>
          <option value={3}>Zone 3</option>
          <option value={4}>Zone 4</option>
        </select>
      </React.Fragment>
    );
  }
}
