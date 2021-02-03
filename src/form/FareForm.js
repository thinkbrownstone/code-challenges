import React, { useEffect, useState, useCallback } from 'react';
import {
  Zone,
  RideTime,
  FarePurchaseLocation,
  RideAmount,
  Result,
} from '../sections';
// Utilized CSS module to prevent any CSS name collisions in the rest of the app
import styles from '../index.module.css';
// tells Webpack to use this svg image on build
import img from '../septa-logo.svg';

// Utilized controlled components for managing form state
function FareForm() {
  const [data, setData] = useState(null);
  const [zone, setZone] = useState('');
  const [rideTime, setRideTime] = useState('');
  const [farePurchaseLocation, setFarePurchaseLocation] = useState('');
  const [rideAmount, setRideAmount] = useState(0);
  const [result, setResult] = useState('');

  // Utilized useCallback so that function won't rerender on component rerender
  const fetchFareData = useCallback(async () => {
    const res = await fetch(
      'https://raw.githubusercontent.com/thinkcompany/code-challenges/master/septa-fare-calculator/fares.json'
    );

    // This part of the app ensures that any errors in the request are caught. Potential to create an error modal to display
    // these errors down the line.
    try {
      res.data = await res.json();

      if (res.ok) {
        setData(res.data);
        return;
      } else {
        setData({
          message:
            'Sorry, there was an issue loading the application data. Please refresh and try again.',
        });
      }
    } catch (e) {
      console.error(e.message);
      setData({
        message:
          'Sorry, there was an issue loading the application data. Please refresh and try again.',
      });
    }
  }, []);

  // Fetches fare data on initial render
  useEffect(() => {
    fetchFareData();
  }, [fetchFareData]);

  // Calculates the input data into the result once it is all valid
  useEffect(() => {
    if (zone && rideTime && farePurchaseLocation && rideAmount) {
      for (const zoneData of data.zones) {
        if (zone === zoneData.zone) {
          for (const fare of zoneData.fares) {
            if (
              fare.type === rideTime &&
              fare.purchase === farePurchaseLocation
            ) {
              setResult(((fare.price / fare.trips) * rideAmount).toFixed(2));
              return;
            }
          }
        }
      }
    } else {
      setResult(null);
      return;
    }
  }, [zone, rideTime, farePurchaseLocation, rideAmount]);

  const { outerContainer, container, header, logo, form } = styles;

  return (
    <div className={outerContainer}>
      <section className={container}>
        <header className={header}>
          <img src={img} alt="SEPTA" className={logo} />
          <h1>Regional Rail Fares</h1>
        </header>
        <form className={form} onSubmit={(e) => e.preventDefault()}>
          <Zone
            zone={zone}
            setZone={setZone}
            zones={data ? data.zones : null}
          />
          <RideTime
            rideTime={rideTime}
            setRideTime={setRideTime}
            rideTimes={data ? Object.keys(data.info).slice(0, 3) : null}
            displayText={data ? data.info[rideTime] : ''}
          />
          <FarePurchaseLocation
            farePurchaseLocation={farePurchaseLocation}
            farePurchaseLocations={
              data ? Object.keys(data.info).slice(3) : null
            }
            setFarePurchaseLocation={setFarePurchaseLocation}
          />
          <RideAmount rideAmount={rideAmount} setRideAmount={setRideAmount} />
        </form>
        <Result result={result} />
      </section>
    </div>
  );
}

export default FareForm;
