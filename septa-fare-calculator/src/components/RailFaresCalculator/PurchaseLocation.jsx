import React from 'react'
import PropTypes from 'prop-types'

import './PurchaseLocation.scss'

const PurchaseLocation = ({ selected, isBulk, onChange}) => {
    return (
        <div className="purchase-location-comp">
            <div className="inputs-wrapper" role="radiogroup">
                <label>
                    <input type="radio"
                        id="station"
                        value="advance_purchase"
                        name="purchase"
                        checked={selected === 'advance_purchase'}
                        aria-checked={selected === 'advance_purchase'}
                        onChange={e => onChange(e.target.value)}
                    />
                    Station Kiosk
                </label>
                <label>
                    <input type="radio"
                        id="onboard"
                        value="onboard_purchase"
                        name="purchase"
                        disabled={isBulk}
                        checked={selected === 'onboard_purchase'}
                        aria-checked={selected === 'onboard_purchase'}
                        onChange={e => onChange(e.target.value)}
                    />
                    Onboard
                </label>
            </div>
        </div>
    )
}

PurchaseLocation.propTypes = {
    selected: PropTypes.string.isRequired,
    isBulk: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default PurchaseLocation