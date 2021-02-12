import React from 'react';

const Zones = ({ availableZones, updateZone }) => {
  let zoneOptions = availableZones.map((zone, idx) => {
  return (<option key={idx} value={zone.zone}>{zone.name}</option>);
  });

  return (
    <div className="zone-selection-container">
      <h2>Where are you going?</h2>
        <select className="selection-form" name="zones" onChange={updateZone}>
          {zoneOptions}
        </select>
    </div>
  )
};

export default Zones;
