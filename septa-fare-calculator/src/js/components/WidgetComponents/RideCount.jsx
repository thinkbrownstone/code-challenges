import React from 'react';

class RideCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rideCount: 1
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.props.onCountChange(event.target.value);
        this.setState({ rideCount: event.target.value });
    }

    render() {
        return (
            <div className="ride-count-container">
                <h1>How many rides will you need?</h1>
                <input type="text" onChange={this.handleInputChange} value={this.state.rideCount} />
            </div>
        );
    }
}

export default RideCount;
