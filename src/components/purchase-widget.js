import React, { Component } from 'react'
import styles from './purchase-widget.module.css';
import { ReactComponent as SeptaLogo } from './SEPTA.svg';

class PurchaseWidget extends Component {
  constructor(props) {
    super(props);
    
    this.onChangeZone = this.onChangeZone.bind(this);
    this.onChangeWhen = this.onChangeWhen.bind(this);
    this.onChangePurchase = this.onChangePurchase.bind(this);
    this.onChangeRides = this.onChangeRides.bind(this);

    this.state = {
      zoneOptions: [{value: 'loading', label: 'Loading...'}],
      whenOptions: [
        { value: 'weekday', label: 'Weekdays' },
        { value: 'evening_weekend', label: 'Evening/Weekend' },
        { value: 'anytime', label: 'Anytime' }
      ],
      zone: 0,
      when: 'weekday',
      whenHelper: '',
      purchase: 'onboard_purchase',
      cost: 0,
      rideCount: 1
    };
  }

  componentDidMount() {
    fetch("https://raw.githubusercontent.com/thinkcompany/code-challenges/master/septa-fare-calculator/fares.json")
    .then(res => res.json())
    .then(
      (result) => {
        let zones = {};
        result.zones.forEach((zone) => {
          zones[zone.zone] = zone;
        });

        this.setState({
          info: result.info,
          whenHelper: result.info[this.state.when],
          zones,
          zone: result.zones[0].zone,
          zoneOptions: result.zones.map((zone) => ({
            value: zone.zone,
            label: zone.name
          }))
        })
      }
    )
  }

  onChangeZone(event) {
    this.setState({zone: event.target.value});
  }

  onChangeWhen(event) {
    let changes = {
      when: event.target.value,
      whenHelper: this.state.info[event.target.value]
    };
    if (event.target.value === "anytime") {
      changes.purchase = "advance_purchase";
    }

    this.setState(changes);
  }

  onChangePurchase(event) {
    this.setState({
      purchase: event.target.value,
      purchaseHelper: this.state.info[event.target.value]
    });
  }

  onChangeRides(event) {
    this.setState({rideCount: event.target.value});
  }

  componentDidUpdate(prevProps, prevState) {
    const zone = this.state.zones[this.state.zone];
    const rideCount = this.state.rideCount;
    const fare = zone.fares.find( fare => fare.type === this.state.when && fare.purchase === this.state.purchase );
    const cost = fare.trips === 1 ? fare.price * rideCount : Math.ceil( rideCount / fare.trips ) * fare.price;
    if ( cost !== prevState.cost) {
      this.setState({cost});
    }
  }

  render() {
    return <div className={styles['purchase-widget']}>
      <div className={styles.head}>
        <SeptaLogo className={styles['septa-logo']} alt="SEPTA logo" />
        Regional Rail Fares
      </div>

      <section className={styles.section}>
        <label className={styles['select-label']} htmlFor="purchase-widget-zone">Where are you going?</label>
        <div className={styles.selectDiv}>
          <select id="purchase-widget-zone" className={styles.select} onChange={this.onChangeZone} >
            {this.state.zoneOptions.map((opt) =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
        </div>
      </section>

      <section className={styles.section}>
        <label className={styles['select-label']} htmlFor="purchase-widget-when">When are you riding?</label>
        <div className={styles.selectDiv}>
          <select id="purchase-widget-when" className={styles.select} onChange={this.onChangeWhen}>
            {this.state.whenOptions.map((opt) =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
        </div>
        <p className={styles['when-helper']}>{this.state.whenHelper}</p>
      </section>

      <section className={styles.section}>
        <p>Where will you purchase the fare?</p>
        <div className={styles['radio-group']}>
          <div className={styles['radio-option']}>
            <input type="radio" id="purchase-widget-purchase-station"
              name="purchase" value="advance_purchase" checked={this.state.purchase === "advance_purchase"}  onChange={this.onChangePurchase} />
            <label htmlFor="purchase-widget-purchase-station">Station Kiosk</label>
          </div>

          <div className={styles['radio-option']}>
            <input type="radio" id="purchase-widget-purchase-onboard"
              name="purchase" value="onboard_purchase" checked={this.state.purchase === "onboard_purchase"}  onChange={this.onChangePurchase} />
            <label htmlFor="purchase-widget-purchase-onboard">Onboard</label>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <label className={styles['input-label']} htmlFor="purchase-widget-rides">How many rides will you need?</label>
        <input type="text" id="purchase-widget-rides" className={styles['input-text']} value={this.state.rideCount} onChange={this.onChangeRides} />
      </section>

      <section className={styles.foot}>
        <p className={styles['cost-heading']}>Your fare will cost</p>
        <p className={styles['cost']}>${this.state.cost.toFixed(2)}</p>
      </section>
    </div>
  }
}

export default PurchaseWidget;
