import _ from 'lodash';
import findLowestFare from './util';

const initialState = {

  // The initial state of the widget. Separated into data and ui state.

  data: {
    zones: [],
    info: {},
    timesToRide: [
      { name: 'Weekdays', value: 'weekday' },
      { name: 'Evening/Weekend', value: 'evening_weekend' }],
    farePurchaseLocations: [
      { name: 'Station Kiosk', value: 'advance_purchase' },
      { name: 'Onboard', value: 'onboard_purchase' }],
  },

  // The initial UI state is naive --
  // it should really default to the first available value from the server
  zone: 'CCP/1',
  time: 'weekday',
  purchaseLocation: 'advance_purchase',
  ridesNeeded: 1,
  totalFare: 0,
};

// These are the actions that can affect the state.
export default function data(state = initialState, action) {
  switch (action.type) {
    case 'RECEIVE_RECORD': // Places the received data into the data state.
      return Object.assign({}, state, _.set(
        state, action.path,
        action.object
      ));
    case 'UPDATE_FIELD': // Updates a UI field with the value that the user supplied.
      return Object.assign({}, state, {
        [action.field]: action.value,
      });
    case 'RECALCULATE': // Recalculates the total fare.
      return Object.assign({}, state, {
        totalFare: findLowestFare(
          state.data.zones
        .filter(item => (
        item.name === state.zone))[0].fares
        .filter(item => (
          item.type === state.time || item.type === 'anytime'))
        .filter(item => (
          item.purchase === state.purchaseLocation
        )), state.ridesNeeded),
      });
  }
  return state;
}
