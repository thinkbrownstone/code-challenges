import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class Example extends React.Component {
  render() {
    return (
      <Form className="container col-md-5 p-5">
      <h2 class="display-4 p-1">
      <Label for="container" className="text-center"><img className="col-md-2" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/SEPTA_text.svg/1200px-SEPTA_text.svg.png" />Regional Rail Fares</Label>
      </h2>
        <FormGroup>
          <Label for="examplePassword" className="text-center p-3 center-block">Where are you going?</Label>
          <Input type="select" name="select" id="exampleSelect">
            <option>CCP/1</option>
            <option>Zone 2</option>
            <option>Zone 3</option>
            <option>Zone 4</option>
            <option>Zone 6 (Now NJ)</option>
          </Input>
        </FormGroup>
        <FormGroup>
        <Label for="examplePassword" className="text-center p-3">When are you riding?</Label>
        <Input type="select" name="select" id="exampleSelect">
          <option>Weekday</option>
          <option>Evening</option>
          <option>Weekend</option>
        </Input>
        <div className="p-2 center">
        <Link to="/help" color="primary">Explanation of the above options</Link>
        </div>
      </FormGroup>
        <FormGroup tag="fieldset" className="p-2 center">
          <legend>Where will you purchase?</legend>
          <FormGroup check>
            <Label check>
              <Input type="radio" name="radio1" />{' '}
              Station Kiosk
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="radio" name="radio1" />{' '}
              Onboard
            </Label>
          </FormGroup>
        </FormGroup>
        <FormGroup>
        <Label for="exampleNumber" className="p-2 center">How many rides will you need?</Label>
        <Input type="number" name="number" id="exampleNumber" placeholder="enter number here" />
      </FormGroup>
        <Button className="p-2 center">Submit</Button>
      </Form>
    );
  }
}