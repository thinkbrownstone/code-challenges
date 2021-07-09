import React, { useState } from 'react'
import PropTypes from 'prop-types'

import FormSection from './FormSection'
import ZoneSelect from './ZoneSelect'
import FareTypeSelect from './FareTypeSelect'
import PurchaseLocation from './PurchaseLocation'
import RideAmount from './RideAmount'
import TotalCost from './TotalCost'
import septaLogo from './septa-logo.png'

import './index.scss'


// Set a defaulted zone index so fares array can reflect data from server
const defaultValues = {
    zoneIdx: 0,
    type: 'weekday',
    purchase: 'advance_purchase',
    rides: 0,
}

const RailFaresCalculator = ({ data }) => {
    const [selected, setSelected] = useState(defaultValues)

    // If anytime is selected: 
    //  1. rides: round to the nearest 10, due to those tickets
    //     only being allowed to be bought in multiples of 10
    //  2. purchase: set to advanced_purchase, as that is the only acceptable
    //     purchase method for anytime tickets
    const updateFareType = type => {
        const update = { ...selected, type }
        const isBulk = type === 'anytime'
        if (isBulk) {
            if (selected.rides % 10 > 0) {
                update.rides = Math.round(selected.rides / 10) * 10
            }
            update.purchase = 'advance_purchase'
        }
        setSelected(update)
    }

    return (
        <div className="rail-fares-calculator-comp">
            <div className="calc-title">
                <img src={septaLogo}
                    alt="SEPTA logo"
                    width="40"
                    height="auto"
                />
                <h2>
                    Regional Rail Fares
                </h2>
            </div>
            <FormSection title="Where are you going?">
                <ZoneSelect
                    zones={data.zones}
                    selected={selected.zoneIdx}
                    onChange={zoneIdx => setSelected({ ...selected, zoneIdx })}
                />
            </FormSection>
            <hr/>
            <FormSection title="When are you riding?">
                <FareTypeSelect
                    info={data.info}
                    fares={data.zones[selected.zoneIdx].fares}
                    selected={selected.type}
                    onChange={type => updateFareType(type)}
                />
            </FormSection>
            <hr/>
            <FormSection title="Where will you purchase the fare?">
                <PurchaseLocation
                    selected={selected.purchase}
                    isBulk={selected.type === 'anytime'}
                    onChange={purchase => setSelected({ ...selected, purchase })}
                />
            </FormSection>
            <hr/>
            <FormSection title="How many rides will you need">
                <RideAmount
                    selected={selected.rides}
                    isBulk={selected.type === 'anytime'}
                    onChange={rides => setSelected({ ...selected, rides })}
                />
            </FormSection>
            <TotalCost data={data} selected={selected} />
        </div>
    )
}

RailFaresCalculator.data = {
    data: PropTypes.object.isRequired,
}

export default RailFaresCalculator