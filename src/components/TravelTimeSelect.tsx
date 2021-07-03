import SelectDropdown from './generic-form-components/SelectDropdown';

type TravelTimeSelectProps = {
  travelTime: string,
  setTravelTime: (val: string) => void,
  options: Array<string>,
  info: string,
}

const TravelTimeSelect = ({ travelTime, setTravelTime, options, info } : TravelTimeSelectProps) => (
    <div className="section with-bottom-border">
      <SelectDropdown
        value={travelTime}
        label="Where are you going?"
        placeholderText="Select Travel Time"
        options={options}
        onChange={e => setTravelTime(e.target.value)}
      />
      {info && <div className="info-helper-text">{info}</div>}
    </div>
);

export default TravelTimeSelect;