import React, { Component} from 'react';
import { connect } from 'react-redux'
import { reduxForm, Field, Fields } from 'redux-form';
import renderTotal from './renderTotal'
import helperText from './helperText'

class SeptaForm extends Component {

  render() {
    const {data} = this.props
    const zones = data["zones"]

    const where = zones.map((zone)=> (
      <option key={zone["zone"]} value={zone["zone"]}>{zone["name"]}</option>
    ))

    const when = [
      <option value="anytime">Anytime</option>,
      <option value="evening_weekend">Evening Weekend</option>,
      <option value="weekday">Weekday</option>
    ]

    return (
      <form>
        <div className="form-block header-block">
          <h1 className="title">  <img img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/SEPTA.svg/500px-SEPTA.svg.png" alt="septa" /> Regional Rail Fares</h1>
        </div>

        <div className="form-block">
          <h3>Where are you going?</h3>
          <Field name="zone" component="select">
            {where}
          </Field>
        </div>

        <div className="form-block">
          <h3>When are you riding?</h3>
          <Field name="type" component="select">
            {when}
          </Field>
          <Field name="type" component={helperText} data={data} />
        </div>

        <div className="form-block">
          <h3>Where will you purchase the fare?</h3>
          <label><Field name="purchase" component="input" type="radio" value="advance_purchase"/> Station Kiosk</label>
          <label><Field name="purchase" component="input" type="radio" value="onboard_purchase"/> Onboard</label>
          <Field name="purchase" component={helperText} data={data} />
        </div>

        <div className="form-block">
          <h3>How many rides will you need?</h3>
          <Field name="amount" component="input"/>
        </div>

        <div className="form-block header-block">
          <Fields names={[ 'zone', "type", "purchase", "amount" ]} component={renderTotal} data={zones}/>
        </div>
      </form>
    );
  }
}

SeptaForm = reduxForm({
  form: 'septa'
})(SeptaForm)

SeptaForm = connect(
  state => ({initialValues: {
    zone: 1,
    type: "weekday",
    purchase:"advance_purchase",
    amount: 1
  }})
)(SeptaForm)

export default SeptaForm
