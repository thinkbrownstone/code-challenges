import React, { useEffect, useState } from 'react';
import ZoneInput from './ZoneInput';
import TravelTimeSelect from './TravelTimeSelect';
import PurchaseLocationInput from './PurchaseLocationInput';
import RideQuantityInput from './RideQuantityInput';
import { Fare, Zone } from '../types';
import FareCostResult from './FareCostResult';

type SeptaCalcWidgetProps = {
  service: any,
}

const SeptaCalcWidget = ({ service } : SeptaCalcWidgetProps) => {
    const [zoneValue, setZoneValue] = useState('');
    const [travelTime, setTravelTime] = useState('');
    const [locationValue, setLocationValue] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [fareCost, setFareCost] = useState('');

    useEffect(() => {
      if(zoneValue && travelTime && locationValue && quantity && service) {
        const { zones } = service.payload;
        const selectedZoneObj = zones.filter((z: Zone) => z.name === zoneValue)[0];
        const fare = selectedZoneObj.fares.filter((f: Fare) => (f.type === travelTime) && (f.purchase === locationValue))[0];
        
        /* fallback graciously where anytime option is not available */
        if ((locationValue === 'onboard_purchase' && travelTime === 'anytime') ||
            (locationValue === 'advance_purchase' && travelTime === 'anytime' && quantity <10)) {
          setTravelTime(Object.keys(service.payload.info)[1]);
        }
        if (fare) {
          setFareCost(((Number(fare.price) / Number(fare.trips)) * Number(quantity)).toFixed(2));
        }
      }
      return () => setFareCost('');
    }, [zoneValue, travelTime, locationValue, quantity, service])
    
    return (
      <>
        <div className="flex">
          <ZoneInput zone={zoneValue} setZoneValue={setZoneValue} options={service.payload.zones} />
          <TravelTimeSelect
              travelTime={travelTime}
              setTravelTime={setTravelTime}
              // filters the dropdown options base on ride quantity and purchase location
              options={Number(quantity) >= 10 && locationValue === 'advance_purchase'
                    ? Object.keys(service.payload.info).slice(0, 3)
                    : Object.keys(service.payload.info).slice(1, 3)
              }
              info={service.payload.info[travelTime]}
          />
          <PurchaseLocationInput
            locationValue={locationValue}
            setLocationValue={setLocationValue}
            info={service.payload.info[locationValue]}
          />
          <RideQuantityInput quantity={Number(quantity)} setQuantity={setQuantity} />
        </div>
        <FareCostResult fareCost={fareCost} />
      </>
    );
};

export default SeptaCalcWidget;