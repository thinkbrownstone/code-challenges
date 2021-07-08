import React, { Component } from 'react';

class Timings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTime: 'weekday'
        }
    }

    onSelectChange(newTime) {
        this.setState({ selectedTime: newTime });
        this.props.timingChange(newTime);
    }

    render() {
        let {timings} = this.props;

        let timingOptions = timings.map((timing, idx) => {
            return <option value={timing.keyword} key={idx}>{timing.name}</option>
        });

        return (
            <div className="timings-container">
                <h1>When are you riding?</h1>
                <select value={this.state.selectedTime} name="timings" onChange={ event => this.onSelectChange(event.target.value) }>
                    {timingOptions}
                </select>
                <div className="timing-hint">
                    <span className="fa fa-exclamation-circle"></span>
                    {this.props.keyInfo[this.state.selectedTime]}
                </div>
            </div>
        );
    }
}


export default Timings;