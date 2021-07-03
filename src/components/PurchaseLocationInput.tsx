import './PurchaseLocationInput.css';
import RadioInput from './generic-form-components/RadioInput';

type PurchaseLocationInputProps = {
  locationValue: string,
  setLocationValue: (val: string) => void,
  info: string,
}

const PurchaseLocationInput = ({ locationValue, setLocationValue, info } : PurchaseLocationInputProps) => (
  <div className="section with-bottom-border">
    <label>Where will you purchase the fare?</label>
    <div className="location-radio-buttons">
      <RadioInput
        label="Station Kiosk"
        value="advance_purchase"
        checked={locationValue === "advance_purchase"}
        onChange={(e) => setLocationValue(e.target.value)}
      />
      <RadioInput
        label="Onboard"
        value="onboard_purchase"
        checked={locationValue === "onboard_purchase"}
        onChange={(e) => setLocationValue(e.target.value)}
      />
    </div>
    {info && <div className="info-helper-text">{info}</div>}
  </div>
);

export default PurchaseLocationInput; 