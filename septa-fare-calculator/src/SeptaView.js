import React from 'react';
import { connect } from 'react-redux';
import Dropdown from './Components/Dropdown';
import Radio from './Components/Radio';
import Input from './Components/Input';
import fetchValue from './DataActions';
import './SeptaView.css';

class SeptaView extends React.Component {
  componentWillMount() {
    this.props.getZones();
  }

  render() {
    const { zone, zones, timesToRide, time,
      farePurchaseLocations, purchaseLocation,
      ridesNeeded, totalFare, onChange } = this.props;
    return (
      <div className="container">
        <header><h1>Regional Rail Fares</h1></header>
        <ul className="panels">
          <li>
            <Dropdown
              values={zones}
              activeValue={zone}
              name="zone"
              onChange={onChange}
              >
              <label>Where are you going?</label>
             </Dropdown>
          </li>
          <li>
            <Dropdown values={timesToRide}
              name="time"
              activeValue={time}
              onChange={onChange}>
              <label>When are you riding?</label>
            </Dropdown>
          </li>
          <li>
            <Radio values={farePurchaseLocations} activeValue={purchaseLocation} name="purchaseLocation" onChange={onChange}>
              <label>Where will you purchase the fare?</label>
            </Radio>
          </li>
          <li>
            <Input name="ridesNeeded" value={ridesNeeded} onChange={onChange}>
              <label>How many rides will you need?</label>
            </Input>
          </li>
          <li className="total">Your fare will cost <div>
          <span className="total-fare">${totalFare.toFixed(2)}</span>
          </div></li>
        </ul>
      </div>
    );
  }
}
SeptaView.propTypes = {};
SeptaView.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  zones: state.data.zones,
  ridesNeeded: state.ridesNeeded,
  timesToRide: state.data.timesToRide,
  time: state.time,
  purchaseLocation: state.purchaseLocation,
  farePurchaseLocations: state.data.farePurchaseLocations,
  totalFare: state.totalFare,
});

const mapDispatchToProps = dispatch => ({
  getZones: () => {
    dispatch(fetchValue('zones')).then(() => {
      dispatch({ type: 'RECALCULATE' });
    });
    dispatch(fetchValue('info'));
  },
  onChange: (field, value) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
    dispatch({ type: 'RECALCULATE' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SeptaView);
