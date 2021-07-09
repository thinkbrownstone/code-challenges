import React, { useState, useEffect } from 'react'

import RailFaresCalculator from './components/RailFaresCalculator'

import './RailFares.scss'


const LOAD_ERROR = 'An error occurred while fetching rail fares.'

const RailFares = () => {
    const [data, setData] = useState({})
    const [hasLoaded, setHasLoaded] = useState(false)
    const [error, setError] = useState(null)

    // Load zone/fares data from server.
    // Show loading state until data has been retrieved.
    // Show error state if fetching data from server fails.
    useEffect(() => {
        setHasLoaded(false)
        setError(null)
        
        fetch('/api/fares')
            .then(response => response.json())
            .then(json => {
                setData(json)
                setHasLoaded(true)
            })
            .catch(() => setError(LOAD_ERROR))
    }, [setData, setHasLoaded, setError])

    return (
        <div className="rail-fares-comp">
            {hasLoaded ?
                <RailFaresCalculator data={data} />
                :
                <div>
                    <span aria-live="polite">
                        {error ? `${error}` : 'loading...'}
                    </span>
                </div>
            }
        </div>
    )
}

export default RailFares