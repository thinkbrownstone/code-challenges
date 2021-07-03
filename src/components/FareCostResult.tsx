import React from 'react';
import './FareCostResult.css';

type FareCostResultProps = {
  fareCost: string,
}

const FareCostResult = ({ fareCost } : FareCostResultProps) => (
  <div className="septa-calc-widget-result">
    {fareCost && (
      <div style={{ textAlign: "center" }}>
        <div className="fare-cost-label">Your fare will cost</div>
        <div className="fare-cost">${fareCost}</div>
      </div>
    )}
  </div>
);

export default FareCostResult;