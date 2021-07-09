import React from 'react'
import PropTypes from 'prop-types'

import './TotalCost.scss'


const calcTotal = (data, selected) => {
    const selectedZone = data.zones[selected.zoneIdx]
    const fare = selectedZone.fares.find(fare => {
        const isType = fare.type === selected.type
        const isPurchaseType = fare.purchase === selected.purchase
        return isType && isPurchaseType
    })
    
    let total = selected.rides * fare.price
    if (selected.type === 'anytime') {
        total = total / 10
    }
    return `$${total.toFixed(2)}`
}

const TotalCost = ({ data, selected }) => {
    const total = calcTotal(data, selected)
    return (
        <div className="total-cost-comp">
            <h3>Your fare will cost</h3>
            <strong className="total" aria-live="polite">{total}</strong>
        </div>
    )
}

TotalCost.propTypes = {
    data: PropTypes.object.isRequired,
    selected: PropTypes.object.isRequired,
}

export default TotalCost