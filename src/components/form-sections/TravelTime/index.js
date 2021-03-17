import "./TravelTime.css";

// Component with controlled input for travel timings
const TravelTime = ({ travelTime, setTravelTime, options, info }) => {
  // Function assumes that any multi-word options will be in the format first_second
  const formatOptions = option => {
    let arr = option.split('_');
    arr.forEach((item, i, array) => {
      array[i] = item[0].toUpperCase(0) + item.slice(1);
    })
    return arr.join(' / ');
  }
  
  return (
    <div className="travel-time-section">
      <div>When are you riding?</div>
      <div className="travel-time-select-div">
        <select
          className='travel-time-select-div-select'
          name={travelTime}
          value={travelTime}
          onChange={e => setTravelTime(e.target.value)}>
          <option value="">Choose Travel Time</option>
          {options
          .map(option => (
            <option
              key={option}
              value={option}
            >{formatOptions(option)}</option> // Formatting options for readability
          ))}
        </select>
      </div>
      <div className="travel-time-info-div">{info}</div>
    </div>
  );
};

export default TravelTime;
