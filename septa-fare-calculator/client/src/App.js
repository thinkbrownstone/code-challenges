import './App.css';
import { useEffect, useState } from 'react';
import { ReactComponent as SeptaLogo } from './septa_logo.svg'
const fareJson = require('./fares.json')

function App() {

  const [zone, setZone] = useState(1)
  const [timeSlot, setTimeSlot] = useState('weekday')
  const [purchaseLocation, setPurchaseLocation] = useState('advance_purchase')
  const [numRides, setNumRides] = useState(1)
  const [calculatedFare, setCalculatedFare] = useState(0)


  // fetch('../../fares.json')
  //   .then(res => console.log(res))
  //   .then(data => console.log(data))

  // Tried AJAX/Fetch request above, it choked on JSON formatting
  // Simply imported it on line 4 above instead
  
  const zones = fareJson.zones
  const calculateFare = (zone, timeSlot, purchaseLocation, numRides) => {
    let singleFarePrice
    if(numRides > 9 && purchaseLocation === 'advance_purchase'){
      let faresArray = zones[zone - 1].fares
      // 10+ price always last item in faresArray
      let bulkFare = faresArray[faresArray.length - 1]
      singleFarePrice = bulkFare.price / 10
    } else {
      zones[zone - 1].fares.forEach((fare) => {
        if(fare.purchase === purchaseLocation && fare.type === timeSlot) {
          singleFarePrice = fare.price
        }
      })
    }
    return singleFarePrice * numRides
  }

  // Recalculate and display new price on each re-render
  useEffect(()=> {
    const newPrice = calculateFare(zone, timeSlot, purchaseLocation, numRides)
    // Round and format floats to two decimal places
    const formattedPrice = parseFloat(newPrice).toFixed(2)
    setCalculatedFare(formattedPrice)
  }, [zone, timeSlot, purchaseLocation, numRides])


  const handleZoneSelect = (e) => {
    setZone(parseInt(e.target.value))
  }
  const handleTimeSlotSelect = (e) => {
    setTimeSlot(e.target.value)
  }
  const handlePurchaseLocationChange = (e) => {
    setPurchaseLocation(e.target.value)
  }
  const handleNumRideChange = (e) => {
    setNumRides(parseInt(e.target.value))
  }

  // Conditional Info
  let timeSlotText = ''
  if(timeSlot === 'weekday') {
    timeSlotText = fareJson.info.weekday
  } else if (timeSlot === 'evening_weekend') {
    timeSlotText = fareJson.info.evening_weekend
  }

  let discountInfo = ''
  if(numRides > 6 && purchaseLocation === 'advance_purchase') {
    discountInfo = 'Special pricing on 10+ tickets purchased at Kiosk in advance.'
  }

  return (
    <div className="App">
      <div className="main-wrapper">
        <div className="top-header">
          <SeptaLogo />
          <div className="header-text">Regional Rail Fares</div>
        </div>
        <div className="card-content">
          
          {/* Zone Select */}
          <div className="content-section">
            <div className="content-heading">Where are you going?</div>
            <select name="zones" onChange={handleZoneSelect} value={zone}>
              <option value="1">Zone 1</option>
              <option value="2">Zone 2</option>
              <option value="3">Zone 3</option>
              <option value="4">Zone 4</option>
              <option value="5">Zone 5</option>
            </select>
          </div>

          {/* TimeSlot Select */}
          <div className="content-section">
            <div className="content-heading">When are you riding?</div>
            <select name="time" onChange={handleTimeSlotSelect} value={timeSlot}>
              <option value="weekday">Weekday</option>
              <option value="evening_weekend">Evening or Weekend</option>
            </select>
            <div className="timeslot-info">{timeSlotText}</div>
          </div>

          {/* Radio Buttons */}
          <div className="content-section">
            <div className="content-heading">Where will you purchase the fare?</div>
            <div>
              <label className="radio-button">
                <input
                    checked={purchaseLocation === 'advance_purchase'}
                    name="purchase_location"
                    onChange={handlePurchaseLocationChange}
                    type="radio"
                    value="advance_purchase"
                />
                <span>Station Kiosk</span>
              </label>
            </div>                  
            <div style={{ marginTop: '3px' }}>
              <label className="radio-button">
                <input
                    checked={purchaseLocation === 'onboard_purchase'}
                    name="purchase_location"
                    onChange={handlePurchaseLocationChange}
                    type="radio"
                    value="onboard_purchase"
                />
                <span>Onboard</span>
              </label>
            </div>
          </div>
          
          {/* Num Rides Input */}
          <div className="content-section">
            <div className="content-heading">How many rides will you need?</div>
            <input className="num-rides-input" type="number" min="1" max="9999" onChange={handleNumRideChange} value={numRides}></input>
            <div className="discount-info">{discountInfo}</div>
          </div>

        </div>
        <div className="fare-footer">
          <div className="footer-text">Your fare will cost</div>
          <div className="final-price">{`$${isNaN(calculatedFare) ? 0 : calculatedFare}`}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
