import React from 'react'

function RadioButtons(props) {

    // defeine array of possible radio buttons
    let radios = props.options.map((option, index) => {
        return (
            <label key={index} htmlFor={option.display}>
                <input type="radio" name={option.display} value={option.value} checked={option.value === props.selected} onChange={props.onChange}/>
                {option.display} <br />
            </label>
        )     
    });        
    
    return (
        <fieldset>
            <div className="question-heading">{props.label}</div>
            {radios}
        </fieldset>
    )
}

export default RadioButtons
