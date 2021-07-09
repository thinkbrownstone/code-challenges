import React from 'react'
import PropTypes from 'prop-types'

import './FareTypeSelect.scss'

const FARE_TYPES = {
    weekday: 'Weekdays',
    evening_weekend: 'Evenings / Weekends',
    anytime: 'Anytime',
}

// Filter fares array to only include one of each type.
// This component only needs to "know" of each fare type;
// determining which price to use for a fare type will be
// handled in the calculator using the selected purchase method
// for that fare type.
const filterDuplicateFareTypes = fares => {
    const types = fares.map(fare => fare.type)
    return fares.filter((fare, idx) => types.indexOf(fare.type) === idx)
}

const FareTypeSelect = ({ fares, info, selected, onChange }) => {
    const filteredFares = filterDuplicateFareTypes(fares)
    
    return (
        <div className="fare-type-select-comp">
            <select 
                aria-label="When are you riding?"
                value={selected} 
                onChange={e => onChange(e.target.value)}>
                {filteredFares.map(fare => (
                    <option key={fare.type} value={fare.type}>
                        {FARE_TYPES[fare.type]}
                    </option>
                ))}
            </select>
            <p className="helper-text" aria-live="polite">{info[selected]}</p>
        </div>
    )
}

FareTypeSelect.propTypes = {
    fares: PropTypes.array.isRequired,
    info: PropTypes.object.isRequired,
    selected: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    onChange: PropTypes.func.isRequired,
}
export default FareTypeSelect