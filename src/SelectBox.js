import React from 'react'

function SelectBox(props) {
    // define array of possible options
    let options = props.options.map((option, index) => (
        <option 
            value={option.value} 
            key={index}
            children={option.display}
        />        
    ))
    // define array
    var info = (props.info) ? <p>{props.info}</p> : '';
    return (
        <fieldset>
            <label className="question-heading" htmlFor={props.question}>{props.label}</label><br />
            <select id={props.question} onChange={props.onChange}>
                {options}
            </select>
            {info}
        </fieldset>
    );
}

export default SelectBox
