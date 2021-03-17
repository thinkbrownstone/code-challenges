import './Location.css';

// Component with controlled inputs for fare purchase location
const Location = ({ location, setLocation }) => {
  return (
    <div className="location-section">
      <div>Where will you purchase the fare?</div>
      <div className="location-radio-buttons">
        <div>
          <input
            onChange={(e) => setLocation(e.target.value)}
            type="radio"
            name="Station Kiosk"
            value="advance_purchase"
            checked={location === "advance_purchase"}
          />
          <label htmlFor="Station Kiosk">Station Kiosk</label>
        </div>
        <div>
          <input
            onChange={(e) => setLocation(e.target.value)}
            type="radio"
            name="Onboard"
            value="onboard_purchase"
            checked={location === "onboard_purchase"}
          />
          <label htmlFor="Onboard">Onboard</label>
        </div>
      </div>
    </div>
  );
}

export default Location;