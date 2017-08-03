import React, { Component} from 'react';

class helperText extends Component {

  render() {
    console.log(this.props)
    const {input, data} = this.props

    return <p className="helper-text">{data["info"][input.value]}</p>;
  }
}

export default helperText
