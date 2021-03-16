import './Zone.css';

const Zone = ({ zone, setZone, options }) => {
  return (
    <div className='zone-section'>
      <div>Where are you going?</div>
      <div className='zone-select-div'>
        <select name={zone} value={zone} onChange={e => setZone(e.target.value)}>
          <option value=''>Select Zone</option>
          {options.map(option => (
            <option
              key={option.name}
              value={option.name}
            >{option.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Zone;