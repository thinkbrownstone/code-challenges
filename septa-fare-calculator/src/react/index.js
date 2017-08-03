import React from 'react';
import ReactDOM from 'react-dom';
import SeptaForm from './components/form'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux';
import { reduxForm, reducer as formReducer } from 'redux-form'

const rootReducer = combineReducers({
  form: formReducer
})

const store = createStore(rootReducer)

const data = require('../../src/data/fares.json');

ReactDOM.render(
  <Provider store ={store}>
    <SeptaForm data={data}/>
  </Provider>,
  document.getElementById('app')
);
