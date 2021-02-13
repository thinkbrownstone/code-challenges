import React from "react";

import Number from "./Number";
import Radio from "./Radio";
import Select from "./Select";
import Store from "./Store";

class FareCalculator extends React.Component {

    componentDidMount () {
        // subscribe to store and fetch data
        Store.subscribe(this.storeDidChange.bind(this));
        Store.fetchData();
    }

    storeDidChange () {
        //update state when store has changed
        const { count, zone, time, location } = Store;
        this.setState({ count, zone, time, location });
    }

    render () {
        return (
            <div className="wrapper">
                <div className="module-fare-calculator">
                    <section className="module-title dark no-border">
                        <img className="logo" src="septa-logo.svg" width="30" height="25" alt="SEPTA logo" />
                        <h2 className="title">Regional Rail Fares</h2>
                    </section>
                    <section className="module-section">
                        <h3 className="section-header">
                            Where are you going?
                        </h3>
                        <Select
                            options={Store.zoneOptions}
                            onChange={Store.setZone}
                        />
                    </section>
                    <section className="module-section">
                        <h3 className="section-header">
                            When are you riding?
                        </h3>
                        <Select
                            options={Store.timeOptions}
                            onChange={Store.setTime}
                        />
                        <p className="small-type">
                            {Store.whenHelper}
                        </p>
                    </section>
                    <section className="module-section">
                        <h3 className="section-header">
                            Where will you purchase the fare?
                        </h3>
                        <Radio
                            name="location"
                            options={Store.locationOptions}
                            onChange={Store.setLocation}
                        />
                        <p className="small-type">
                            {Store.whereHelper}
                        </p>
                    </section>
                    <section className="module-section no-border">
                        <h3 className="section-header">
                            How many rides will you need?
                        </h3>
                        <Number
                            options={Store.countOptions}
                            onChange={Store.setCount}
                        />
                    </section>
                    <section className="module-section dark">
                        <h3 className="section-header">
                            Your fare will cost
                        </h3>
                        <p className="large-type">${Store.cost}</p>
                    </section>
                </div>
            </div>
        );
    }
}
export default FareCalculator;
