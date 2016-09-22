import React from 'react';

export default class Input extends React.Component {
  render() {
    const { onChange, name, value } = this.props;
    return (
      <div>
        {this.props.children}
        <input type="text"
        value={value}
        onChange={(evt) => { onChange(name, evt.target.value); }}
        ></input>
      </div>
    );
  }
}

Input.propTypes = {
};
