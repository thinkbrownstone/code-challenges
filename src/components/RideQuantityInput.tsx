import './RideQuantityInput.css';

type RideQuantityProps = {
  quantity: number,
  setQuantity: (value: any) => void,
}

const RideQuantityInput = ({ quantity, setQuantity } : RideQuantityProps) => (
  <div className="section">
    <label>How many rides will you need?</label>
    <input
      className="ride-quantity-input"
      name="Quantity of tickets"
      type="number"
      pattern="[0-9]*"
      value={quantity}
      onChange={(e) => setQuantity(Number(e.target.value))}
    />
  </div>
);

export default RideQuantityInput; 
