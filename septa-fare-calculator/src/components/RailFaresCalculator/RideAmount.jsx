import React from 'react'
import PropTypes from 'prop-types'

import './RideAmount.scss'

const RideAmount = ({ selected, isBulk, onChange }) => {
    return (
        <input className="ride-amount-comp"
            type="number"
            min="0"
            step={isBulk ? 10 : 1}
            value={selected}
            onChange={e => onChange(Number(e.target.value))}
        />
    )
    
}
RideAmount.propTypes = {
    selected: PropTypes.number.isRequired,
    isBulk: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default RideAmount