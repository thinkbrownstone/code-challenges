import React from 'react'
import PropTypes from 'prop-types'

const ZoneSelect = ({ zones, selected, onChange }) => {
    return (
        <select
            aria-label="Where are you going?"
            value={selected} 
            onChange={e => onChange(e.target.value)}>
            {zones.map((zone, idx) => (
                <option key={zone.zone} value={idx}>
                    {zone.name}
                </option>
            ))}
        </select>
    )
}

ZoneSelect.propTypes = {
    zones: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default ZoneSelect